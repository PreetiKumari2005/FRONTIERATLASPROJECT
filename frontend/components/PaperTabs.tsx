"use client";

import { useState } from "react";

const TABS = ["Today", "This Week", "This Month", "All time"];

interface PaperTabsProps {
  selectedPeriod?: string;
  onPeriodSelect?: (period: string) => void;
}

export default function PaperTabs({
  selectedPeriod,
  onPeriodSelect,
}: PaperTabsProps = {}) {
  const [internalActiveTab, setInternalActiveTab] = useState("Today");
  const activeTab = selectedPeriod ?? internalActiveTab;

  const handleTabClick = (tab: string) => {
    if (selectedPeriod === undefined) {
      setInternalActiveTab(tab);
    }
    onPeriodSelect?.(tab);
  };

  return (
    <div className="border-b border-[#E5E5E0] mb-3">
      <div className="flex gap-1 overflow-x-auto hide-scroll">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-1 py-3 mr-8 text-[13px] font-normal border-b transition-all duration-150 cursor-pointer whitespace-nowrap
              ${
                activeTab === tab
                  ? "text-[#111111] border-[#F55036] font-bold"
                  : "text-[#8B8B8B] border-transparent hover:text-[#111111] hover:border-transparent"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
