import React from 'react';

interface FiltersProps {
  licenseFilter: string;
  setLicenseFilter: (filter: string) => void;
}

export const LeaderboardFilters: React.FC<FiltersProps> = ({ licenseFilter, setLicenseFilter }) => {
  return (
    <div className="flex items-center space-x-4 mb-5 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
      <div className="text-sm font-medium text-gray-400">Filter parameters:</div>
      <select
        value={licenseFilter}
        onChange={(e) => setLicenseFilter(e.target.value)}
        className="bg-[#FAF8F6] border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#E0533C] transition-colors cursor-pointer"
      >
        <option value="All">All Licenses</option>
        <option value="Open Source">Open Source</option>
        <option value="Proprietary">Proprietary</option>
      </select>
    </div>
  );
};