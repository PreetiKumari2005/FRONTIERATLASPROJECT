'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LeaderboardHeader } from '@/components/domain/leaderboard/LeaderboardHeader';
import { DetailedLeaderboardTable } from '@/components/domain/leaderboard/DetailedLeaderboardTable';

export default function DetailedCategoryPage() {
  const params = useParams();
  const router = useRouter();
  
  // Safely extract parameter string from path slug
  const currentCategory = Array.isArray(params.category) 
    ? params.category[0] 
    : params.category || 'agent';

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStandings() {
      try {
        setLoading(true);
        // Hits your registered Hono API backend router group
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

  // Filter client-side data dynamically based on active parameter route mapping
  const filteredData = leaderboardData.filter((model: any) => {
    if (!model || !model.category) return false;
    
    // Normalizes subcategory flags (maps things like 'agent-all' to match the root 'agent' route)
    const baseModelCategory = model.category.includes('-') 
      ? model.category.split('-')[0] 
      : model.category;
      
    return baseModelCategory.toLowerCase() === currentCategory.toLowerCase();
  });

  return (
    <div className="w-full min-h-screen bg-[#FAF8F6] p-6 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-4">
        
        {/* Top Navbar Menu Row */}
        <LeaderboardHeader 
          currentCategory={currentCategory} 
          onCategoryChange={(newCat) => {
            // Clicking alternate primary tabs gracefully redirects the URL slug context
            const cleanPath = newCat.includes('-') ? newCat.split('-')[0] : newCat;
            router.push(`/leaderboard/${cleanPath.toLowerCase()}`);
          }} 
        />
        
        {/* Advanced Interactive Multi-Metric Performance Table */}
        <DetailedLeaderboardTable 
          data={filteredData.length > 0 ? filteredData : leaderboardData} 
          categoryName={currentCategory}
          loading={loading}
          onBack={() => router.push('/leaderboard')} // Returns cleanly to primary preview board dashboard
        />
        
      </div>
    </div>
  );
}