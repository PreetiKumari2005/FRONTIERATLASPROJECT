'use client';

import React, { useState, useEffect } from 'react';
import { LeaderboardHeader } from '@/components/domain/leaderboard/LeaderboardHeader';
import { LeaderboardTable } from '@/components/domain/leaderboard/LeaderboardTable';
import { SplitLeaderboardGrid } from '@/components/domain/leaderboard/SplitLeaderboardGrid';
import { VisionDocumentSplitGrid } from '@/components/domain/leaderboard/VisionDocumentSplitGrid';
import { ImageVideoSplitGrid } from '@/components/domain/leaderboard/ImageVideoSplitGrid';
import { ImageWebDevSearchSplitGrid } from '@/components/domain/leaderboard/ImageWebDevSearchSplitGrid';
import { VideoSplitGrid } from '@/components/domain/leaderboard/VideoSplitGrid';
import { VideoEditLeaderboardGrid } from '@/components/domain/leaderboard/VideoEditLeaderboardGrid';
import { ArenaViewExplorer } from '@/components/domain/leaderboard/ArenaViewExplorer';

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState<string>('text'); 
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStandings() {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3000/api/v1/leaderboard');
        if (res.ok) {
          const json = await res.json();
          if (json.success) setLeaderboardData(json.data);
        }
      } catch (err) {
        console.error("Failed fetching live models matrix:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStandings();
  }, []);

  const filteredData = leaderboardData.filter((m: any) => m?.category?.toLowerCase() === activeCategory.toLowerCase());
  const textData = leaderboardData.filter((m: any) => m?.category?.toLowerCase() === 'text' || m?.category?.toLowerCase() === 'chat');
  const webDevData = leaderboardData.filter((m: any) => m?.category?.toLowerCase() === 'coding' || m?.category?.toLowerCase() === 'code');
  const visionData = leaderboardData.filter((m: any) => m?.category?.toLowerCase() === 'vision');
  const documentData = leaderboardData.filter((m: any) => m?.category?.toLowerCase() === 'document');
  const imageData = leaderboardData.filter((m: any) => m?.category?.toLowerCase() === 'image');
  const videoData = leaderboardData.filter((m: any) => m?.category?.toLowerCase() === 'video');
  const imageWebDevData = leaderboardData.filter((m: any) => m?.category?.toLowerCase() === 'image-to-webdev');
  const searchData = leaderboardData.filter((m: any) => m?.category?.toLowerCase() === 'search');
  const textToVideoData = leaderboardData.filter((m: any) => m?.category?.toLowerCase() === 'text-to-video');
  const imageToVideoData = leaderboardData.filter((m: any) => m?.category?.toLowerCase() === 'image-to-video');
  const videoEditData = leaderboardData.filter((m: any) => m?.category?.toLowerCase() === 'video-edit' || m?.category?.toLowerCase() === 'video-editing');

  const handleUpdateActiveCategory = (targetCategory: string) => {
    setActiveCategory(targetCategory);
  };

  const getExplorerActiveDataset = () => {
    switch(activeCategory.toLowerCase()) {
      case 'text': case 'chat': return textData.length > 0 ? textData : leaderboardData;
      case 'coding': case 'code': return webDevData.length > 0 ? webDevData : leaderboardData;
      case 'vision': return visionData.length > 0 ? visionData : leaderboardData;
      case 'document': return documentData.length > 0 ? documentData : leaderboardData;
      case 'image': return imageData.length > 0 ? imageData : leaderboardData;
      case 'video': return videoData.length > 0 ? videoData : leaderboardData;
      case 'image-to-webdev': return imageWebDevData.length > 0 ? imageWebDevData : leaderboardData;
      case 'search': return searchData.length > 0 ? searchData : leaderboardData;
      case 'text-to-video': return textToVideoData.length > 0 ? textToVideoData : leaderboardData;
      case 'image-to-video': return imageToVideoData.length > 0 ? imageToVideoData : leaderboardData;
      case 'video-edit': case 'video-editing': return videoEditData.length > 0 ? videoEditData : leaderboardData;
      default: return filteredData.length > 0 ? filteredData : leaderboardData;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F6] flex flex-col items-center overflow-visible">
      
      {/* 🎯 THE ABSOLUTE GLOBAL FIX: Top navigation bar placed directly at page viewport boundary level */}
      <div className="sticky top-0 z-50 w-full bg-[#FAF8F6] pt-4 pb-2 flex justify-center border-b border-gray-200/60 shadow-xs px-6 backdrop-blur-md">
        <div className="w-full max-w-7xl">
          <LeaderboardHeader 
            currentCategory={activeCategory} 
            onCategoryChange={handleUpdateActiveCategory}
            onlyNavbar={true} 
          />
        </div>
      </div>

      <div className="w-full max-w-7xl space-y-8 p-6 relative overflow-visible">
        
        {/* Render the remaining submenu parts (description grids, details) into the scrolling stream flow */}
        <LeaderboardHeader 
          currentCategory={activeCategory} 
          onCategoryChange={handleUpdateActiveCategory}
          onlyNavbar={false} 
        />
        
        {/* Main Overview Standings Matrix */}
        <LeaderboardTable 
          data={filteredData.length > 0 ? filteredData : leaderboardData} 
          loading={loading} 
          onViewAllClick={() => {}} 
        />

        {/* Row 1 Split Grid (Text & WebDev) */}
        <SplitLeaderboardGrid 
          textData={textData.length > 0 ? textData : leaderboardData}
          webDevData={webDevData.length > 0 ? webDevData : leaderboardData}
          loading={loading}
          onViewCategoryClick={handleUpdateActiveCategory}
        />

        {/* Row 2 Split Grid (Vision & Document) */}
        <VisionDocumentSplitGrid 
          visionData={visionData.length > 0 ? visionData : leaderboardData}
          documentData={documentData.length > 0 ? documentData : leaderboardData}
          loading={loading}
          onViewCategoryClick={handleUpdateActiveCategory}
        />

        {/* Row 3 Split Grid (Image & Video) */}
        <ImageVideoSplitGrid 
          imageData={imageData.length > 0 ? imageData : leaderboardData}
          videoData={videoData.length > 0 ? videoData : leaderboardData}
          loading={loading}
          onViewCategoryClick={handleUpdateActiveCategory}
        />

        {/* Row 4 Split Grid (Image-to-WebDev & Search) */}
        <ImageWebDevSearchSplitGrid 
          imageWebDevData={imageWebDevData.length > 0 ? imageWebDevData : leaderboardData}
          searchData={searchData.length > 0 ? searchData : leaderboardData}
          loading={loading}
          onViewCategoryClick={handleUpdateActiveCategory}
        />

        {/* Row 5 Split Grid (Text-to-Video & Image-to-Video) */}
        <VideoSplitGrid 
          textToVideoData={textToVideoData.length > 0 ? textToVideoData : leaderboardData}
          imageToVideoData={imageToVideoData.length > 0 ? imageToVideoData : leaderboardData}
          loading={loading}
          onViewCategoryClick={handleUpdateActiveCategory}
        />

        {/* Row 6 Half-Width Aligned Component (Video Edit) */}
        <div className="w-full flex flex-col md:flex-row gap-6 bg-transparent">
          <VideoEditLeaderboardGrid 
            videoEditData={videoEditData.length > 0 ? videoEditData : leaderboardData}
            loading={loading}
            onViewCategoryClick={handleUpdateActiveCategory}
          />
          <div className="hidden md:block flex-1" />
        </div>

        {/* Arena Overview Spreadsheet Module Frame */}
        <div className="pt-4 border-t border-gray-200">
          <ArenaViewExplorer 
            data={getExplorerActiveDataset()}
            categoryName={activeCategory}
            loading={loading}
            onBack={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </div>
        
      </div>
    </div>
  );
}

