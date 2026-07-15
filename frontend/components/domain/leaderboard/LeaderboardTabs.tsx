import React from 'react';

type LeaderboardCategory = 'text' | 'coding' | 'vision' | 'agent';

interface TabsProps {
  activeTab: LeaderboardCategory;
  setActiveTab: (tab: LeaderboardCategory) => void;
}

export const LeaderboardTabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: LeaderboardCategory; label: string }[] = [
    { id: 'text', label: '🏆 Text Arena' },
    { id: 'coding', label: '💻 Coding' },
    { id: 'vision', label: '👁️ Vision' },
    { id: 'agent', label: '🤖 Agent' }
  ];

  return (
    <div className="flex space-x-2 border-b border-gray-200/80 pb-3 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-[#E0533C]/10 text-[#E0533C] border border-[#E0533C]/20 shadow-sm'
              : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};