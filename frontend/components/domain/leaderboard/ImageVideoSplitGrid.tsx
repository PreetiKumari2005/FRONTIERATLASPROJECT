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
  category: 'text' | 'coding' | 'vision' | 'agent' | 'image' | 'video';
}

interface SplitGridProps {
  imageData: LeaderboardRow[];
  videoData: LeaderboardRow[];
  loading: boolean;
  onViewCategoryClick: (category: string) => void;
}

export const ImageVideoSplitGrid: React.FC<SplitGridProps> = ({
  imageData,
  videoData,
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

  const getBrandLogo = (creator: string) => {
    const lowerCreator = creator ? creator.toLowerCase() : '';
    if (lowerCreator === 'anthropic') return <span className="text-sm font-extrabold font-serif text-slate-800 select-none">A\</span>;
    if (lowerCreator === 'google') return <span className="text-sm font-black font-sans text-slate-700 select-none">G</span>;
    if (lowerCreator === 'openai') return <span className="text-sm font-black font-sans text-slate-700 select-none">⚙</span>;
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

          <div className="p-4 space-y-3">
            {dataSlice.map((model, idx) => {
              const range = maxElo - minElo || 1;
              const currentElo = model.eloScore || minElo;
              const ratio = (currentElo - minElo) / range;
              const greenBarWidthPercentage = 45 + ratio * 50;
              
              const confIntervalString = model.confidenceInterval || '±8';
              const rawCIValue = parseFloat(confIntervalString.replace(/[^\d.]/g, '')) || 8;
              const horizontalLineWidthPx = Math.max(16, Math.min(48, rawCIValue * 3.5));

              return (
                <div key={idx} className="flex items-center gap-3 py-0.5 hover:bg-slate-50/50 rounded-md transition-colors px-1">
                  <div className="w-6 h-6 shrink-0 flex items-center justify-center bg-white border border-slate-200 text-slate-400 text-[11px] font-bold rounded shadow-3xs select-none">
                    {idx + 1}
                  </div>
                  <div className="w-1/3 min-w-[110px] shrink-0">
                    <span className="text-slate-900 font-bold text-xs truncate block cursor-pointer hover:text-[#E0533C] transition-colors">
                      {model.modelName}
                    </span>
                  </div>
                  <div className="w-5 shrink-0 flex items-center justify-center text-center">
                    {getBrandLogo(model.creator)}
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="w-full h-5 bg-slate-100/80 rounded relative flex items-center border border-slate-200/40 shadow-inner overflow-visible">
                      <div 
                        className="bg-[#3cd070] h-full rounded relative flex items-center justify-end transition-all duration-500"
                        style={{ width: `${greenBarWidthPercentage}%` }}
                      >
                        <div className="absolute flex items-center justify-center z-10 pointer-events-none" style={{ right: `2px` }}>
                          <div className="bg-slate-800 relative flex justify-between items-center" style={{ width: `${horizontalLineWidthPx}px`, height: '1.5px' }}>
                            <div className="w-[1.2px] bg-slate-800 absolute left-0 h-2 -top-1" />
                            <div className="w-[1.2px] bg-slate-800 absolute right-0 h-2 -top-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-14 shrink-0 text-left leading-none select-none font-sans pl-1">
                    <div className="text-slate-800 font-extrabold text-[12px] tracking-tight">{currentElo}</div>
                    <div className="text-slate-400 font-medium text-[9px] mt-0.5">{confIntervalString}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div 
          onClick={() => onViewCategoryClick(categoryKey)}
          className="bg-slate-50 hover:bg-slate-100/80 border-t border-slate-200 text-center py-2.5 transition-colors duration-150 cursor-pointer select-none"
        >
          <span className="text-xs font-bold text-slate-500 tracking-wide">View all ▼</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 bg-transparent">
      {renderMiniBoard(
        'Image Generation',
        <svg className="w-4 h-4 text-slate-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>,
        imageData,
        'image'
      )}

      {renderMiniBoard(
        'Video Synthesis',
        <svg className="w-4 h-4 text-slate-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l5.555-3.678A1 1 0 0122 7.158v9.684a1 1 0 01-1.445.892L15 14v-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z" />
        </svg>,
        videoData,
        'video'
      )}
    </div>
  );
};