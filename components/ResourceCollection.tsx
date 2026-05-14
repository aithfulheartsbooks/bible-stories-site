"use client";

import { useMemo, useState } from "react";
import type { Resource } from "@/app/resources";

type ResourceCollectionProps = {
  resources: Resource[];
};

const resourceIcons: Record<string, string> = {
  "Reading Tracker": "📚",
  "Verse Cards": "✦",
  Prayer: "🙏",
  "Story Time": "📖",
  "Activity Sheet": "✏️",
  "Coloring Page": "🎨",
  Poster: "🖼️",
  "Lesson Pack": "📋",
  Devotional: "❤️",
  Bookmark: "🔖",
  Certificate: "⭐",
};

export default function ResourceCollection({
  resources,
}: ResourceCollectionProps) {
  const [activeType, setActiveType] = useState("All Resources");
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchedResources = useMemo(() => {
    if (!normalizedQuery) return resources;

    return resources.filter((resource) => {
      return [
        resource.title,
        resource.description,
        resource.type,
        resource.book ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [resources, normalizedQuery]);

  const types = useMemo(
    () => [
      "All Resources",
      "Reading Tracker",
      "Verse Cards",
      "Prayer",
      "Story Time",
      "Activity Sheet",
      "Coloring Page",
      "Poster",
      "Lesson Pack",
      "Devotional",
      "Bookmark",
      "Certificate",
    ],
    []
  );

  const visibleResources =
    activeType === "All Resources"
      ? searchedResources
      : searchedResources.filter((resource) => resource.type === activeType);

  return (
    <>
      <div className="mx-auto mt-10 max-w-2xl">
        <div className="rounded-[28px] border border-white/80 bg-white/80 p-3 shadow-md backdrop-blur-md">
          <div className="flex items-center gap-3 rounded-2xl border border-[#E8C07D]/40 bg-[#FAF3E0]/70 px-4 py-3 focus-within:border-[#C1623F] focus-within:ring-4 focus-within:ring-[#C1623F]/10">
            <span className="text-xl">🔎</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search printables, Bible stories, trackers, devotionals..."
              className="w-full bg-transparent text-[15px] text-chestnut outline-none placeholder:text-chestnut-soft/60 sm:text-base"
            />
          </div>
        </div>
      </div>

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

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleResources.map((resource, index) => (
          <ResourceCard key={resource.title} resource={resource} index={index} />
        ))}
      </div>
    </>
  );
}

function ResourceCard({
  resource,
  index,
}: {
  resource: Resource;
  index: number;
}) {
  const icon = resourceIcons[resource.type] ?? "📄";

  return (
    <article
      className="opacity-0 animate-fade-up flex h-full flex-col rounded-3xl border border-white/80 bg-cream/85 p-6 text-left shadow-md backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ animationDelay: `${0.08 + (index % 8) * 0.04}s` }}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="w-fit rounded-full border border-gold/40 bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-terracotta">
          {resource.type}
        </span>

        {resource.book ? (
          <span className="w-fit rounded-full bg-white/50 px-3 py-1 text-xs font-bold text-chestnut-soft">
            Pairs with {resource.book}
          </span>
        ) : null}
      </div>

      <div className="mb-5 overflow-hidden rounded-2xl border border-[#E8D9BB] bg-[#FAF3E0] shadow-inner">
        <div className="aspect-[3/4] border-t-4 border-[#C1623F] bg-gradient-to-br from-[#FFFDF8] via-[#FAF3E0] to-[#FCE7D3] p-6">
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white/40 p-6 text-center">
            <div className="mb-4 text-5xl">{icon}</div>

            <div className="font-display text-xl font-bold leading-snug text-[#5C3D2E]">
              {resource.title}
            </div>

            <div className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#C1623F]/80">
              {resource.type}
            </div>
          </div>
        </div>
      </div>

      <h3 className="font-display text-2xl font-bold leading-tight text-chestnut">
        {resource.title}
      </h3>

      <p className="mt-3 flex-1 text-base leading-relaxed text-chestnut-soft">
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
