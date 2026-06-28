"use client";


export default function Navbar() {
  return (
    <nav className="h-[52px] bg-[#F8F7F2] border-b border-[#E5E5E0] flex items-center pr-6 pl-10 gap-4 shrink-0 z-50">
      {/* Left — Logo */}
      <div className="flex items-center gap-2 w-[240px] shrink-0">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#111111" strokeWidth="1.8" strokeLinejoin="round">
          <polygon points="14,4 26,24 2,24" />
          <polygon points="14,4 20,14 8,14" fill="#111111" stroke="none" opacity="0.15"/>
        </svg>
        <span className="font-bold text-[16px] text-[#111111] tracking-tight">Frontier Atlas</span>
      </div>

      {/* Center — Search */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2 bg-[#EBEBE6] border border-[#E5E5E0] rounded-md px-3 h-9 w-full max-w-[520px] cursor-text">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="flex-1 text-[12px] text-[#737373]">
            Search papers, authors, topics...
          </span>
          <kbd className="bg-[#F8F7F2] border border-[#DCDCD7] rounded px-1.5 py-0.5 text-[11px] text-[#737373] font-medium">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="bg-[#F55036] hover:bg-[#E0462D] text-white text-[12px] font-bold px-4 py-1.5 rounded-md transition-colors cursor-pointer border-none tracking-wide uppercase">
          Submit
        </button>
        <div className="w-8 h-8 rounded-full bg-[#EBEBE6] flex items-center justify-center cursor-pointer hover:bg-[#DCDCD7] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>
    </nav>
  );
}
