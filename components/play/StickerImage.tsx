"use client";

import { useEffect, useState } from "react";

type Props = {
  src?: string;
  alt: string;
  sizes: string;
  className?: string;
};

export default function StickerImage({ src, alt, sizes, className = "object-cover" }: Props) {
  const [failed, setFailed] = useState(false);
  const versionedSrc = src?.startsWith("/play/stickers/")
    ? `${src}${src.includes("?") ? "&" : "?"}v=20260611-sticker-detail`
    : src;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!versionedSrc || failed) {
    return (
      <span className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.72),rgba(244,224,188,0.72)_44%,rgba(138,91,67,0.28))] text-2xl font-bold text-chestnut">
        ?
      </span>
    );
  }

  return (
    <img
      src={versionedSrc}
      alt={alt}
      sizes={sizes}
      className={`absolute inset-0 h-full w-full ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
