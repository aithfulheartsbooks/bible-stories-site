"use client";

import { useMemo, useState } from "react";
import type { Resource } from "@/app/resources";

type ResourceCollectionProps = {
  resources: Resource[];
};

export default function ResourceCollection({
  resources,
}: ResourceCollectionProps) {
  const [activeType, setActiveType] = useState("All Resources");

  const types = useMemo(
    () => [
      "All Resources",
      ...Array.from(new Set(resources.map((resource) => resource.type))),
    ],
    [resources]
  );

  const visibleResources =
    activeType === "All Resources"
      ? resources
      : resources.filter((resource) => resource.type === activeType);

  return (
    <>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {types.map((type) => {
          const isActive = activeType === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition ${
                isActive
                  ? "border-terracotta bg-terracotta text-cream"
                  : "border-terracotta/25 bg-white/60 text-chestnut-soft hover:border-terracotta hover:text-terracotta"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm font-semibold text-chestnut-soft/80">
        Showing {visibleResources.length}{" "}
        {visibleResources.length === 1 ? "printable" : "printables"}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleResources.map((resource, index) => (
          <article
            key={resource.title}
            className="opacity-0 animate-fade-up flex h-full flex-col rounded-3xl border border-white/80 bg-cream/85 p-7 text-left shadow-md backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${0.08 + (index % 6) * 0.06}s` }}
          >
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="w-fit rounded-full border border-gold/40 bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
                {resource.type}
              </span>
              {resource.book ? (
                <span className="w-fit rounded-full bg-white/50 px-3 py-1 text-xs font-bold text-chestnut-soft">
                  {resource.book}
                </span>
              ) : null}
            </div>
            <h2 className="font-display text-2xl font-bold leading-tight text-chestnut">
              {resource.title}
            </h2>
            <p className="mt-4 flex-1 text-base leading-relaxed text-chestnut-soft">
              {resource.description}
            </p>
            <a
              href={resource.href}
              download
              className="mt-7 inline-flex items-center justify-center rounded-full bg-terracotta px-5 py-3 text-sm font-bold text-cream shadow-sm transition hover:bg-chestnut"
            >
              Download PDF
            </a>
          </article>
        ))}
      </div>
    </>
  );
}
