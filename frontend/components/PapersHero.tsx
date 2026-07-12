"use client";

import { useState } from "react";
import { Bot, Brain, Code2, Cpu, Eye, Grid } from "lucide-react";
import SearchBar from "@/components/SearchBar";

const PAPER_TOPIC_TAGS = [
  { label: "Agents", icon: Bot },
  { label: "Reasoning", icon: Brain },
  { label: "Vision", icon: Eye },
  { label: "Coding", icon: Code2 },
  { label: "Robotics", icon: Cpu },
  { label: "All Topics", icon: Grid },
];

interface PapersHeroProps {
  initialQuery?: string;
  selectedTag?: string;
  onTagSelect: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function PapersHero({
  initialQuery = "",
  selectedTag,
  onTagSelect,
}: PapersHeroProps) {
  const [showAllTags, setShowAllTags] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center pt-4 md:pt-6 pb-6 md:pb-10 relative shrink-0 text-center">
      <div className="w-full flex flex-col items-center z-10">
        <h1 className="text-[17px] min-[375px]:text-[19px] sm:text-[24px] md:text-[32px] lg:text-[36px] font-extrabold leading-[1.2] md:leading-[1.05] tracking-tight text-[#111111] mb-2 md:mb-1.5 whitespace-nowrap">
          Discover what&apos;s next in <span className="text-[#F55036]">AI research.</span>
        </h1>
        <p className="text-[#555555] text-[14px] md:text-[15px] leading-[1.6] md:leading-[1.5] mb-3 md:mb-4 whitespace-normal md:whitespace-nowrap max-w-[400px] md:max-w-none">
          Search, discover, and track papers, methods, benchmarks, and open-source releases.
        </p>

        <div className="w-full max-w-[640px] mb-3 md:mb-4 mx-auto">
          <SearchBar
            variant="default"
            placeholder="Search papers, authors, topics, methods..."
            initialQuery={initialQuery}
            layoutIdPrefix="papers"
          />
        </div>

        <div className="w-full max-w-[900px] px-2 pb-2 md:pb-0">
          <div className="hidden md:flex flex-wrap items-center justify-center gap-2">
            {PAPER_TOPIC_TAGS.map((tag) => (
              <button
                key={tag.label}
                onClick={() =>
                  onTagSelect(selectedTag === tag.label ? undefined : tag.label)
                }
                className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 min-h-[32px] transition-all duration-200 ease-out cursor-pointer select-none ${
                  selectedTag === tag.label
                    ? "bg-[#F55036] text-white border border-[#F55036] scale-[1.04] shadow-[0_2px_8px_rgba(245,80,54,0.30)]"
                    : "bg-white border border-[#E5E5E0] hover:border-[#FF5A1F]/50 hover:bg-[#FFF7F3] hover:scale-[1.03] hover:shadow-sm active:scale-95"
                }`}
              >
                <tag.icon
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    selectedTag === tag.label ? "text-white" : "text-[#F55036]"
                  }`}
                />
                <span
                  className={`text-[12px] font-semibold ${
                    selectedTag === tag.label ? "text-white" : "text-[#111111]"
                  }`}
                >
                  {tag.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex md:hidden flex-col items-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {PAPER_TOPIC_TAGS.filter(
                (tag, index) =>
                  showAllTags || index < 4 || selectedTag === tag.label,
              ).map((tag) => (
                <button
                  key={tag.label}
                  onClick={() =>
                    onTagSelect(selectedTag === tag.label ? undefined : tag.label)
                  }
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 min-h-[28px] transition-all duration-200 ease-out cursor-pointer select-none ${
                    selectedTag === tag.label
                      ? "bg-[#F55036] text-white border border-[#F55036] scale-[1.04] shadow-[0_2px_8px_rgba(245,80,54,0.30)]"
                      : "bg-white border border-[#E5E5E0] hover:border-[#FF5A1F]/50 hover:bg-[#FFF7F3] hover:scale-[1.03] hover:shadow-sm active:scale-95"
                  }`}
                >
                  <tag.icon
                    className={`w-3 h-3 transition-transform duration-200 ${
                      selectedTag === tag.label ? "text-white" : "text-[#F55036]"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold ${
                      selectedTag === tag.label ? "text-white" : "text-[#111111]"
                    }`}
                  >
                    {tag.label}
                  </span>
                </button>
              ))}
            </div>

            {PAPER_TOPIC_TAGS.length > 4 ? (
              <button
                onClick={() => setShowAllTags((value) => !value)}
                className="flex items-center gap-1 text-[11px] font-medium text-[#8B8B8B] hover:text-[#F55036] transition-colors duration-200 mt-1"
              >
                {showAllTags ? "Show less" : "Show more"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
