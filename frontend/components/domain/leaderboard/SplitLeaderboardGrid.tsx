'use client';

import React from 'react';

export interface LeaderboardRow {
  rank: number;
  modelName: string;
  creator: string;
  eloScore: number;
  confidenceInterval: string;
  votes: number;
  license: 'Open Source' | 'Proprietary';
  category: 'text' | 'coding' | 'vision' | 'agent';
}

interface SplitGridProps {
  textData: LeaderboardRow[];
  webDevData: LeaderboardRow[];
  loading: boolean;
  onViewCategoryClick: (category: string) => void;
}

export const SplitLeaderboardGrid: React.FC<SplitGridProps> = ({
  textData,
  webDevData,
  loading,
  onViewCategoryClick
}) => {
  
  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-[#FAF8F6] rounded-xl border border-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E0533C]"></div>
      </div>
    );
  }

  // Authentic monochrome icon tokens matching your exact light-themed signature aesthetic
  const getBrandLogo = (creator: string) => {
    const lowerCreator = creator ? creator.toLowerCase() : '';
    
    if (lowerCreator === 'anthropic') {
      return <span className="text-sm font-extrabold font-serif text-slate-800 select-none">A\</span>;
    }
    if (lowerCreator === 'google') {
      return <span className="text-sm font-black font-sans text-slate-700 select-none">G</span>;
    }
    if (lowerCreator === 'openai') {
      return <span className="text-sm font-black font-sans text-slate-700 select-none">⚙</span>;
    }
    if (lowerCreator === 'meta' || lowerCreator === 'z.ai' || lowerCreator === 'anonymized') {
      return <span className="text-base font-medium text-slate-600 select-none leading-none">∞</span>;
    }
    return <span className="text-[9px] font-bold text-gray-400 border border-gray-300 rounded px-1 uppercase">AI</span>;
  };

  const renderMiniBoard = (title: string, icon: React.ReactNode, rows: LeaderboardRow[], categoryKey: string) => {
    const dataSlice = rows.slice(0, 10);
    const maxElo = dataSlice.length > 0 ? Math.max(...dataSlice.map(m => m.eloScore || 1000)) : 1500;
    const minElo = dataSlice.length > 0 ? Math.min(...dataSlice.map(m => m.eloScore || 1000)) : 1000;

    return (
      <div className="flex-1 min-w-[340px] rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between">
        <div>
          {/* Subheader Title Row */}
          <div className="p-4 bg-[#FAF8F6] border-b border-gray-200/80 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-extrabold text-slate-800 text-base">{title}</span>
            </div>
            
            <div className="bg-white px-2.5 py-1 rounded-md border border-gray-200 text-xs font-bold text-slate-600 flex items-center gap-1 cursor-pointer hover:bg-slate-50">
              🏆 Overall
              <svg className="w-3 h-3 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* List Matrix Grid */}
          <div className="p-4 space-y-3">
            {dataSlice.map((model, idx) => {
              const range = maxElo - minElo || 1;
              const currentElo = model.eloScore || minElo;
              const ratio = (currentElo - minElo) / range;
              const greenBarWidthPercentage = 45 + ratio * 55;
              
              const confIntervalString = model.confidenceInterval || '±4';
              const rawCIValue = parseFloat(confIntervalString.replace(/[^\d.]/g, '')) || 4;
              const horizontalLineWidthPx = Math.max(16, Math.min(48, rawCIValue * 4.5));

              return (
                <div key={idx} className="flex items-center gap-3 py-0.5 hover:bg-slate-50/50 rounded-md transition-colors px-1">
                  
                  {/* Square Rank Box */}
                  <div className="w-6 h-6 shrink-0 flex items-center justify-center bg-white border border-slate-200 text-slate-400 text-[11px] font-bold rounded shadow-3xs select-none">
                    {idx + 1}
                  </div>

                  {/* Model Title */}
                  <div className="w-1/3 min-w-[110px] shrink-0">
                    <span className="text-slate-900 font-bold text-xs truncate block cursor-pointer hover:text-[#E0533C] transition-colors">
                      {model.modelName}
                    </span>
                  </div>

                  {/* Brand Mark */}
                  <div className="w-5 shrink-0 flex items-center justify-center text-center">
                    {getBrandLogo(model.creator)}
                  </div>

                  {/* Performance slider track layout */}
                  <div className="flex-1 flex items-center">
                    <div className="w-full h-5 bg-slate-100/80 rounded relative flex items-center border border-slate-200/40 shadow-inner overflow-visible">
                      {/* 🎯 CHANGED: Swapped track highlight fill color color token to bg-[#3cd070] to match LeaderboardTable exactly */}
                      <div 
                        className="bg-[#3cd070] h-full rounded relative flex items-center justify-end transition-all duration-500"
                        style={{ width: `${greenBarWidthPercentage}%` }}
                      >
                        {/* Dynamic error cap bounds */}
                        <div 
                          className="absolute flex items-center justify-center z-10 pointer-events-none"
                          style={{ right: `2px` }}
                        >
                          <div className="bg-slate-800 relative flex justify-between items-center" style={{ width: `${horizontalLineWidthPx}px`, height: '1.5px' }}>
                            <div className="w-[1.2px] bg-slate-800 absolute left-0 h-2 -top-1" />
                            <div className="w-[1.2px] bg-slate-800 absolute right-0 h-2 -top-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Analytics Box */}
                  <div className="w-14 shrink-0 text-left leading-none select-none font-sans pl-1">
                    <div className="text-slate-800 font-extrabold text-[12px] tracking-tight">{currentElo}</div>
                    <div className="text-slate-400 font-medium text-[9px] mt-0.5">{confIntervalString}</div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Navigation Footer panel per category board */}
        <div 
          onClick={() => onViewCategoryClick(categoryKey)}
          className="bg-slate-50 hover:bg-slate-100/80 border-t border-slate-200 text-center py-2.5 transition-colors duration-150 cursor-pointer select-none"
        >
          <span className="text-xs font-bold text-slate-500 tracking-wide">
            View all ▼
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 bg-transparent">
      
      {/* Column 1: Text Dashboard Module */}
      {renderMiniBoard(
        'Text',
        <svg className="w-4 h-4 text-slate-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>,
        textData,
        'chat'
      )}

      {/* Column 2: WebDev Dashboard Module */}
      {renderMiniBoard(
        'WebDev',
        <svg className="w-4 h-4 text-slate-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>,
        webDevData,
        'code'
      )}
      
    </div>
  );
};