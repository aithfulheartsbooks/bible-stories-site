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
  const familyTypes = [
    "Reading Tracker",
    "Verse Cards",
    "Prayer",
    "Story Time",
    "Activity Sheet",
  ];
  const coloringResources = resources.filter(
    (resource) => resource.type === "Coloring Page"
  );
  const familyResources = resources.filter((resource) =>
    familyTypes.includes(resource.type)
  );
  const posterResources = resources.filter(
    (resource) => resource.type === "Poster"
  );
  const lessonPackResources = resources.filter(
    (resource) => resource.type === "Lesson Pack"
  );
  const devotionalResources = resources.filter(
    (resource) => resource.type === "Devotional"
  );
  const bookmarkResources = resources.filter(
    (resource) => resource.type === "Bookmark"
  );
  const certificateResources = resources.filter(
    (resource) => resource.type === "Certificate"
  );

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
      ? resources
      : resources.filter((resource) => resource.type === activeType);
  const activeTitle =
    activeType === "Poster"
      ? "Memory Verse Posters"
      : activeType === "Lesson Pack"
        ? "Sunday School Lesson Packs"
        : activeType === "Devotional"
          ? "5-Day Family Devotionals"
          : activeType === "Bookmark"
            ? "Bookmark Set"
            : activeType === "Certificate"
              ? "Certificate of Completion"
              : activeType;

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
            eyebrow={`${familyResources.length} activities`}
            description="Reading trackers, verse cards, prayer cards, and simple story-time sheets."
            resources={familyResources}
          />
          <ResourceSection
            title="Memory Verse Posters"
            eyebrow={`${posterResources.length} posters`}
            description="Beautiful printable posters - one key verse from each story, sized for little walls and big hearts."
            resources={posterResources}
            compact
          />
          <ResourceSection
            title="Sunday School Lesson Packs"
            eyebrow={`${lessonPackResources.length} lesson packs`}
            description="Simple one-page guides for teachers, parents, and church leaders. Each pack pairs with a book in the series."
            resources={lessonPackResources}
            compact
          />
          <ResourceSection
            title="5-Day Family Devotionals"
            eyebrow={`${devotionalResources.length} devotionals`}
            description="A gentle week of story, verse, and connection - one devotional sheet per book, designed for bedtime or mealtime."
            resources={devotionalResources}
            compact
          />
          <ResourceSection
            title="Bookmark Set"
            eyebrow={`${bookmarkResources.length} collection`}
            description="Cut-out bookmarks for little readers - one for every book in the series. Tuck one inside a gifted book or let children collect them all."
            resources={bookmarkResources}
          />
          <ResourceSection
            title="Certificate of Completion"
            eyebrow={`${certificateResources.length} certificate`}
            description="Celebrate every little heart that journeys through the full series."
            resources={certificateResources}
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
            title={activeTitle}
            eyebrow={`${visibleResources.length} printables`}
            description={
              activeType === "Coloring Page"
                ? "Book-by-book coloring pages arranged in series order for easy browsing."
                : activeType === "Poster"
                  ? "Beautiful printable posters - one key verse from each story, sized for little walls and big hearts."
                  : activeType === "Lesson Pack"
                    ? "Simple one-page guides for teachers, parents, and church leaders. Each pack pairs with a book in the series."
                    : activeType === "Devotional"
                      ? "A gentle week of story, verse, and connection - one devotional sheet per book, designed for bedtime or mealtime."
                      : activeType === "Bookmark"
                        ? "Cut-out bookmarks for little readers - one for every book in the series. Tuck one inside a gifted book or let children collect them all."
                        : activeType === "Certificate"
                          ? "Celebrate every little heart that journeys through the full series."
                          : "Gentle printable resources for families, classrooms, and quiet story moments."
            }
            resources={visibleResources}
            compact={[
              "Coloring Page",
              "Poster",
              "Lesson Pack",
              "Devotional",
            ].includes(activeType)}
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
