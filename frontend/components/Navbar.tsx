"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="h-[52px] bg-[#F8F7F2] border-b border-[#E5E5E0] flex items-center justify-between md:justify-start px-4 md:pr-6 md:pl-10 gap-4 shrink-0 z-50">
        {/* Left — Logo */}
        <div className="flex items-center gap-2 w-auto md:w-[240px] shrink-0">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#111111" strokeWidth="1.8" strokeLinejoin="round">
            <polygon points="14,4 26,24 2,24" />
            <polygon points="14,4 20,14 8,14" fill="#111111" stroke="none" opacity="0.15"/>
          </svg>
          <span className="font-bold text-[16px] text-[#111111] tracking-tight">Frontier Atlas</span>
        </div>

        {/* Center — Search (Desktop) Removed */}
        <div className="hidden md:flex flex-1 justify-center">
        </div>

        {/* Right (Desktop) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
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

        {/* Mobile Right (CTA & Hamburger) */}
        <div className="flex md:hidden items-center gap-3 shrink-0">
          <button className="bg-[#F55036] hover:bg-[#E0462D] text-white text-[12px] font-bold px-4 py-2 rounded-md transition-colors cursor-pointer border-none tracking-wide uppercase min-h-[40px]">
            Submit
          </button>
          <button 
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#EBEBE6] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 z-[60] md:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-[280px] bg-[#F8F7F2] z-[70] shadow-xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="h-[52px] border-b border-[#E5E5E0] flex items-center justify-between px-4 shrink-0">
          <span className="font-bold text-[16px] text-[#111111] tracking-tight">Menu</span>
          <button 
             onClick={closeMenu}
             aria-label="Close menu"
             className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#EBEBE6] transition-colors"
           >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
             </svg>
          </button>
        </div>
        
        <div className="p-4 flex flex-col gap-4 overflow-y-auto">
          {/* Mobile Search Removed */}

          {/* Links */}
          <div className="flex flex-col">
            <button 
              onClick={closeMenu} 
              className="flex items-center gap-3 px-3 py-4 rounded-md hover:bg-[#EBEBE6] transition-colors text-left w-full text-[14px] font-medium text-[#111111]"
            >
               <div className="w-8 h-8 rounded-full bg-[#DCDCD7] flex items-center justify-center shrink-0">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2">
                   <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                   <circle cx="12" cy="7" r="4"/>
                 </svg>
               </div>
               Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
