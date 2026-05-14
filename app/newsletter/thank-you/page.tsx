import SiteNav from "@/components/SiteNav";

export default function NewsletterThankYouPage() {
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

      <section className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-32 text-center">
        <div className="w-full rounded-[32px] border border-white/80 bg-white/88 p-8 shadow-[0_8px_30px_rgba(92,61,46,0.08)] backdrop-blur-md sm:p-12">
          <div className="mb-6 text-5xl">🌟</div>

          <h1 className="mb-4 font-display text-5xl font-extrabold text-[#5C3D2E] sm:text-6xl">
            Welcome to the Family!
          </h1>

          <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-[#5C3D2E]/80 sm:text-lg">
            Your subscription has been confirmed successfully. Watch your inbox for new books, free printables, and seasonal surprises.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[#C1623F] px-6 py-3 text-base font-semibold text-[#FAF3E0] shadow-md transition hover:scale-[1.01] hover:bg-[#A85031]"
            >
              Continue to Website
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
