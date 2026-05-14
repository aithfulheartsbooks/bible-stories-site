"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewsletterSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await fetch(
        "https://faithfulheartsbooks.us8.list-manage.com/subscribe/post?u=6cfdb989086ba1756ad8140c3&id=77051f5892&f_id=002f13e1f0",
        {
          method: "POST",
          mode: "no-cors",
          body: formData,
        }
      );

      router.push("/newsletter/thank-you");
    } catch {
      router.push("/newsletter/thank-you");
    }
  }

  return (
    <section className="relative z-10 bg-[#5C3D2E] px-6 py-12 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-4xl font-bold text-[#FAF3E0] sm:text-5xl">
          Never Miss a New Story
        </h2>

        <p className="mx-auto mt-4 max-w-[380px] text-sm leading-relaxed text-[#FAF3E0]/70 sm:text-base">
          Join our family and be the first to hear about new books, free printables, and seasonal resources.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-[480px] flex-col gap-3 sm:flex-row"
        >
          <div
            style={{ position: "absolute", left: "-5000px" }}
            aria-hidden="true"
          >
            <input
              type="text"
              name="b_6cfdb989086ba1756ad8140c3_77051f5892"
              tabIndex={-1}
              defaultValue=""
            />
          </div>

          <input
            type="email"
            name="EMAIL"
            placeholder="Your email address"
            required
            className="w-full rounded-lg border border-white/20 bg-white/15 px-4 py-3 text-[#FAF3E0] outline-none placeholder:text-[#FAF3E0]/50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#E8C07D] px-6 py-3 font-bold text-[#5C3D2E] transition hover:brightness-105 disabled:opacity-70 sm:w-auto"
          >
            {loading ? "Joining..." : "Join the Family"}
          </button>
        </form>

        <p className="mt-4 text-xs text-[#FAF3E0]/40">
          No spam. Unsubscribe anytime. 🌟
        </p>
      </div>
    </section>
  );
}
