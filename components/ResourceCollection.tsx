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
  const coloringResources = resources.filter(
    (resource) => resource.type === "Coloring Page"
  );
  const printableResources = resources.filter(
    (resource) => resource.type !== "Coloring Page"
  );

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

      {activeType === "All Resources" ? (
        <div className="mt-10 space-y-12">
          <ResourceSection
            title="Family Printables"
            eyebrow={`${printableResources.length} activities`}
            description="Reading trackers, verse cards, prayer cards, and simple story-time sheets."
            resources={printableResources}
          />
          <ResourceSection
            title="Coloring Pages"
            eyebrow={`${coloringResources.length} books`}
            description="Book-by-book coloring pages arranged in series order for easy browsing."
            resources={coloringResources}
            compact
          />
        </div>
      ) : (
        <div className="mt-10">
          <ResourceSection
            title={activeType}
            eyebrow={`${visibleResources.length} printables`}
            description={
              activeType === "Coloring Page"
                ? "Book-by-book coloring pages arranged in series order for easy browsing."
                : "Gentle printable resources for families, classrooms, and quiet story moments."
            }
            resources={visibleResources}
            compact={activeType === "Coloring Page"}
          />
        </div>
      )}
    </>
  );
}

function ResourceSection({
  title,
  eyebrow,
  description,
  resources,
  compact = false,
}: {
  title: string;
  eyebrow: string;
  description: string;
  resources: Resource[];
  compact?: boolean;
}) {
  return (
    <section className="text-left">
      <div className="mb-5 flex flex-col gap-2 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-terracotta">
          {eyebrow}
        </span>
        <h2 className="font-display text-3xl font-bold text-chestnut">
          {title}
        </h2>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-chestnut-soft sm:mx-0">
          {description}
        </p>
      </div>

      <div
        className={`grid gap-5 ${
          compact
            ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "md:grid-cols-2 xl:grid-cols-3"
        }`}
      >
        {resources.map((resource, index) => (
          <ResourceCard
            key={resource.title}
            resource={resource}
            index={index}
            compact={compact}
          />
        ))}
      </div>
    </section>
  );
}

function ResourceCard({
  resource,
  index,
  compact,
}: {
  resource: Resource;
  index: number;
  compact: boolean;
}) {
  return (
    <article
      className={`opacity-0 animate-fade-up flex h-full flex-col rounded-3xl border border-white/80 bg-cream/85 text-left shadow-md backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
        compact ? "p-5" : "p-7"
      }`}
      style={{ animationDelay: `${0.08 + (index % 8) * 0.04}s` }}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="w-fit rounded-full border border-gold/40 bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-terracotta">
          {resource.type}
        </span>
        {resource.book ? (
          <span className="w-fit rounded-full bg-white/50 px-3 py-1 text-xs font-bold text-chestnut-soft">
            {resource.book}
          </span>
        ) : null}
      </div>
      <h3
        className={`font-display font-bold leading-tight text-chestnut ${
          compact ? "text-xl" : "text-2xl"
        }`}
      >
        {resource.title}
      </h3>
      <p
        className={`mt-3 flex-1 leading-relaxed text-chestnut-soft ${
          compact ? "text-sm" : "text-base"
        }`}
      >
        {resource.description}
      </p>
      <a
        href={resource.href}
        download
        className="mt-6 inline-flex items-center justify-center rounded-full bg-terracotta px-5 py-3 text-sm font-bold text-cream shadow-sm transition hover:bg-chestnut"
      >
        Download PDF
      </a>
    </article>
  );
}
