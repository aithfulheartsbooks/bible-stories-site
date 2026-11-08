"use client";

import { useEffect, useState } from "react";
import type { Book } from "@/app/books";
import { nextTonightBoundary, todaysBook } from "@/lib/tonight";

export function useTonightBook() {
  const [book, setBook] = useState<Book | null>(null);
  const [nightLabel, setNightLabel] = useState("");

  useEffect(() => {
    let timer = 0;

    const refresh = () => {
      window.clearTimeout(timer);
      const now = new Date();
      setBook(todaysBook(now));
      setNightLabel(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
      );
      const delay = Math.max(1, nextTonightBoundary(now).getTime() - now.getTime());
      timer = window.setTimeout(refresh, delay);
    };

    refresh();
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, []);

  return { book, nightLabel };
}
