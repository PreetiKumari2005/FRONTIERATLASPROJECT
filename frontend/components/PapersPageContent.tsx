"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PaperList from "@/components/PaperFeed";
import PaperTabs from "@/components/PaperTabs";
import PapersHero from "@/components/PapersHero";
import type { GetPapersResult } from "@/lib/paperApi";

interface PapersPageContentProps {
  initialPapers: GetPapersResult | null;
  initialError?: string;
  initialQuery?: string;
}

export default function PapersPageContent({
  initialPapers,
  initialError,
  initialQuery = "",
}: PapersPageContentProps) {
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [activeSort, setActiveSort] = useState<string>("Latest Papers");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("All time");
  const isMounted = useRef(false);

  useEffect(() => {
    const savedSort = sessionStorage.getItem("atlas_papers_activeSort");
    const savedPeriod = sessionStorage.getItem("atlas_papers_selectedPeriod");

    if (savedSort && savedSort !== "undefined" && savedSort !== "null") {
      setActiveSort(savedSort);
    }

    if (savedPeriod && savedPeriod !== "undefined" && savedPeriod !== "null") {
      setSelectedPeriod(savedPeriod);
    }

    setTimeout(() => {
      isMounted.current = true;
    }, 0);
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      sessionStorage.setItem("atlas_papers_activeSort", activeSort);
    }
  }, [activeSort]);

  useEffect(() => {
    if (isMounted.current) {
      sessionStorage.setItem("atlas_papers_selectedPeriod", selectedPeriod);
    }
  }, [selectedPeriod]);

  const apiPeriod =
    selectedPeriod === "Today"
      ? "today"
      : selectedPeriod === "This Week"
        ? "week"
        : selectedPeriod === "This Month"
          ? "month"
          : "all";

  const apiSort = activeSort === "Trending Papers" ? "trending" : "latest";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <Navbar activeSort={activeSort} onItemSelect={setActiveSort} />
      <div
        id="scroll-container"
        className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll flex flex-col"
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-6">
          <PapersHero
            initialQuery={initialQuery}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
          />
        </div>

        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-4 pb-12 flex items-start gap-6 xl:gap-8">
          <div className="hidden lg:block w-[200px] shrink-0 sticky top-6 h-fit max-h-[calc(100vh-80px)]">
            <Sidebar initialActive={activeSort} onItemSelect={setActiveSort} />
          </div>

          <main className="flex-1 min-w-0 max-w-full xl:max-w-[1120px]">
            <PaperTabs
              selectedPeriod={selectedPeriod}
              onPeriodSelect={setSelectedPeriod}
            />
            <PaperList
              selectedTag={selectedTag}
              searchQuery={initialQuery}
              period={apiPeriod}
              filterParams={{ sort: apiSort }}
              initialPapers={initialPapers}
              initialError={initialError}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
