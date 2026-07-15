'use client';

import React, { useState } from 'react';

export type MainCategory = 'agent' | 'chat' | 'code' | 'image' | 'video';

interface SubCategoryItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface HeaderProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  onlyNavbar?: boolean; // 🎯 Controlled splitter property flag
}

export const LeaderboardHeader: React.FC<HeaderProps> = ({ 
  currentCategory, 
  onCategoryChange,
  onlyNavbar = false
}) => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<MainCategory>('chat');

  const subMenus: Record<MainCategory, SubCategoryItem[]> = {
    agent: [
      {
        id: 'agent-all',
        title: 'General Agents',
        description: 'Rankings across autonomous tool-use and multi-turn system agents',
        icon: (
          <svg className="w-5 h-5 text-gray-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        )
      }
    ],
    chat: [
      {
        id: 'text',
        title: 'Text',
        description: 'Rankings across text-to-text tasks and more',
        icon: (
          <svg className="w-5 h-5 text-gray-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )
      },
      {
        id: 'search',
        title: 'Search',
        description: 'Rankings across web search-integrated LLMs',
        icon: (
          <svg className="w-5 h-5 text-gray-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        )
      },
      {
        id: 'vision',
        title: 'Vision',
        description: 'Rankings across multimodal visual models',
        icon: (
          <svg className="w-5 h-5 text-gray-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )
      },
      {
        id: 'document',
        title: 'Document',
        description: 'Rankings across document analysis models',
        icon: (
          <svg className="w-5 h-5 text-gray-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      }
    ],
    code: [
      {
        id: 'webdev',
        title: 'WebDev',
        description: 'Rankings across front-end web development tasks',
        icon: (
          <svg className="w-5 h-5 text-gray-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        )
      },
      {
        id: 'image-to-webdev',
        title: 'Image-to-WebDev',
        description: 'Rankings across image-to-webdev generation models',
        icon: (
          <svg className="w-5 h-5 text-gray-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      }
    ],
    image: [
      {
        id: 'text-to-image',
        title: 'Text-to-Image',
        description: 'Rankings across text-to-image generation models',
        icon: (
          <svg className="w-5 h-5 text-gray-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      },
      {
        id: 'image-edit',
        title: 'Image Edit',
        description: 'Rankings across image editing models',
        icon: (
          <svg className="w-5 h-5 text-gray-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
      }
    ],
    video: [
      {
        id: 'text-to-video',
        title: 'Text-to-Video',
        description: 'Rankings across text-to-video generation models',
        icon: (
          <svg className="w-5 h-5 text-gray-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l5.555-3.678A1 1 0 0122 7.158v9.684a1 1 0 01-1.445.892L15 14v-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z" />
          </svg>
        )
      },
      {
        id: 'image-to-video',
        title: 'Image-to-Video',
        description: 'Rankings across image-to-video generation models',
        icon: (
          <svg className="w-5 h-5 text-gray-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l5.555-3.678A1 1 0 0122 7.158v9.684a1 1 0 01-1.445.892L15 14v-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z" />
          </svg>
        )
      },
      {
        id: 'video-edit',
        title: 'Video Edit',
        description: 'View overall rankings across video editing AI models.',
        icon: (
          <svg className="w-5 h-5 text-gray-700 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )
      }
    ]
  };

  const handleTabSelection = (tab: MainCategory) => {
    setActiveTab(tab);
    if (subMenus[tab] && subMenus[tab].length > 0) {
      onCategoryChange(subMenus[tab][0].id);
    }
  };

  // 🎯 Part A: Return only the header navigation strip if called from top level wrapper
  if (onlyNavbar) {
    return (
      <div className="w-full bg-[#EAE6E1] px-6 py-3 flex items-center justify-between rounded-xl border border-gray-300/60 shadow-inner">
        <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 px-3 py-1.5 rounded-lg border border-gray-300/70 shadow-xs transition-colors text-sm font-bold cursor-pointer">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Overview
        </button>

        <div className="flex items-center gap-2 text-sm">
          {(['agent', 'chat', 'code', 'image', 'video'] as MainCategory[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabSelection(tab)}
              className={`px-4 py-1.5 rounded-lg transition-all font-bold tracking-wide flex items-center gap-1.5 capitalize border cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-[#E0533C] border-gray-300/60 shadow-sm'
                  : 'text-gray-700 border-transparent hover:text-gray-950'
              }`}
            >
              {tab}
              {tab !== 'agent' && (
                <svg className={`w-3 h-3 pt-0.5 transition-transform duration-200 ${activeTab === tab ? 'rotate-180 text-[#E0533C]' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          ))}
        </div>

        <button className="bg-[#E0533C] hover:bg-[#c7442e] text-white font-extrabold text-xs tracking-wide px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer">
          Start Voting
        </button>
      </div>
    );
  }

  // 🎯 Part B: Return description grids, titles and badges into standard page flow
  return (
    <div className="w-full font-sans select-none flex flex-col">
      
      {/* Dropdown Options Submenu Grid */}
      <div className="w-full bg-[#EAE6E1]/50 border rounded-xl border-gray-300/60 px-6 py-5 shadow-sm">
        <div className="w-full flex items-start gap-10 overflow-x-auto pb-1 scrollbar-thin">
          {subMenus[activeTab].map((subItem) => {
            const isSelected = currentCategory.toLowerCase() === subItem.id.toLowerCase();
            return (
              <div
                key={subItem.id}
                onClick={() => onCategoryChange(subItem.id)}
                className={`flex items-start gap-3 min-w-[240px] max-w-[320px] p-3 rounded-xl cursor-pointer transition-all border ${
                  isSelected 
                    ? 'bg-white border-[#E0533C]/60 shadow-sm' 
                    : 'border-transparent hover:bg-white/60'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#E0533C]/10 text-[#E0533C]' : 'bg-gray-200/60'}`}>
                  {subItem.icon}
                </div>
                
                <div className="flex-1 flex flex-col leading-tight">
                  <span className={`text-sm font-extrabold tracking-tight ${isSelected ? 'text-[#E0533C]' : 'text-gray-900'}`}>
                    {subItem.title}
                  </span>
                  <span className="text-[11px] font-medium text-gray-500 mt-1 leading-snug">
                    {subItem.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Title Headline Banner Container */}
      <div className="w-full bg-[#FAF8F6] pt-6 pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none mb-2">
          Model <span className="text-[#E0533C]">Leaderboard</span>
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl font-medium leading-relaxed">
          Discover what's next in AI research across text, coding, vision, and deep system agent benchmarks via crowdsourced human preference rankings.
        </p>
      </div>

      {/* Mini Analytics Summary Badges Row */}
      <div className="w-full bg-[#FAF8F6] pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Total Active Matches</div>
          <div className="text-xl font-extrabold text-gray-900 mt-1">1,240,590+</div>
        </div>
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Evaluated Foundations</div>
          <div className="text-xl font-extrabold text-[#E0533C] mt-1">140+ Models</div>
        </div>
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Elected License Split</div>
          <div className="text-xl font-extrabold text-gray-900 mt-1">62% Open Source</div>
        </div>
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs">
          <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Last Registry Tick</div>
          <div className="text-xl font-extrabold text-emerald-600 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Live Updated
          </div>
        </div>
      </div>

      {/* View Configurations Control Toolbar Strip */}
      <div className="w-full bg-[#FAF8F6] py-3 flex items-center justify-between border-b border-gray-200/60 mb-2">
        <div className="bg-[#EAE6E1]/50 p-1 rounded-lg flex items-center gap-1 border border-gray-300/30">
          <button 
            onClick={() => setViewType('grid')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${viewType === 'grid' ? 'bg-white shadow-xs text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          </button>
          <button 
            onClick={() => setViewType('list')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${viewType === 'list' ? 'bg-white shadow-xs text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

        <button className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs bg-white cursor-pointer">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Edit View
        </button>
      </div>

    </div>
  );
};