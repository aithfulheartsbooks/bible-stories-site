"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className: string;
  label: string;
  src: string;
  delay?: string;
};

export default function SoundButton({ children, className, label, src, delay }: Props) {
  function handlePress() {
    const sound = new Audio(src);
    sound.volume = 0.35;
    sound.play().catch(() => {});
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
