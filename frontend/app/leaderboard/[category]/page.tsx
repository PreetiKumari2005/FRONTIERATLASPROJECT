'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LeaderboardHeader } from '@/components/domain/leaderboard/LeaderboardHeader';
import { LeaderboardTable } from '@/components/domain/leaderboard/LeaderboardTable'; 
import { DetailedLeaderboardTable } from '@/components/domain/leaderboard/DetailedLeaderboardTable';

export default function DetailedCategoryPage() {
  const params = useParams();
  let nextRouter: any = null;
  
  // Safe hook initialization wrapper
  try {
    nextRouter = useRouter();
  } catch (e) {
    console.warn("useRouter hook failed to load, falling back to window navigation.");
  }
  
  const currentCategory = Array.isArray(params.category) 
    ? params.category[0] 
    : params.category || 'agent';

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailedMatrix, setShowDetailedMatrix] = useState(false);

  useEffect(() => {
    async function fetchStandings() {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3000/api/v1/leaderboard');
        
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        
        const json = await res.json();
        if (json.success) {
          setLeaderboardData(json.data);
        }
      } catch (err) {
        console.error("Failed fetching detailed standings matrix from API:", err);
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchStandings();
  }, []);

  useEffect(() => {
    setShowDetailedMatrix(false);
  }, [currentCategory]);

  const filteredData = leaderboardData.filter((model: any) => {
    if (!model || !model.category) return false;
    
    const baseModelCategory = model.category.includes('-') 
      ? model.category.split('-')[0] 
      : model.category;
      
    return baseModelCategory.toLowerCase() === currentCategory.toLowerCase();
  });

  // 🎯 Safe navigation function that handles both Next.js and standard browser fallback
  const navigateTo = (path: string) => {
    if (nextRouter) {
      nextRouter.push(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F6] p-6 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-4">
        
        {/* Top Navbar Menu Strip Row */}
        <LeaderboardHeader 
          currentCategory={currentCategory} 
          onCategoryChange={(newCat) => {
            const cleanPath = newCat.includes('-') ? newCat.split('-')[0] : newCat;
            // 🎯 FIXED: Changed from router.push to navigateTo
            navigateTo(`/leaderboard/${cleanPath.toLowerCase()}`);
          }} 
        />
        
        {/* Dynamic View Toggling Switch */}
        {showDetailedMatrix ? (
          <DetailedLeaderboardTable 
            data={filteredData.length > 0 ? filteredData : leaderboardData} 
            categoryName={currentCategory}
            loading={loading}
            onBack={() => setShowDetailedMatrix(false)}
          />
        ) : (
          <LeaderboardTable 
            data={filteredData.length > 0 ? filteredData : leaderboardData} 
            loading={loading}
            onViewAllClick={() => {
              setShowDetailedMatrix(true);
              // 🎯 FIXED: Changed from router.push to navigateTo
              navigateTo(`/leaderboard/agent`);
            }}
          />
        )}
        
      </div>
    </div>
  );
}

