"use client";

import { useEffect, useState } from "react";

function getNextFirstOfMonth(): Date {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
  return next;
}

function getTimeLeft() {
  const diff = getNextFirstOfMonth().getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function GiveawayCountdown() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Mins", value: time.minutes },
    { label: "Secs", value: time.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="flex min-w-[68px] flex-col items-center rounded-2xl border border-white/80 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-md"
        >
          <span className="font-display text-3xl font-extrabold text-chestnut tabular-nums">
            {pad(value)}
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-terracotta">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
