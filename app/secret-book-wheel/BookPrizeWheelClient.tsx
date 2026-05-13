"use client";

import { useMemo, useState } from "react";
import { books } from "@/app/books";

const ACCESS_CODE = "littlehearts";

export default function BookPrizeWheelClient() {
  const availableBooks = useMemo(
    () => books.filter((book) => book.status === "available"),
    []
  );

  const [code, setCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const segmentAngle = 360 / availableBooks.length;

  function unlockPage(event: React.FormEvent) {
    event.preventDefault();

    if (code.trim().toLowerCase() === ACCESS_CODE) {
      setIsUnlocked(true);
    }
  }

  function spinWheel() {
    if (isSpinning) return;

    setWinner(null);
    setIsSpinning(true);

    const randomIndex = Math.floor(Math.random() * availableBooks.length);
    const spins = 6;

    const targetRotation =
      rotation +
      spins * 360 +
      (360 - randomIndex * segmentAngle - segmentAngle / 2);

    setRotation(targetRotation);

    setTimeout(() => {
      setWinner(availableBooks[randomIndex].title);
      setIsSpinning(false);
    }, 5200);
  }

  if (!isUnlocked) {
    return (
      <section className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center px-6 py-24">
        <div className="w-full rounded-3xl border border-white/80 bg-cream/85 p-8 text-center shadow-md backdrop-blur-md">
          <div className="mb-4 text-5xl">🎡</div>
          <h1 className="font-display text-3xl font-bold text-chestnut">
            Private Book Prize Wheel
          </h1>

          <form onSubmit={unlockPage} className="mt-8 space-y-4">
            <input
              type="password"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter access code"
              className="w-full rounded-2xl border border-chestnut/15 bg-white/70 px-4 py-3 text-center text-sm text-chestnut outline-none"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-terracotta px-6 py-3 text-sm font-bold text-cream"
            >
              Open Wheel
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-24 text-center sm:pt-28">
      <div className="mx-auto max-w-3xl">
        <span className="mb-6 inline-block rounded-full border border-terracotta/20 bg-white/55 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta backdrop-blur-sm">
          Hidden Prize Wheel Test
        </span>

        <h1 className="font-display text-5xl font-extrabold text-chestnut sm:text-6xl">
          Monthly Book Prize Wheel
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-chestnut-soft">
          Whatever book the pointer lands on becomes the winner&apos;s free prize.
        </p>
      </div>

      <div className="mt-12 flex flex-col items-center">
        <div className="relative">
          <div className="absolute left-1/2 top-[-28px] z-20 h-0 w-0 -translate-x-1/2 border-l-[20px] border-r-[20px] border-t-[36px] border-l-transparent border-r-transparent border-t-terracotta" />

          <div
            className="relative h-[360px] w-[360px] overflow-hidden rounded-full border-[10px] border-white shadow-2xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                : "none",
              background:
                "conic-gradient(#ffd9b8 0deg 20deg, #ffc8d4 20deg 40deg, #d8c8ee 40deg 60deg, #cbe2f2 60deg 80deg, #c8dcb8 80deg 100deg, #fff3b0 100deg 120deg, #ffd9b8 120deg 140deg, #ffc8d4 140deg 160deg, #d8c8ee 160deg 180deg, #cbe2f2 180deg 200deg, #c8dcb8 200deg 220deg, #fff3b0 220deg 240deg, #ffd9b8 240deg 260deg, #ffc8d4 260deg 280deg, #d8c8ee 280deg 300deg, #cbe2f2 300deg 320deg, #c8dcb8 320deg 340deg, #fff3b0 340deg 360deg)",
            }}
          >
            {availableBooks.map((book, index) => {
              const angle = index * segmentAngle;

              return (
                <div
                  key={book.slug}
                  className="absolute left-1/2 top-1/2 origin-top-left"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-165px)`,
                  }}
                >
                  <div
                    className="w-[120px] -translate-x-1/2 text-center"
                    style={{ transform: `rotate(${segmentAngle / 2}deg)` }}
                  >
                    <p className="font-display text-[11px] font-bold leading-tight text-chestnut">
                      {book.title}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-terracotta text-sm font-bold text-cream shadow-lg">
              SPIN
            </div>
          </div>
        </div>

        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="mt-10 rounded-full bg-terracotta px-10 py-4 font-semibold text-cream shadow-lg transition hover:bg-chestnut disabled:opacity-60"
        >
          {isSpinning ? "Spinning..." : "Spin the Prize Wheel"}
        </button>

        {winner ? (
          <div className="mt-10 max-w-xl rounded-3xl border border-white/80 bg-cream/85 p-8 shadow-md backdrop-blur-md">
            <div className="text-5xl">🎉</div>
            <h2 className="mt-4 font-display text-3xl font-bold text-chestnut">
              Winner Prize Book
            </h2>
            <p className="mt-4 font-display text-2xl italic text-terracotta">
              {winner}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-chestnut-soft">
              Whatever subscriber wins this month receives this book as the free
              giveaway prize.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
