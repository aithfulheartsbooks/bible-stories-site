export default function SiteFooter() {
  return (
    <footer className="relative z-10 px-6 pb-32 pt-12 text-center text-chestnut-soft sm:pb-16">
      <div className="mx-auto mb-6 h-0.5 w-16 rounded bg-gold/50" />
      <p className="mx-auto max-w-lg font-display text-base italic">
        &ldquo;Let the little children come to me.&rdquo; &mdash; A series made with
        love for growing hearts.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href="https://www.instagram.com/faithriversbooks/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-terracotta/25 bg-cream/80 px-5 py-2.5 text-sm font-semibold text-chestnut-soft shadow-sm transition hover:border-terracotta hover:bg-terracotta hover:text-cream"
        >
          Follow on Instagram
        </a>
        <a
          href="https://www.pinterest.com/faithfulheartsbooks/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-terracotta/25 bg-cream/80 px-5 py-2.5 text-sm font-semibold text-chestnut-soft shadow-sm transition hover:border-terracotta hover:bg-terracotta hover:text-cream"
        >
          Find us on Pinterest
        </a>
        <a
          href="https://x.com/FaithfulHearts_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-terracotta/25 bg-cream/80 px-5 py-2.5 text-sm font-semibold text-chestnut-soft shadow-sm transition hover:border-terracotta hover:bg-terracotta hover:text-cream"
        >
          Follow on X
        </a>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-full border border-terracotta/25 bg-cream/80 px-5 py-2.5 text-sm font-semibold text-chestnut-soft shadow-sm transition hover:border-terracotta hover:bg-terracotta hover:text-cream"
        >
          Contact Us
        </a>
      </div>
      <p className="mt-6 text-sm opacity-70">
        &copy; {new Date().getFullYear()} Bible Stories for Little Hearts. All
        rights reserved.
      </p>
    </footer>
  );
}
