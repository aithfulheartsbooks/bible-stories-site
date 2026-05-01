"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type Props = {
  children: ReactNode;
  className: string;
  label: string;
  src: string;
  delay?: string;
};

export default function SoundButton({ children, className, label, src, delay }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.volume = 0.4;
  }, [src]);

  function handlePress() {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

  return (
    <button
      className={className}
      type="button"
      aria-label={label}
      style={delay ? { animationDelay: delay } : undefined}
      onClick={handlePress}
    >
      {children}
    </button>
  );
}
