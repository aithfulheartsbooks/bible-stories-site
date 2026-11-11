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
index may appear again when the recording repeats the line. Leave a line
out of the cue list when this script does not report it.

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
}


def norm(words: list[str]) -> list[str]:
    return [SYN.get(word, word) for word in words]


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


def transcribe(path: Path) -> tuple[float, list[dict]]:
    from faster_whisper import WhisperModel

    model = WhisperModel("small", device="cpu", compute_type="int8")
    segments, info = model.transcribe(
        str(path),
        language="en",
        vad_filter=False,
        word_timestamps=True,
        beam_size=5,
    )
    words = []
    end = 0.0
    for segment in segments:
        end = max(end, float(segment.end))
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
            end = max(end, float(word.end))
    duration = float(getattr(info, "duration", 0) or end)
    return duration, words


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
            if best >= 0.8 and best_end > index:
                cands.append((index, best_end, line_index, best, heard[index]["start"]))
    cands.sort(key=lambda item: (item[0], -item[3]))
    chosen = []
    cursor = 0
    for start, end, line_index, score, at in cands:
        if start < cursor:
            continue
        chosen.append({"line": line_index, "start": at, "score": round(score, 2)})
        cursor = end
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


def main() -> int:
    parser = argparse.ArgumentParser(description="Align a sing-along video to printed lines.")
    parser.add_argument("video_id")
    parser.add_argument("--audio", help="Skip yt-dlp and transcribe this file.")
    parser.add_argument("--lines", help="Text file of printed lines, one per line.")
    parser.add_argument("--align", action="store_true", help="Snap cue starts with WhisperX.")
    args = parser.parse_args()
    if not re.fullmatch(r"[\w-]{6,}", args.video_id):
        print("video id looks wrong", file=sys.stderr)
        return 1

    cleanup = None
    audio = Path(args.audio) if args.audio else None
    if audio is None:
        cleanup = tempfile.TemporaryDirectory(prefix="align-songs-")
        audio = Path(cleanup.name) / f"{args.video_id}.m4a"
        download(args.video_id, audio)
    duration, words = transcribe(audio)
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
