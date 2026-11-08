import Image from "next/image";
import { printableForSlug } from "@/lib/tonight-catalog";

const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-[#1e3a5f] px-5 py-3 text-sm font-semibold text-cream shadow-md transition hover:bg-chestnut focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chestnut";

export default function TonightPrintable({ slug }: { slug: string }) {
  const printable = printableForSlug(slug);
  if (!printable) return null;

  return (
    <section
      className="tonight-hide-when-chart-prints mt-8 rounded-3xl border border-white/80 bg-cream/85 p-5 shadow-sm"
      data-tonight-slug={slug}
      aria-labelledby="tonight-printable-heading"
    >
      <div className="flex items-start gap-4">
        <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/80 bg-cream-deep">
          <Image
            src={printable.previewSrc}
            alt={printable.previewAlt}
            width={96}
            height={128}
            sizes="96px"
            className="h-32 w-24 object-contain"
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
            Tonight&apos;s free printable
          </p>
          <h2
            id="tonight-printable-heading"
            className="mt-1 font-display text-2xl font-bold text-chestnut"
          >
            {printable.type}
          </h2>
          <p className="mt-2 text-sm text-chestnut-soft">{printable.description}</p>
          <a href={printable.href} download className={`mt-4 ${buttonClass}`}>
            Download coloring page
          </a>
        </div>
      </div>
    </section>
  );
}
