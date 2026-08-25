"use client";

import PeekReader from "@/components/PeekReader";
import { peekFor } from "@/lib/peeks";

export default function BookPeek({
  slug,
  title,
  blurb,
  amazonUrl,
  coverImage,
}: {
  slug: string;
  title: string;
  blurb?: string;
  amazonUrl?: string;
  coverImage?: string;
}) {
  const pages = peekFor(slug, blurb);
  if (!pages?.length) return null;

  return (
    <div className="mb-8">
      <PeekReader
        pages={pages}
        title={title}
        amazonUrl={amazonUrl}
        image={coverImage}
      />
    </div>
  );
}
