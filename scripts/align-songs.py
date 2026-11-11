#!/usr/bin/env python3
"""
Re-time one sing-along from the recording. Does not guess.

  python scripts/align-songs.py <videoId>
  python scripts/align-songs.py <videoId> --lines lyrics.txt

The first form downloads the audio with yt-dlp and prints word times from
faster-whisper (English, voice-activity filter off, so sung lines are not
dropped). The second form also fuzzy-matches each non-empty line in
lyrics.txt onto those words and prints cue candidates:

  { "line": 0, "start": 12.86, "score": 1.0 }

`line` is the 0-based index of a non-empty line in lyrics.txt. Map that
onto the lyrics array in lib/songs.ts (labels are not lines). The same
index may appear again when the recording repeats the line. A printed
line with no cue at score 0.6 or better was not heard in this recording.

Write the catalog manifest with:

  python scripts/align-songs.py --catalog catalog.json --out data/song-alignment.json

catalog.json is a list of {slug, videoId, audio, lines}. The manifest maps
each slug to {videoId, duration, cues}. lib/song-alignment.test.ts fails
when a printed line has no cue scoring 0.6 or better, or when the manifest
video id does not match the song.

Requires ffmpeg, yt-dlp, and `pip install faster-whisper`.
Optional: `pip install whisperx` and `--align` to snap each matched line
with wav2vec2 forced alignment. YouTube may block datacenter IPs; pass
an already downloaded file with --audio.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import tempfile
from difflib import SequenceMatcher
from pathlib import Path


def tokens(text: str) -> list[str]:
    text = text.lower().replace("'", "").replace("'", "")
    text = text.replace("-", " ")
    return re.findall(r"[a-z0-9]+", text)


SYN = {
    "ive": "i",
    "im": "i",
    "dont": "do",
    "ye": "you",
    "thee": "you",
    "thy": "your",
    "oh": "o",
    "gonna": "going",
    "hallelujah": "hallelu",
    "jo": "jonah",
    "joe": "jonah",
    "hulit": "whodid",
    "wail": "whale",
    "passeth": "passes",
    "hath": "had",
    "saviour": "savior",
    "allelu": "hallelu",
}


def norm(words: list[str]) -> list[str]:
    """Fold transcript spellings that are the same sung word.

    "hulit" is the who-did stutter. "to Lord" is Do Lord. "whodid" splits
    back into the two printed words so the line can score.
    """
    folded: list[str] = []
    for index, word in enumerate(words):
        word = SYN.get(word, word)
        nxt = words[index + 1] if index + 1 < len(words) else ""
        nxt = SYN.get(nxt, nxt)
        if word == "to" and nxt == "lord":
            word = "do"
        if word == "whodid":
            folded.extend(["who", "did"])
            continue
        folded.append(word)
    return folded


def download(video_id: str, dest: Path) -> None:
    url = f"https://www.youtube.com/watch?v={video_id}"
    subprocess.run(
        [
            "yt-dlp",
            "-f",
            "ba/b",
            "--no-playlist",
            "-o",
            str(dest),
            url,
        ],
        check=True,
    )


def load_audio(path: Path):
    """16 kHz mono float32. ffmpeg avoids a faster-whisper/PyAV decode mismatch."""
    import numpy as np

    raw = subprocess.check_output(
        [
            "ffmpeg",
            "-nostdin",
            "-threads",
            "0",
            "-i",
            str(path),
            "-f",
            "s16le",
            "-ac",
            "1",
            "-acodec",
            "pcm_s16le",
            "-ar",
            "16000",
            "-",
        ],
        stderr=subprocess.DEVNULL,
    )
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768.0


def match_lines(lines: list[str], words: list[dict]) -> list[dict]:
    line_toks = [norm(tokens(line)) for line in lines]
    heard = []
    for word in words:
        tok = tokens(word["word"])
        if tok:
            heard.append({**word, "tok": tok[0]})
    cands = []
    for index in range(len(heard)):
        for line_index, line in enumerate(line_toks):
            if not line:
                continue
            best = 0.0
            best_end = index + 1
            for extra in range(-1, 3):
                length = max(1, len(line) + extra)
                if index + length > len(heard):
                    continue
                chunk = norm([heard[i]["tok"] for i in range(index, index + length)])
                score = SequenceMatcher(None, line, chunk).ratio()
                if score > best:
                    best = score
                    best_end = index + length
            if best >= 0.6 and best_end > index:
                cands.append((index, best_end, line_index, best, len(line)))
    # Earliest start, then the higher score, then the longer line.
    cands.sort(key=lambda item: (item[0], -item[3], -item[4]))
    chosen = []
    cursor = 0
    for start, end, line_index, score, _length in cands:
        if start < cursor:
            continue
        use = start
        first = line_toks[line_index][0] if line_toks[line_index] else ""
        current = norm([heard[start]["tok"]])[0]
        # A one-word-early window (the previous line's last word) still
        # scores, but the highlight belongs on this line's first word.
        if current != first and start + 1 < end and norm([heard[start + 1]["tok"]])[0] == first:
            snapped_end = end
            chunk = norm([heard[i]["tok"] for i in range(start + 1, snapped_end)])
            snapped = SequenceMatcher(None, line_toks[line_index], chunk).ratio()
            if snapped >= 0.6:
                use = start + 1
                score = snapped
        chosen.append(
            {"line": line_index, "start": round(float(heard[use]["start"]), 2), "score": round(score, 2)}
        )
        cursor = end
    # Identical printed lines share one match. Hand each singing to the next copy.
    groups: dict[tuple[str, ...], list[int]] = {}
    for line_index, line in enumerate(line_toks):
        groups.setdefault(tuple(line), []).append(line_index)
    cursors = {key: 0 for key in groups}
    for cue in chosen:
        key = tuple(line_toks[cue["line"]])
        copies = groups[key]
        cue["line"] = copies[cursors[key] % len(copies)]
        cursors[key] += 1
    return chosen


def align_cues(audio_path: Path, lines: list[str], cues: list[dict]) -> list[dict]:
    import whisperx

    audio = whisperx.load_audio(str(audio_path))
    duration = len(audio) / 16000
    model, metadata = whisperx.load_align_model(language_code="en", device="cpu")
    segments = []
    for cue in cues:
        segments.append(
            {
                "text": lines[cue["line"]],
                "start": max(0.0, cue["start"] - 0.3),
                "end": min(duration - 0.05, cue["start"] + 8),
            }
        )
    aligned = whisperx.align(segments, model, metadata, audio, "cpu")
    snapped = []
    for cue, segment in zip(cues, aligned["segments"]):
        timed = [word for word in (segment.get("words") or []) if word.get("start") is not None]
        if not timed:
            snapped.append(cue)
            continue
        snapped.append({**cue, "start": round(float(timed[0]["start"]), 2)})
    return snapped


def manifest_song(video_id: str, audio: Path, lines: list[str], model) -> dict:
    """One song's measured cues. `lines` are the printed lines, in order."""
    samples = load_audio(audio)
    words = transcribe_with_model(samples, model)
    cues = match_lines(lines, words)
    return {
        "videoId": video_id,
        "duration": round(len(samples) / 16000, 2),
        "cues": cues,
    }


