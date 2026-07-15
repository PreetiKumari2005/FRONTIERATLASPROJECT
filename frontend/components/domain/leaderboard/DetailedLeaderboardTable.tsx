'use client';

import React, { useState } from 'react';

interface DetailedTableProps {
  data: any[];
  categoryName: string;
  loading: boolean;
  onBack: () => void;
}

export const DetailedLeaderboardTable: React.FC<DetailedTableProps> = ({
  data,
  categoryName,
  loading,
  onBack
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [rankBy, setRankBy] = useState<'models' | 'labs'>('models');

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-[#FAF8F6] rounded-xl border border-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E0533C]"></div>
      </div>
    );
  }

  const maxElo = data.length > 0 ? Math.max(...data.map(m => m.eloScore || 1000)) : 1600;
  const minElo = data.length > 0 ? Math.min(...data.map(m => m.eloScore || 1000)) : 1000;

  // 🎯 Fixed: Self-contained paths to completely eliminate the react-icons import exception
  const getBrandLogo = (creator: string) => {
    const lowerCreator = creator ? creator.toLowerCase() : '';
    
    if (lowerCreator === 'openai') {
      return (
        <svg className="w-4 h-4 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5-1-2.5-2.7-2.5-4.5 0-3 2.5-5.5 5.5-5.5.5 0 1 0 1.5.2L12 8.5M19.5 7.5c1.5 1 2.5 2.7 2.5 4.5 0 3-2.5 5.5-5.5 5.5-.5 0-1 0-1.5-.2L12 15.5" />
          <path d="M12 8.5c1-1.5 2.7-2.5 4.5-2.5 3 0 5.5 2.5 5.5 5.5 0 .5 0 1-.2 1.5L20 12M12 15.5c-1 1.5-2.7 2.5-4.5 2.5-3 0-5.5-2.5-5.5-5.5 0-.5 0-1 .2-1.5L4 12" />
          <path d="M6.2 7.7L12 12.5l5.8-4.8M17.8 16.3L12 11.5l-5.8 4.8" />
        </svg>
      );
    }
    
    if (lowerCreator === 'anthropic') {
      return (
        <svg className="w-4 h-4 text-gray-900 select-none font-black" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 21h3l2.25-6.5h4.5L16.5 21h3L13.25 3h-2.5L4.5 21zm7.25-11.5l1.55 4.5h-3.1l1.55-4.5z" />
        </svg>
      );
    }
    
    if (lowerCreator === 'google') {
      return (
        <svg className="w-4 h-4 text-gray-700 font-bold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 12H11.5M11.5 12V12.5C11.5 15.5 13.5 18 17 18C20 18 21.5 15.5 21.5 12.5C21.5 8 18 5 12.5 5C6.5 5 2.5 9.5 2.5 14.5C2.5 19 6 21.5 11 21.5C15 21.5 18.5 19.5 19.5 17.5" />
        </svg>
      );
    }

    if (lowerCreator === 'meta' || lowerCreator === 'z.ai') {
      return (
        <svg className="w-4 h-4 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12c-1.5-2.5-4.5-4-7.5-4s-3.5 2-3.5 4 1.5 4 4.5 4 6-2.5 6.5-4zm0 0c1.5 2.5 4.5 4 7.5 4s3.5-2 3.5-4-1.5-4-4.5-4-6 2.5-6.5 4z" />
        </svg>
      );
    }

    return (
      <span className="text-[9px] font-black text-gray-400 tracking-tighter border border-gray-300 rounded px-1 py-0.5 bg-white uppercase">AI</span>
    );
  };

  return (
    <div className="w-full bg-[#FAF8F6] rounded-xl border border-gray-200/60 shadow-sm overflow-hidden font-sans p-6 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-gray-900 capitalize">{categoryName} Arena</h2>
            <button className="flex items-center gap-1.5 border border-gray-300 hover:bg-gray-100/50 text-gray-700 text-xs font-bold px-3 py-1 rounded-lg transition-colors shadow-xs">
              View Methodology
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
          <p className="text-gray-500 text-sm max-w-3xl leading-relaxed">
            Dynamic ranking of models evaluated on tool orchestration proficiency, multi-turn system reliability, and steerability parameters.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400 pt-2">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Live Registry
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Crowdsourced Benchmarks
            </span>
            <span>•</span>
            <span className="text-gray-500">{data.length} models tracked</span>
          </div>
        </div>
        
        <button onClick={onBack} className="shrink-0 self-start md:self-center border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-extrabold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
          ◄ Return to Matrix View
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
          <span>Rank by</span>
          <div className="bg-[#EAE6E1]/60 p-1 rounded-lg border border-gray-300/30 flex items-center">
            <button onClick={() => setRankBy('models')} className={`px-3 py-1 rounded transition-colors ${rankBy === 'models' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>Models</button>
            <button onClick={() => setRankBy('labs')} className={`px-3 py-1 rounded transition-colors ${rankBy === 'labs' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>Labs</button>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[#FAF8F6] border-b border-gray-200 text-gray-400 text-xs font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4 w-16">Rank</th>
              <th className="py-3.5 px-4 min-w-[200px]">Model</th>
              <th className="py-3.5 px-4 w-32">Net Improvement</th>
              <th className="py-3.5 px-4 min-w-[220px]">Performance Matrix</th>
              <th className="py-3.5 px-4 bg-emerald-500/5 text-emerald-700 w-40">Confirmed Success</th>
              <th className="py-3.5 px-4 bg-emerald-500/10 text-emerald-800 w-40">Praise vs Complaint</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-900">
            {data.map((model, idx) => {
              const range = maxElo - minElo || 1;
              const ratio = ((model.eloScore || minElo) - minElo) / range;
              const greenBarWidthPercentage = 50 + ratio * 50;

              const netImp = (15 - idx * 0.88).toFixed(2);
              const confSuccess = (17.27 - idx * 1.15).toFixed(2);
              const praiseRate = (30.65 - idx * 1.85).toFixed(2);
              const confInterval = model.confidenceInterval || '±1.22%';
              
              const rawCIValue = parseFloat(confInterval.replace(/[^\d.]/g, '')) || 1.5;
              const horizontalLineWidthPx = Math.max(12, Math.min(50, rawCIValue * 15));
              const markerHeightPx = 8;
              const capOffset = (markerHeightPx / 2) - 1;

              return (
                <tr key={idx} className="hover:bg-gray-50/50 transition-all">
                  <td className="py-4 px-4 align-middle">
                    <div className="flex flex-col text-center">
                      <span className="font-extrabold text-gray-900 text-base">{model.rank}</span>
                      <span className="text-[10px] font-bold text-gray-400 tracking-tighter">{model.rank} ↔ {model.rank + (idx % 3)}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                        {getBrandLogo(model.creator)}
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="font-extrabold text-gray-950 hover:text-[#E0533C] cursor-pointer transition-colors text-sm">{model.modelName}</span>
                        <span className="text-[10px] font-bold text-gray-400 mt-0.5">{model.creator} • {model.license || 'Proprietary'}</span>
                      </div>
                    </div>
                  </td>

                  {/* Winrate Stats (Left of Graph) */}
                  <td className="py-4 px-4 align-middle select-none">
                    <div className="text-emerald-600 font-extrabold text-sm">▲ {netImp}%</div>
                    <span className="text-gray-400 font-mono text-[10px]">{confInterval}</span>
                  </td>

                  {/* Graphical Slider Visual Component */}
                  <td className="py-4 px-4 align-middle">
                    <div className="w-full h-6 rounded overflow-visible relative flex items-center">
                      <div className="w-[35%] h-full bg-[#EAE6E1]/40 rounded-l border-r border-gray-300/30" />
                      <div className="w-[65%] h-full bg-[#EAE6E1] rounded-r relative flex items-center shadow-inner border border-gray-300/10">
                        <div 
                          className="bg-[#3cd070] h-full relative flex items-center justify-end"
                          style={{ width: `${greenBarWidthPercentage}%` }}
                        >
                          {/* Built-in Variance Margin Indicator Caps */}
                          <div 
                            className="absolute flex items-center justify-center z-10 pointer-events-none"
                            style={{ right: `-${horizontalLineWidthPx / 2}px` }}
                          >
                            <div className="bg-gray-800 relative flex justify-between items-center" style={{ width: `${horizontalLineWidthPx}px`, height: '2px' }}>
                              <div className="w-[2px] bg-gray-800 absolute left-0" style={{ height: `${markerHeightPx}px`, top: -capOffset }} />
                              <div className="w-[2px] bg-gray-800 absolute right-0" style={{ height: `${markerHeightPx}px`, top: -capOffset }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 bg-emerald-500/5 text-emerald-800 align-middle">
                    <div className="flex flex-col text-right leading-tight pr-4">
                      <span className="font-extrabold text-xs">▲ {confSuccess}%</span>
                      <span className="text-emerald-600/60 font-semibold text-[9px]">±2.75%</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 bg-emerald-500/10 text-emerald-900 align-middle">
                    <div className="flex flex-col text-right leading-tight pr-4">
                      <span className="font-extrabold text-xs">▲ {praiseRate}%</span>
                      <span className="text-emerald-700/60 font-semibold text-[9px]">±5.67%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Nominative Trademarks Legal Disclaimer */}
      <div className="w-full text-center text-[10px] text-gray-400/80 leading-normal pt-2 font-medium">
        ChatGPT, GPT-4, and the OpenAI logo are trademarks of OpenAI, Inc. Claude is a trademark of Anthropic PBC. Gemini is a trademark of Google LLC. All product names, logos, and brands are property of their respective owners and are used here solely for nominative identification purposes. Use of them does not imply any affiliation with or endorsement by them.
      </div>
    </div>
  );
};