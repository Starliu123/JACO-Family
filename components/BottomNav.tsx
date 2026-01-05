import React from 'react';
import { Home, Video, Compass, User, Plus } from 'lucide-react';

interface BottomNavProps {
  currentTab?: 'home' | 'profile' | 'discover';
  onTabChange?: (tab: 'home' | 'profile' | 'discover') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab = 'home', onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/95 border-t border-white/5 px-6 pb-6 pt-3 z-50 flex justify-between items-end">
      {/* Home */}
      <button 
        onClick={() => onTabChange?.('home')}
        className="flex flex-col items-center justify-center space-y-1 w-12 group"
      >
        <Home 
            className={`w-6 h-6 transition-transform ${currentTab === 'home' ? 'text-white scale-110' : 'text-gray-500 group-hover:text-gray-300'}`} 
            fill={currentTab === 'home' ? 'currentColor' : 'none'}
        />
        <span className={`text-[10px] font-medium ${currentTab === 'home' ? 'text-white' : 'text-gray-500'}`}>Home</span>
      </button>

      {/* Video - Dummy */}
      <button className="flex flex-col items-center justify-center space-y-1 w-12 group">
        <Video className="w-6 h-6 text-gray-500 group-hover:text-gray-300 transition-colors" />
        <span className="text-[10px] font-medium text-gray-500 group-hover:text-gray-300">Video</span>
      </button>

      {/* ADD Button */}
      <button className="flex flex-col items-center justify-center w-12">
        <div className="w-12 h-10 rounded-xl bg-[#A540FF] flex items-center justify-center shadow-lg hover:brightness-110 transition-all active:scale-95">
           <Plus className="w-6 h-6 text-white" strokeWidth={3} />
        </div>
      </button>

      {/* Discover */}
      <button 
        onClick={() => onTabChange?.('discover')}
        className="flex flex-col items-center justify-center space-y-1 w-12 group"
      >
        <Compass 
            className={`w-6 h-6 transition-colors ${currentTab === 'discover' ? 'text-white scale-110' : 'text-gray-500 group-hover:text-gray-300'}`} 
            fill={currentTab === 'discover' ? 'currentColor' : 'none'}
        />
        <span className={`text-[10px] font-medium ${currentTab === 'discover' ? 'text-white' : 'text-gray-500'}`}>Discover</span>
      </button>

      {/* Profile */}
      <button 
        onClick={() => onTabChange?.('profile')}
        className="flex flex-col items-center justify-center space-y-1 w-12 group"
      >
        <User 
            className={`w-6 h-6 transition-colors ${currentTab === 'profile' ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} 
            fill={currentTab === 'profile' ? 'currentColor' : 'none'}
        />
        <span className={`text-[10px] font-medium ${currentTab === 'profile' ? 'text-white' : 'text-gray-500'}`}>Profile</span>
      </button>
    </nav>
  );
};
