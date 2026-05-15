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
    <section className="relative z-10 bg-[#5C3D2E] px-6 py-8 text-center sm:py-9">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-3xl font-bold text-[#FAF3E0] sm:text-4xl">
          Never Miss a New Story
        </h2>

        <p className="mx-auto mt-2 max-w-[360px] text-xs leading-relaxed text-[#FAF3E0]/70 sm:text-sm">
          Join our family and be the first to hear about new books, free printables, and seasonal resources.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-5 flex max-w-[420px] flex-col gap-2 sm:flex-row"
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
            className="w-full rounded-lg border border-white/20 bg-white/15 px-4 py-2.5 text-sm text-[#FAF3E0] outline-none placeholder:text-[#FAF3E0]/50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#E8C07D] px-5 py-2.5 text-sm font-bold text-[#5C3D2E] transition hover:brightness-105 disabled:opacity-70 sm:w-auto"
          >
            {loading ? "Joining..." : "Join the Family"}
          </button>
        </form>

        <p className="mt-3 text-[11px] text-[#FAF3E0]/40">
          No spam. Unsubscribe anytime. 🌟
        </p>
      </div>
    </section>
  );
}
