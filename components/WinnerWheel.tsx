"use client";

import { useEffect, useRef, useState } from "react";

const COLORS = [
  "#C0392B", "#E67E22", "#F1C40F", "#27AE60",
  "#2980B9", "#8E44AD", "#16A085", "#D35400",
  "#C0392B", "#2ECC71", "#3498DB", "#9B59B6",
];

function drawWheel(
  canvas: HTMLCanvasElement,
  entries: string[],
  rotation: number
) {
  const ctx = canvas.getContext("2d")!;
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const arc = (2 * Math.PI) / entries.length;

  ctx.clearRect(0, 0, size, size);

  entries.forEach((entry, i) => {
    const start = rotation + i * arc;
    const end = start + arc;

    // Segment
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${Math.max(10, Math.min(14, 280 / entries.length))}px sans-serif`;
    const label =
      entry.length > 18 ? entry.slice(0, 16) + "…" : entry;
    ctx.fillText(label, r - 10, 4);
    ctx.restore();
  });

  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Pointer (top)
  const px = cx;
  const py = 2;
  ctx.beginPath();
  ctx.moveTo(px - 12, py);
  ctx.lineTo(px + 12, py);
  ctx.lineTo(px, py + 24);
  ctx.closePath();
  ctx.fillStyle = "#2C1810";
  ctx.fill();
}

export default function WinnerWheel({ entries }: { entries: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const rotationRef = useRef(0);
  const rafRef = useRef<number>(0);

  const size = Math.min(480, typeof window !== "undefined" ? window.innerWidth - 48 : 480);

  useEffect(() => {
    if (!canvasRef.current || entries.length === 0) return;
    drawWheel(canvasRef.current, entries, rotationRef.current);
  }, [entries]);

  function spin() {
    if (spinning || entries.length === 0) return;
    setWinner(null);
    setSpinning(true);

    const totalRotation =
      rotationRef.current +
      (Math.PI * 2 * (8 + Math.floor(Math.random() * 6))) +
      Math.random() * Math.PI * 2;

    const duration = 5000;
    const start = performance.now();
    const startRot = rotationRef.current;

    function easeOut(t: number) {
      return 1 - Math.pow(1 - t, 4);
    }

    function frame(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const current = startRot + (totalRotation - startRot) * easeOut(t);
      rotationRef.current = current;

      if (canvasRef.current) {
        drawWheel(canvasRef.current, entries, current);
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setSpinning(false);
        // Which segment is under the top pointer?
        const arc = (2 * Math.PI) / entries.length;
        // Pointer is at -π/2 (top). Normalize rotation.
        const norm = (((-current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2));
        const idx = Math.floor(norm / arc) % entries.length;
        setWinner(entries[idx]);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="rounded-full shadow-xl"
        />
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="rounded-full bg-terracotta px-10 py-4 font-display text-xl font-extrabold text-cream shadow-md transition hover:bg-chestnut disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {spinning ? "Spinning…" : "Spin the Wheel!"}
      </button>

      {winner && (
        <div className="animate-fade-up rounded-3xl border-2 border-gold bg-cream/90 px-10 py-7 text-center shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta mb-2">
            🎉 This month&apos;s winner
          </p>
          <p className="font-display text-3xl font-extrabold text-chestnut break-all">
            {winner}
          </p>
          <p className="mt-3 text-sm text-chestnut-soft">
            Send them an email to claim their free book!
          </p>
        </div>
      )}
    </div>
  );
}
