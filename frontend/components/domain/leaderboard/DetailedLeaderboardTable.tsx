'use client';

import React from 'react';
import { LeaderboardRow } from './LeaderboardTable';

interface DetailedTableProps {
  data: LeaderboardRow[];
  categoryName: string;
  loading: boolean;
  onBack: () => void;
}

export const DetailedLeaderboardTable: React.FC<DetailedTableProps> = ({
  data,
  categoryName,
  loading,
  onBack,
}) => {
  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-[#FAF8F6]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E0533C]"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      
      {/* 🎯 FIXED: Sticky Header wrapper container block to prevent the navbar from disappearing on scroll */}
      <div className="sticky top-0 z-50 bg-[#FAF8F6] pt-2 pb-4 shadow-sm border-b border-gray-200/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            type="button"
            className="px-3 py-1.5 text-xs font-bold border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 cursor-pointer shadow-xs transition-colors"
          >
            ← Back
          </button>
          <div>
            <h2 className="text-lg font-black text-gray-900 capitalize tracking-tight">
              Detailed {categoryName} Matrix Performance Metrics
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Deep dive evaluation including cross-votes, confidence spans, and framework licenses.
            </p>
          </div>
        </div>
        
        <div className="text-xs font-mono bg-white border border-gray-200 rounded-md px-2.5 py-1 text-gray-500 shadow-2xs font-bold">
          Total Models: {data.length}
        </div>
      </div>

      {/* Main Massive Data Grid Structure */}
      <div className="w-full rounded-xl border border-gray-200/60 bg-white shadow-xs overflow-x-auto">
        <table className="w-full border-collapse text-left font-sans text-sm">
          <thead>
            <tr className="bg-[#FAF8F6] border-b border-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider">
              <th className="p-4 w-16 text-center">Rank</th>
              <th className="p-4 min-w-[220px]">Model Name</th>
              <th className="p-4">Creator</th>
              <th className="p-4 text-right">ELO Score</th>
              <th className="p-4 text-center">Confidence Interval</th>
              <th className="p-4 text-right">Votes Received</th>
              <th className="p-4 text-center">License Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150">
            {data.map((model, idx) => (
              <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                <td className="p-4 text-center font-bold text-gray-500">{model.rank}</td>
                <td className="p-4 font-extrabold text-gray-900">{model.modelName}</td>
                <td className="p-4 text-gray-600 font-medium">{model.creator}</td>
                <td className="p-4 text-right font-mono font-bold text-emerald-600">{model.eloScore}</td>
                <td className="p-4 text-center font-mono text-gray-400 text-xs">{model.confidenceInterval}</td>
                <td className="p-4 text-right font-mono text-gray-600">{model.votes?.toLocaleString()}</td>
                <td className="p-4 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase ${
                    model.license === 'Open Source' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {model.license}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};