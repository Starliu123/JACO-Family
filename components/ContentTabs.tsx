import React from 'react';
import { TabType } from '../types';

interface ContentTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS: TabType[] = ['Following', 'For You', 'Entertainment', 'Game', 'Sport', 'Audio'];

export const ContentTabs: React.FC<ContentTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    // Removed bg-black/80 to allow the new gradient background to be visible
    // Added a subtle gradient mask or very low opacity black if needed for text readability, 
    // but for now, transparency looks best with the new design.
    <div className="sticky top-0 z-40 w-full transition-all duration-300">
      <div className="flex items-center w-full px-4 overflow-x-auto no-scrollbar space-x-6 py-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`relative flex-shrink-0 text-[17px] font-medium transition-colors duration-200 pb-2 ${
              activeTab === tab ? 'text-white' : 'text-white/60 hover:text-white/90'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-[3px] bg-white rounded-full"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};