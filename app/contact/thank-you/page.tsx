import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: "Thank You | Bible Stories for Little Hearts",
  description: "Thank you for contacting Bible Stories for Little Hearts.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/contact/thank-you",
  },
};

export default function ContactThankYouPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#FAF3E0] font-body text-[#5C3D2E]">
      <div className="scenery" />

      <SiteNav />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-32 text-center">
        <div className="w-full rounded-[32px] border border-white/80 bg-white/88 p-8 shadow-[0_8px_30px_rgba(92,61,46,0.08)] backdrop-blur-md sm:p-12">
          <div className="mb-6 text-5xl">🌟</div>

          <h1 className="mb-4 font-display text-5xl font-extrabold text-[#5C3D2E] sm:text-6xl">
            Thank You!
          </h1>

          <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-[#5C3D2E]/80 sm:text-lg">
            Your message has been sent successfully. We’ll get back to you within 2–3 business days.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[#C1623F] px-6 py-3 text-base font-semibold text-[#FAF3E0] shadow-md transition hover:scale-[1.01] hover:bg-[#A85031]"
            >
              Back to Home
            </a>

            <a
              href="/free-resources"
              className="inline-flex items-center justify-center rounded-full border border-[#C1623F]/20 bg-[#FAF3E0]/80 px-6 py-3 text-base font-semibold text-[#5C3D2E] shadow-sm transition hover:border-[#C1623F] hover:bg-[#C1623F] hover:text-[#FAF3E0]"
            >
              Explore Free Resources
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
