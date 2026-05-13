"use client";

import { FormEvent, useEffect, useState } from "react";

const ACCESS_CODE = "littlehearts";

const giveawayWinners: Array<{
  date: string;
  nickname: string;
}> = [];

export default function GiveawayLabClient() {
  const [code, setCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isUnlocked) return;

    const existingScript = document.querySelector(
      'script[data-uid="5e7711b2e5"]'
    );

    if (existingScript) return;

    const script = document.createElement("script");
    script.src =
      "https://bible-stories-for-little-hearts.kit.com/5e7711b2e5/index.js";
    script.setAttribute("data-uid", "5e7711b2e5");
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isUnlocked]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (code.trim().toLowerCase() === ACCESS_CODE) {
      setIsUnlocked(true);
      setError("");
      return;
    }

    setError("Please enter the correct access code.");
  }

  if (!isUnlocked) {
    return (
      <section className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center px-6 py-24">
        <div className="w-full rounded-3xl border border-white/80 bg-cream/85 p-8 text-center shadow-md backdrop-blur-md md:p-10">
          <div className="mb-4 text-5xl">🔒</div>
          <h1 className="font-display text-3xl font-bold text-chestnut">
            Giveaway Test Page
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-chestnut-soft">
            This page is only for private testing before the giveaway is added
            anywhere public on the website.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="password"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter access code"
              className="w-full rounded-2xl border border-chestnut/15 bg-white/70 px-4 py-3 text-center text-sm text-chestnut outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-terracotta px-6 py-3 text-sm font-bold text-cream shadow-md transition hover:bg-chestnut"
            >
              Open Test Page
            </button>
          </form>

          {error ? <p className="mt-4 text-sm text-terracotta">{error}</p> : null}

          <p className="mt-6 text-xs leading-relaxed text-chestnut-soft">
            Not linked in navigation. Not added to the homepage. Marked noindex.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-24 text-center sm:pt-28">
      <div className="opacity-0 animate-fade-up mx-auto max-w-3xl">
        <span className="mb-6 inline-block rounded-full border border-terracotta/20 bg-white/55 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta backdrop-blur-sm">
          Private Test Page
        </span>

        <h1 className="mb-4 font-display text-5xl font-extrabold leading-tight text-chestnut sm:text-6xl">
          Monthly Book Giveaway
        </h1>

        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-chestnut-soft sm:text-xl">
          Test the giveaway form, winner board, and mobile layout here before
          anything is added to the public Free Resources page.
        </p>

        <div className="mt-6 text-xl tracking-widest text-gold">
          {"\u2726 \u2726 \u2726"}
        </div>
      </div>

      <div
        className="opacity-0 animate-fade-up mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 text-left md:grid-cols-2"
        style={{ animationDelay: "0.2s" }}
      >
        <article className="rounded-3xl border border-white/80 bg-cream/85 p-8 shadow-md backdrop-blur-md">
          <h2 className="font-display text-xl font-bold text-chestnut">
            Enter This Month
          </h2>
          <p className="mt-1 font-display text-sm font-semibold text-terracotta">
            📅 Next Draw: June 1, 2026
          </p>

          <div className="giveaway-kit-form mt-6">
            <div data-uid="5e7711b2e5" />
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-chestnut-soft">
            No purchase necessary. US residents 18+ only. Parent or guardian
            must enter. One entry per person per round.
          </p>
        </article>

        <article className="rounded-3xl border border-white/80 bg-cream/85 p-8 shadow-md backdrop-blur-md">
          <h2 className="mb-6 font-display text-xl font-bold text-chestnut">
            🏆 Recent Winners
          </h2>

          {giveawayWinners.length === 0 ? (
            <div className="mb-6 rounded-2xl border border-amber-200/50 bg-amber-50/50 p-6 text-center font-display italic text-chestnut-soft">
              ✨ Our first draw is June 1, 2026 — be the first winner!
            </div>
          ) : (
            <div className="mb-6">
              {giveawayWinners.slice(0, 6).map((winner) => (
                <div
                  key={`${winner.date}-${winner.nickname}`}
                  className="flex items-center gap-3 border-b border-chestnut/10 py-3 last:border-0"
                >
                  <span className="text-lg text-gold">🌟</span>
                  <div>
                    <p className="font-display text-sm font-semibold text-chestnut">
                      {winner.nickname}
                    </p>
                    <p className="text-xs text-chestnut-soft">{winner.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="my-6 border-t border-chestnut/10" />

          <h3 className="mb-4 font-display text-xs font-bold uppercase tracking-widest text-chestnut-soft">
            How It Works
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-lg">📝</span>
              <div>
                <p className="font-display text-xs font-semibold text-chestnut">
                  Enter
                </p>
                <p className="text-xs leading-relaxed text-chestnut-soft">
                  Submit nickname and email before draw date.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-lg">🎲</span>
              <div>
                <p className="font-display text-xs font-semibold text-chestnut">
                  Random Draw
                </p>
                <p className="text-xs leading-relaxed text-chestnut-soft">
                  Winner selected randomly on the 1st of each month.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-lg">📦</span>
              <div>
                <p className="font-display text-xs font-semibold text-chestnut">
                  Win!
                </p>
                <p className="text-xs leading-relaxed text-chestnut-soft">
                  Choose any book — shipped free to your US address.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div
        className="opacity-0 animate-fade-up mx-auto mt-10 max-w-4xl rounded-3xl border border-white/80 bg-white/55 p-6 text-left shadow-sm backdrop-blur-md"
        style={{ animationDelay: "0.35s" }}
      >
        <h2 className="font-display text-2xl font-bold text-chestnut">
          Test checklist
        </h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-chestnut-soft">
          <li>✓ Submit a test nickname and email.</li>
          <li>✓ Confirm Kit sends the welcome email.</li>
          <li>✓ Confirm Zapier adds the entry to Google Sheets.</li>
          <li>✓ Check the page on iPhone and desktop.</li>
          <li>✓ Keep this page hidden until the giveaway is ready.</li>
        </ul>
      </div>

      <style jsx global>{`
        .giveaway-kit-form .formkit-form {
          background: transparent !important;
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: none !important;
        }

        .giveaway-kit-form .formkit-form * {
          box-sizing: border-box !important;
        }

        .giveaway-kit-form .formkit-field {
          margin-bottom: 0.75rem !important;
        }

        .giveaway-kit-form .formkit-input {
          width: 100% !important;
          border-radius: 12px !important;
          border: 1.5px solid rgba(90, 61, 43, 0.15) !important;
          background: rgba(255, 255, 255, 0.6) !important;
          font-family: var(--font-quicksand), sans-serif !important;
          font-size: 0.9rem !important;
          color: #5a3d2b !important;
          padding: 0.75rem 1rem !important;
          outline: none !important;
        }

        .giveaway-kit-form .formkit-input:focus {
          border-color: #d97757 !important;
          box-shadow: 0 0 0 3px rgba(217, 119, 87, 0.1) !important;
        }

        .giveaway-kit-form .formkit-submit {
          width: 100% !important;
          border-radius: 9999px !important;
          background: #d97757 !important;
          color: #fdf6e9 !important;
          font-family: var(--font-quicksand), sans-serif !important;
          font-weight: 700 !important;
          font-size: 0.95rem !important;
          padding: 0.9rem 1.5rem !important;
          border: none !important;
          cursor: pointer !important;
          transition: background 0.3s !important;
          box-shadow: 0 4px 12px rgba(217, 119, 87, 0.3) !important;
          margin-top: 0.5rem !important;
        }

        .giveaway-kit-form .formkit-submit:hover {
          background: #5a3d2b !important;
        }

        .giveaway-kit-form .formkit-guarantee {
          display: none !important;
        }
      `}</style>
    </section>
  );
}
