import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: "Get in Touch | Bible Stories for Little Hearts",
  description:
    "Contact Bible Stories for Little Hearts for questions, church orders, collaborations, or feedback.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#FAF3E0] font-body text-[#5C3D2E]">
      <div className="scenery" />

      <SiteNav />

      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-32 text-center sm:pt-36">
        <div className="opacity-0 animate-fade-up">
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

        <div className="opacity-0 animate-fade-up mt-10 rounded-[28px] border border-white/80 bg-white/88 p-6 shadow-[0_8px_30px_rgba(92,61,46,0.08)] backdrop-blur-md sm:p-10">
          <form
            action="https://formspree.io/f/xrejvnre"
            method="POST"
            className="space-y-6 text-left"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#5C3D2E]">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                className="w-full rounded-2xl border border-[#E8C07D]/40 bg-[#FAF3E0]/70 px-4 py-3 text-[#5C3D2E] outline-none transition focus:border-[#C1623F] focus:ring-4 focus:ring-[#C1623F]/15"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#5C3D2E]">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Your email address"
                className="w-full rounded-2xl border border-[#E8C07D]/40 bg-[#FAF3E0]/70 px-4 py-3 text-[#5C3D2E] outline-none transition focus:border-[#C1623F] focus:ring-4 focus:ring-[#C1623F]/15"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#5C3D2E]">
                Subject
              </label>
              <select
                name="subject"
                required
                className="w-full rounded-2xl border border-[#E8C07D]/40 bg-[#FAF3E0]/70 px-4 py-3 text-[#5C3D2E] outline-none transition focus:border-[#C1623F] focus:ring-4 focus:ring-[#C1623F]/15"
              >
                <option value="">Select a topic</option>
                <option>General Question</option>
                <option>Church or Bulk Order Inquiry</option>
                <option>Media or Collaboration</option>
                <option>Website Feedback</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#5C3D2E]">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={6}
                placeholder="How can we help?"
                className="w-full rounded-2xl border border-[#E8C07D]/40 bg-[#FAF3E0]/70 px-4 py-3 text-[#5C3D2E] outline-none transition focus:border-[#C1623F] focus:ring-4 focus:ring-[#C1623F]/15"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#C1623F] px-6 py-3 text-base font-semibold text-[#FAF3E0] shadow-md transition hover:scale-[1.01] hover:bg-[#A85031]"
            >
              Send Message
            </button>
          </form>

          <div className="mt-8 space-y-4 text-center">
            <p className="text-sm text-[#5C3D2E]/80">
              Thank you! We’ll get back to you within 2–3 business days. 🌟
            </p>

            <p className="text-sm text-[#5C3D2E]/75">
              Prefer to email directly? Reach us at{" "}
              <a
                href="mailto:info@faithfulheartsbooks.com"
                className="font-semibold text-[#C1623F] hover:underline"
              >
                info@faithfulheartsbooks.com
              </a>
            </p>

            <div className="pt-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#5C3D2E]/70">
                Follow Along
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="https://www.instagram.com/faithfulheartsbooks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-[#C1623F]/20 bg-[#FAF3E0]/80 px-5 py-2.5 text-sm font-semibold text-[#5C3D2E] shadow-sm transition hover:border-[#C1623F] hover:bg-[#C1623F] hover:text-[#FAF3E0]"
                >
                  Instagram
                </a>

                <a
                  href="https://www.pinterest.com/faithfulheartsbooks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-[#C1623F]/20 bg-[#FAF3E0]/80 px-5 py-2.5 text-sm font-semibold text-[#5C3D2E] shadow-sm transition hover:border-[#C1623F] hover:bg-[#C1623F] hover:text-[#FAF3E0]"
                >
                  Pinterest
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
