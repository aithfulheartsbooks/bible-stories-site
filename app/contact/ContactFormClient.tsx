"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

export default function ContactFormClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("https://formspree.io/f/xrejvnre", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (response.ok) {
        router.push("/contact/thank-you");
      } else {
        setError("Something went wrong. Please try again or email us directly at info@faithfulheartsbooks.com");
      }
    } catch {
      setError("Something went wrong. Please try again or email us directly at info@faithfulheartsbooks.com");
    }

    setLoading(false);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden font-body text-[#5C3D2E]">
      <div className="scenery" />

      <div className="cloud animate-drift-slow h-[60px] w-[180px] top-[8%] left-[-200px]" />
      <div
        className="cloud animate-drift-long h-[45px] w-[140px] top-[18%] left-[-200px]"
        style={{ animationDelay: "-30s" }}
      />
      <div
        className="cloud animate-drift-medium h-[70px] w-[220px] top-[4%] left-[-200px]"
        style={{ animationDelay: "-60s" }}
      />

      <SiteNav />

      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-32 text-center sm:pt-36">
        <div>
          <span className="mb-6 inline-block rounded-full border border-[#C1623F]/20 bg-white/55 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C1623F] backdrop-blur-sm">
            Contact
          </span>

          <h1 className="mb-4 font-display text-5xl font-extrabold text-[#5C3D2E] sm:text-6xl">
            Get in Touch
          </h1>

          <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-[#5C3D2E]/80 sm:text-lg">
            We’d love to hear from you! Whether you’re a parent, teacher, or church leader, feel free to reach out.
          </p>
        </div>

        <div className="mt-10 rounded-[28px] border border-white/80 bg-white/88 p-6 shadow-[0_8px_30px_rgba(92,61,46,0.08)] backdrop-blur-md sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <input type="text" name="name" required placeholder="Your name" className="w-full rounded-2xl border border-[#E8C07D]/40 bg-[#FAF3E0]/70 px-4 py-3" />
            <input type="email" name="email" required placeholder="Your email address" className="w-full rounded-2xl border border-[#E8C07D]/40 bg-[#FAF3E0]/70 px-4 py-3" />

            <select name="subject" required className="w-full rounded-2xl border border-[#E8C07D]/40 bg-[#FAF3E0]/70 px-4 py-3">
              <option value="">Select a topic</option>
              <option>General Question</option>
              <option>Church or Bulk Order Inquiry</option>
              <option>Media or Collaboration</option>
              <option>Website Feedback</option>
              <option>Other</option>
            </select>

            <textarea name="message" required rows={6} placeholder="How can we help?" className="w-full rounded-2xl border border-[#E8C07D]/40 bg-[#FAF3E0]/70 px-4 py-3" />

            {error && <p className="text-sm text-red-700">{error}</p>}

            <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center rounded-full bg-[#C1623F] px-6 py-3 text-base font-semibold text-[#FAF3E0] shadow-md">
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="mt-8 space-y-4 text-center">
            <p className="text-sm text-[#5C3D2E]/80">Thank you! We’ll get back to you within 2–3 business days. 🌟</p>
            <p className="text-sm text-[#5C3D2E]/75">Prefer to email directly? Reach us at <a href="mailto:info@faithfulheartsbooks.com" className="font-semibold text-[#C1623F] hover:underline">info@faithfulheartsbooks.com</a></p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
