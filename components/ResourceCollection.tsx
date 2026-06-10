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
  "Sequencing Cards": "🃏",
};

const sectionOrder = [
  "Family Printables",
  "Memory Verse Posters",
  "Sunday School Lesson Packs",
  "5-Day Family Devotionals",
  "Story Sequencing Cards",
  "Bookmark Set + Certificate",
  "Coloring Pages",
];

const sectionSubtitles: Record<string, string> = {
  "Story Sequencing Cards":
    "Cut-out scene cards for little hands to arrange in story order - perfect for Sunday school and quiet time.",
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
      "Sequencing Cards",
      "Bookmark",
      "Certificate",
    ],
    []
  );

  const visibleResources =
    activeType === "All Resources"
      ? searchedResources
      : searchedResources.filter((resource) => resource.type === activeType);

  const visibleSections = useMemo(() => {
    return sectionOrder
      .map((section) => ({
        section,
        resources: visibleResources.filter(
          (resource) => resource.section === section
        ),
      }))
      .filter((group) => group.resources.length > 0);
  }, [visibleResources]);

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

      <div className="mt-10 space-y-12 text-left">
        <section>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article className="opacity-0 animate-fade-up flex h-full flex-col rounded-3xl border border-gold/50 bg-cream/90 p-6 text-left shadow-md backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="w-fit rounded-full border border-gold/40 bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-terracotta">
                  Game
                </span>
              </div>

              <div className="mb-5 overflow-hidden rounded-2xl border border-[#E8D9BB] bg-[#FAF3E0] shadow-inner">
                <div className="aspect-[3/4] border-t-4 border-[#C1623F] bg-gradient-to-br from-[#FFFDF8] via-[#FAF3E0] to-[#FCE7D3] p-6">
                  <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white/40 p-6 text-center">
                    <div className="mb-4 font-display text-5xl font-bold text-gold">***</div>
                    <div className="font-display text-xl font-bold leading-snug text-[#5C3D2E]">
                      Daily Story Puzzle
                    </div>
                    <div className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#C1623F]/80">
                      Game
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="font-display text-2xl font-bold leading-tight text-chestnut">
                Daily Story Puzzle
              </h3>

              <p className="mt-3 flex-1 text-base leading-relaxed text-chestnut-soft">
                A new puzzle from the books every day. Solve it and collect a sticker for your album!
              </p>

              <a
                href="/play"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-terracotta px-5 py-3 text-sm font-bold text-cream shadow-sm transition hover:bg-chestnut"
              >
                Play today&apos;s puzzle &rarr;
              </a>
            </article>
          </div>
        </section>

        {visibleSections.map(({ section, resources: sectionResources }) => (
          <section key={section}>
            <div className="mb-6 text-center">
              <h2 className="font-display text-3xl font-extrabold text-chestnut">
                {section}
              </h2>

              {sectionSubtitles[section] ? (
                <p className="mx-auto mt-2 max-w-2xl text-base leading-relaxed text-chestnut-soft">
                  {sectionSubtitles[section]}
                </p>
              ) : null}
            </div>

            <ResourceSectionGrid resources={sectionResources} />
          </section>
        ))}
      </div>
    </>
  );
}

function ResourceSectionGrid({ resources }: { resources: Resource[] }) {
  const groupedResources = resources.reduce<
    Array<{ label?: string; resources: Resource[] }>
  >((groups, resource) => {
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.label === resource.groupLabel) {
      lastGroup.resources.push(resource);
      return groups;
    }

    groups.push({
      label: resource.groupLabel,
      resources: [resource],
    });

    return groups;
  }, []);

  let cardIndex = 0;

  return (
    <div className="space-y-7">
      {groupedResources.map((group, groupIndex) => (
        <div
          key={`${group.label ?? "resources"}-${groupIndex}`}
          className="space-y-4"
        >
          {group.label ? (
            <div className="text-center">
              <span className="inline-flex rounded-full border border-terracotta/20 bg-white/65 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-terracotta shadow-sm backdrop-blur">
                {group.label}
              </span>
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {group.resources.map((resource) => {
              const index = cardIndex;
              cardIndex += 1;

              return (
                <ResourceCard
                  key={resource.title}
                  resource={resource}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ResourceCard({
  resource,
  index,
}: {
  resource: Resource;
  index: number;
}) {
  const icon = resource.icon ?? resourceIcons[resource.type] ?? "📄";

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
            <ResourceThumbnail resource={resource} icon={icon} />

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

function ResourceThumbnail({
  resource,
  icon,
}: {
  resource: Resource;
  icon: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (resource.previewSrc && !imageFailed) {
    return (
      <img
        src={resource.previewSrc}
        alt={resource.previewAlt ?? resource.title}
        onError={() => setImageFailed(true)}
        className="mb-4 block h-full max-h-[220px] w-full rounded-lg object-cover"
      />
    );
  }

  return <div className="mb-4 text-5xl">{icon}</div>;
}
