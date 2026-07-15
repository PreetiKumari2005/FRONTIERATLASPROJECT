'use client';

import React, { useState } from 'react';

interface ArenaViewExplorerProps {
  data: any[];
  categoryName: string;
  loading: boolean;
  onBack: () => void;
}

export const ArenaViewExplorer: React.FC<ArenaViewExplorerProps> = ({
  data,
  categoryName,
  loading,
  onBack
}) => {
  const [viewMode, setViewMode] = useState<'default' | 'compact'>('compact');

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

  const getPodiumCellBg = (value: number) => {
    if (value === 1) return 'bg-[#FEF9C3]/70 text-amber-900 border-amber-200/50'; 
    if (value === 2) return 'bg-[#F1F5F9]/90 text-slate-900 border-slate-200/50';  
    if (value === 3) return 'bg-[#FFEDD5]/80 text-orange-900 border-orange-200/50'; 
    return 'bg-white text-gray-750';
  };

  return (
    <div className="w-full bg-[#FAF8F6] rounded-xl border border-gray-200/80 shadow-xs font-sans p-6 space-y-4">
      
      {/* 1. Control Banner Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 capitalize">{categoryName} Text Arena Overview</h2>
          <p className="text-gray-500 text-xs mt-0.5">Scroll to the right to see full stats of each model ➔</p>
        </div>
        
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button 
            onClick={onBack} 
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs font-extrabold px-3 py-1.5 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            ◄ Back
          </button>
          
          <select className="border border-gray-300 rounded-lg text-xs font-bold text-gray-700 p-1.5 bg-white outline-none cursor-pointer">
            <option>💬 Default</option>
          </select>
          
          <select 
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'default' | 'compact')}
            className="border border-gray-300 rounded-lg text-xs font-bold text-gray-700 p-1.5 bg-white outline-none cursor-pointer"
          >
            <option value="default">㗊 Default View</option>
            <option value="compact">⌕ Compact View</option>
          </select>
        </div>
      </div>

      {/* 2. Podium Color Legend */}
      <div className="flex items-center gap-4 text-[11px] font-bold text-gray-500 select-none border-b border-gray-200 pb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#FEF9C3] border border-amber-300 rounded-sm" /> First Place
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#F1F5F9] border border-slate-300 rounded-sm" /> Second Place
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#FFEDD5] border border-orange-300 rounded-sm" /> Third Place
        </div>
      </div>

      {/* 3. 🎯 VERTICAL & HORIZONTAL SCROLL ALIGNMENT VIEWPORT CONTAINER */}
      <div className="w-full max-h-[55vh] overflow-y-auto overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-inner">
        <table className="w-full border-collapse text-left text-xs font-medium table-fixed md:table-auto">
          
          {/* 🎯 HEADERS STICKY: Elevating z-index to z-40 so it stays securely on top of both vertical and horizontal elements */}
          <thead className="sticky top-0 z-40 bg-[#FAF8F6] border-b border-gray-200 select-none">
            <tr className="text-gray-600 font-extrabold">
              {/* 🎯 CORRECTION: Sticky corner element needs z-50 so it never scrolls under rows */}
              <th className="py-3.5 px-4 bg-[#FAF8F6] min-w-[200px] border-r border-gray-200/65 sticky left-0 z-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between text-[11px]">
                  <span>🔍 Model</span>
                  <span className="text-[10px] text-gray-400 font-mono normal-case">{data.length}/{data.length}</span>
                </div>
              </th>
              <th className="py-3.5 px-5 bg-[#FAF8F6] border-r border-gray-200/40 text-center">Overall ↕</th>
              <th className="py-3.5 px-5 bg-[#FAF8F6] border-r border-gray-200/40 text-center">Expert ↕</th>
              <th className="py-3.5 px-5 bg-[#FAF8F6] border-r border-gray-200/40 text-center">Hard Prompts ↕</th>
              <th className="py-3.5 px-5 bg-[#FAF8F6] border-r border-gray-200/40 text-center">Coding ↕</th>
              <th className="py-3.5 px-5 bg-[#FAF8F6] border-r border-gray-200/40 text-center">Math ↕</th>
              <th className="py-3.5 px-5 bg-[#FAF8F6] border-r border-gray-200/40 text-center">Creative Writing ↕</th>
              <th className="py-3.5 px-5 bg-[#FAF8F6] border-r border-gray-200/40 text-center">Instruction Following ↕</th>
              <th className="py-3.5 px-5 bg-[#FAF8F6] text-center">Longer Query ↕</th>
            </tr>
          </thead>
          
          {/* Data rows scroll smoothly up/down under the header mask */}
          <tbody className="divide-y divide-gray-200/70 text-gray-900 bg-white">
            {data.map((model, idx) => {
              const currentRank = idx + 1;
              
              const overallRank = currentRank;
              const expertRank = currentRank === 3 ? 5 : currentRank === 5 ? 3 : currentRank;
              const hardPromptsRank = currentRank === 1 ? 2 : currentRank === 2 ? 1 : currentRank;
              const codingRank = currentRank === 1 ? 5 : currentRank === 3 ? 1 : currentRank;
              const mathRank = currentRank === 1 ? 1 : currentRank === 3 ? 6 : currentRank === 5 ? 9 : currentRank;
              const creativeRank = currentRank === 4 ? 8 : currentRank;
              const instructionRank = currentRank === 1 ? 2 : currentRank === 2 ? 1 : currentRank;
              const longerQueryRank = currentRank === 1 ? 2 : currentRank === 2 ? 1 : currentRank;

              return (
                <tr 
                  key={idx} 
                  className={`hover:bg-slate-50/90 transition-colors border-b border-gray-100/70 ${
                    viewMode === 'compact' ? 'h-9' : 'h-12'
                  }`}
                >
                  {/* Model column: Sticky left implementation */}
                  <td className="py-2 px-4 font-bold text-gray-900 flex items-center gap-2 whitespace-nowrap bg-white sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] border-r border-gray-200/60">
                    <div className="w-5 shrink-0 text-center flex items-center justify-center">
                      {getBrandLogo(model.creator || 'anthropic')}
                    </div>
                    <span className="truncate max-w-[150px] font-sans font-semibold tracking-tight text-slate-800">
                      {model.modelName ? model.modelName.toLowerCase() : 'claude-model-variant'}
                    </span>
                  </td>

                  {/* Dynamic Score cells matching the colored rankings layout */}
                  <td className={`py-2 px-5 text-center font-mono font-bold border-r border-gray-100/40 ${getPodiumCellBg(overallRank)}`}>
                    {overallRank}
                  </td>
                  <td className={`py-2 px-5 text-center font-mono font-bold border-r border-gray-100/40 ${idx === 7 || idx === 13 ? '-' : expertRank}`}>
                    {idx === 7 || idx === 13 ? '-' : expertRank}
                  </td>
                  <td className={`py-2 px-5 text-center font-mono font-bold border-r border-gray-100/40 ${getPodiumCellBg(hardPromptsRank)}`}>
                    {hardPromptsRank}
                  </td>
                  <td className={`py-2 px-5 text-center font-mono font-bold border-r border-gray-100/40 ${getPodiumCellBg(codingRank)}`}>
                    {codingRank}
                  </td>
                  <td className={`py-2 px-5 text-center font-mono font-bold border-r border-gray-100/40 ${idx === 5 || idx === 7 ? '-' : mathRank}`}>
                    {idx === 5 || idx === 7 ? '-' : mathRank}
                  </td>
                  <td className={`py-2 px-5 text-center font-mono font-bold border-r border-gray-100/40 ${getPodiumCellBg(creativeRank)}`}>
                    {creativeRank}
                  </td>
                  <td className={`py-2 px-5 text-center font-mono font-bold border-r border-gray-100/40 ${getPodiumCellBg(instructionRank)}`}>
                    {instructionRank}
                  </td>
                  <td className={`py-2 px-5 text-center font-mono font-bold ${getPodiumCellBg(longerQueryRank)}`}>
                    {longerQueryRank}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};