def transcribe_with_model(audio, model) -> list[dict]:
    segments, _info = model.transcribe(
        audio,
        language="en",
        vad_filter=False,
        word_timestamps=True,
        beam_size=5,
    )
    words = []
    for segment in segments:
        for word in segment.words or []:
            if word.start is None:
                continue
            words.append(
                {
                    "word": word.word.strip(),
                    "start": round(float(word.start), 2),
                    "end": round(float(word.end), 2),
                }
            )
    return words


def transcribe(path: Path, model_name: str) -> tuple[float, list[dict]]:
    from faster_whisper import WhisperModel

    audio = load_audio(path)
    model = WhisperModel(model_name, device="cpu", compute_type="int8")
    words = transcribe_with_model(audio, model)
    return len(audio) / 16000, words


def write_catalog(catalog_path: Path, out_path: Path, model_name: str) -> dict:
    from faster_whisper import WhisperModel

    catalog = json.loads(catalog_path.read_text())
    model = WhisperModel(model_name, device="cpu", compute_type="int8")
    manifest = {}
    words_path = out_path.with_suffix(".words.json")
    words_out: dict[str, list] = {}
    if words_path.exists():
        words_out = json.loads(words_path.read_text())
    for song in catalog:
        print(f"align {song['slug']}", file=sys.stderr, flush=True)
        samples = load_audio(Path(song["audio"]))
        words = transcribe_with_model(samples, model)
        cues = match_lines(song["lines"], words)
        entry = {
            "videoId": song["videoId"],
            "duration": round(len(samples) / 16000, 2),
            "cues": cues,
        }
        manifest[song["slug"]] = entry
        words_out[song["slug"]] = words
        missing = []
        by_line: dict[int, float] = {}
        for cue in entry["cues"]:
            by_line[cue["line"]] = max(by_line.get(cue["line"], 0), cue["score"])
        for index, line in enumerate(song["lines"]):
            if by_line.get(index, 0) < 0.6:
                missing.append(line)
        if missing:
            print(f"  missing {len(missing)}: {missing[0][:60]}", file=sys.stderr, flush=True)
        out_path.write_text(json.dumps(manifest, indent=2) + "\n")
        words_path.write_text(json.dumps(words_out) + "\n")
    return manifest


def main() -> int:
    parser = argparse.ArgumentParser(description="Align a sing-along video to printed lines.")
    parser.add_argument("video_id", nargs="?")
    parser.add_argument("--audio", help="Skip yt-dlp and transcribe this file.")
    parser.add_argument("--lines", help="Text file of printed lines, one per line.")
    parser.add_argument("--align", action="store_true", help="Snap cue starts with WhisperX.")
    parser.add_argument("--catalog", help="JSON list of {slug, videoId, audio, lines} to write a manifest.")
    parser.add_argument("--out", help="Manifest path used with --catalog.")
    parser.add_argument("--model", default="medium", help="faster-whisper model. medium hears sung repeats that small drops.")
    args = parser.parse_args()
    if args.catalog:
        if not args.out:
            print("--out is required with --catalog", file=sys.stderr)
            return 1
        write_catalog(Path(args.catalog), Path(args.out), args.model)
        return 0
    if not args.video_id or not re.fullmatch(r"[\w-]{6,}", args.video_id):
        print("video id looks wrong", file=sys.stderr)
        return 1

    cleanup = None
    audio = Path(args.audio) if args.audio else None
    if audio is None:
        cleanup = tempfile.TemporaryDirectory(prefix="align-songs-")
        audio = Path(cleanup.name) / f"{args.video_id}.m4a"
        download(args.video_id, audio)
    duration, words = transcribe(audio, args.model)
    payload: dict = {"videoId": args.video_id, "duration": round(duration, 2), "words": words}
    if args.lines:
        lines = [line.strip() for line in Path(args.lines).read_text().splitlines() if line.strip()]
        cues = match_lines(lines, words)
        if args.align:
            cues = align_cues(audio, lines, cues)
        payload["cues"] = cues
    print(json.dumps(payload, indent=2))
    if cleanup:
        cleanup.cleanup()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
