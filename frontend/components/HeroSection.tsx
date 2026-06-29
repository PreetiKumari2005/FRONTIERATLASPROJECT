import { Search, Bot, Brain, Eye, Code2, Cpu, Grid } from "lucide-react";

export default function HeroSection() {
  const tags = [
    { label: "Agents", icon: Bot },
    { label: "Reasoning", icon: Brain },
    { label: "Vision", icon: Eye },
    { label: "Coding", icon: Code2 },
    { label: "Robotics", icon: Cpu },
    { label: "All Topics", icon: Grid },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center pt-4 md:pt-5 pb-4 md:pb-10 px-4 md:px-10 rounded-[24px] relative overflow-hidden shrink-0 text-center border border-[#FDECE8]" style={{ background: "linear-gradient(180deg, #FFF6F3 0%, #F8F7F2 100%)" }}>
      
      <div className="w-full flex flex-col items-center z-10">
        <h1 className="text-[26px] sm:text-[28px] md:text-[32px] lg:text-[36px] font-bold leading-[1.2] md:leading-[1.05] tracking-tight text-[#111111] mb-2 md:mb-1.5 whitespace-normal md:whitespace-nowrap">
          Discover what&apos;s next in <span className="text-[#F55036]">AI research.</span>
        </h1>
        <p className="text-[#555555] text-[14px] md:text-[15px] leading-[1.6] md:leading-[1.5] mb-3 md:mb-4 whitespace-normal md:whitespace-nowrap max-w-[400px] md:max-w-none">
          Search, discover, and track papers, methods, benchmarks, and open-source releases.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-[640px] relative shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full bg-white border border-[#E5E5E0] flex items-center px-4 md:px-5 h-11 mb-3 md:mb-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow cursor-text mx-auto">
          <Search size={18} className="text-[#737373] mr-2 md:mr-3 shrink-0 md:w-[20px] md:h-[20px]" />
          <span className="flex-1 text-[#737373] text-[13px] md:text-[15px] truncate mr-2 text-left">
            Search papers, authors, topics, methods...
          </span>
          <kbd className="inline-flex shrink-0 bg-[#F8F7F2] border border-[#DCDCD7] rounded-md px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-[12px] text-[#737373] font-medium shadow-sm">
            ⌘ K
          </kbd>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 w-full max-w-[640px] h-auto overflow-visible md:h-[44px] md:overflow-hidden">
          {tags.map((tag) => (
            <button 
              key={tag.label}
              className="flex shrink-0 items-center gap-2 bg-white border border-[#E5E5E0] rounded-full px-4 py-2 min-h-[44px] md:min-h-[32px] hover:border-[#F55036] hover:shadow-sm transition-all cursor-pointer group"
            >
              <tag.icon size={16} className="text-[#F55036] group-hover:scale-110 transition-transform" />
              <span className="text-[13px] font-bold text-[#111111]">{tag.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
