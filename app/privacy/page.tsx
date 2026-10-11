import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: "Privacy Policy | Faithful Hearts Books",
  description:
    "Privacy policy for Faithful Hearts Books, publisher of Bible Stories for Little Hearts by Faith Rivers.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden font-body text-chestnut">
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

      <section className="relative z-10 mx-auto max-w-[700px] px-6 pb-16 pt-32 text-center">
        <div className="opacity-0 animate-fade-up">
          <h1 className="mb-3 font-display text-4xl font-bold text-chestnut sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-base text-chestnut-soft sm:text-lg">
            Faithful Hearts Books (Faith Rivers)
          </p>
          <div className="mb-8 mt-3 text-xl tracking-widest text-gold">
            {"\u2726 \u2726 \u2726"}
          </div>
        </div>

        <div
          className="opacity-0 animate-fade-up mx-auto max-w-2xl rounded-3xl border border-white/80 bg-cream/85 p-8 text-left shadow-md backdrop-blur-md sm:p-10"
          style={{ animationDelay: "0.15s" }}
        >
          <p className="mb-6 text-sm font-semibold text-chestnut-soft">
            Last updated: October 2026
          </p>

          <div className="space-y-6 text-base leading-relaxed text-chestnut-soft sm:text-lg">
            <section>
              <h2 className="mb-2 font-display text-xl font-bold text-chestnut">
                Who we are
              </h2>
              <p>
                Faithful Hearts Books publishes the Bible Stories for Little
                Hearts children&apos;s books by Faith Rivers. Our books are sold
                on Amazon.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-xl font-bold text-chestnut">
                What this website collects
              </h2>
              <p>
                We don&apos;t sell anything directly here and don&apos;t ask for
                accounts, payments, or personal details. Like most sites, our
                hosting may keep basic visit logs, such as pages viewed and
                browser type.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-xl font-bold text-chestnut">
                Our Pinterest tool
              </h2>
              <p>
                We use a small internal tool that connects only to our own
                Pinterest business account. It posts Pins of our books and
                reads the stats for those Pins. It doesn&apos;t access, collect,
                or store other Pinterest users&apos; data, and we never sell or
                share data.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-xl font-bold text-chestnut">
                Links to other sites
              </h2>
              <p>
                Our book pages link to Amazon, which has its own privacy
                policy.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-xl font-bold text-chestnut">
                Children
              </h2>
              <p>
                Our books are for kids ages 3–8, but this site doesn&apos;t
                knowingly collect information from children.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-xl font-bold text-chestnut">
                Contact
              </h2>
              <p>
                <a
                  href="mailto:info@faithfulheartsbooks.com"
                  className="font-semibold text-terracotta hover:underline"
                >
                  info@faithfulheartsbooks.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
