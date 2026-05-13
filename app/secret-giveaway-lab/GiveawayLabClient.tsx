"use client";

import { FormEvent, useEffect, useState } from "react";

const ACCESS_CODE = "littlehearts";

export default function GiveawayLabClient() {
  const [code, setCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isUnlocked) return;

    const oldScript = document.getElementById("kit-embed-script");
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.id = "kit-embed-script";
    script.async = true;
    script.dataset.uid = "5e7711b2e5";
    script.src = "https://bible-stories-for-little-hearts.kit.com/5e7711b2e5/index.js";

    const container = document.getElementById("kit-form-container");

    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }
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

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
              Open Test Page
            </button>
          </form>

          {error ? <p className="mt-4 text-sm text-terracotta">{error}</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-24 sm:pt-28">
      <div className="text-center">
        <h1 className="font-display text-5xl font-extrabold text-chestnut">
          Monthly Book Giveaway
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-chestnut-soft">
          Enter for a chance to win one free paperback each month and join the
          Bible Stories for Little Hearts email list.
        </p>
      </div>

      <div className="mt-10 rounded-3xl border border-white/80 bg-cream/85 p-8 shadow-md backdrop-blur-md">
        <h2 className="font-display text-2xl font-bold text-chestnut">
          Enter This Month
        </h2>

        <p className="mt-2 text-sm text-chestnut-soft">
          Parent or guardian must enter. Mailing address requested only if you
          win.
        </p>

        <div id="kit-form-container" className="mt-6"></div>
      </div>
    </section>
  );
}
