import React, { useState } from 'react';
import { Search, MessageSquareText, ChevronDown, Flame, Trophy, Users, Crown, ChevronRight } from 'lucide-react';
import { Stream } from '../types';

interface DiscoverViewProps {
  onLiveClick: (stream: Stream) => void;
  onFamilyClick?: () => void;
  onRankingsClick?: () => void;
}

// Mock Data for Top 6 Tribes
const TRIBE_NAMES = ["Royal Lions", "Golden Eagles", "Mystic Rose", "Thunder Squad", "Desert Storm", "Cyber Punks"];
const AVATARS = [
    'https://image.pollinations.ai/prompt/Esports%20team%20logo%20shield%20purple%20lion?width=100&height=100&seed=45&nologo=true',
    'https://image.pollinations.ai/prompt/Golden%20eagle%20logo?width=100&height=100&seed=46&nologo=true',
    'https://image.pollinations.ai/prompt/Mystic%20rose%20logo?width=100&height=100&seed=47&nologo=true',
    'https://image.pollinations.ai/prompt/Thunder%20squad%20logo?width=100&height=100&seed=48&nologo=true',
    'https://image.pollinations.ai/prompt/Desert%20storm%20logo?width=100&height=100&seed=49&nologo=true',
    'https://image.pollinations.ai/prompt/Cyber%20punk%20logo?width=100&height=100&seed=50&nologo=true'
];

const RANKING_DATA: Record<string, any[]> = {
    'Level': TRIBE_NAMES.map((name, i) => ({
        rank: i + 1, name, avatar: AVATARS[i], members: 150 - i * 10,
        score: `Lv.${14 - i}`, scoreLabel: 'Level'
    })),
    'Duration': TRIBE_NAMES.map((name, i) => ({
        rank: i + 1, name, avatar: AVATARS[i], members: 150 - i * 10,
        score: `${(300 - i * 40)}h`, scoreLabel: 'Duration'
    })),
    'Received': TRIBE_NAMES.map((name, i) => ({
        rank: i + 1, name, avatar: AVATARS[i], members: 150 - i * 10,
        score: `${(5.5 - i * 0.8).toFixed(1)}M`, scoreLabel: 'Received'
    })),
    'Supported': TRIBE_NAMES.map((name, i) => ({
        rank: i + 1, name, avatar: AVATARS[i], members: 150 - i * 10,
        score: `${(8.2 - i * 1.2).toFixed(1)}M`, scoreLabel: 'Supported'
    })),
    'PK Wins': TRIBE_NAMES.map((name, i) => ({
        rank: i + 1, name, avatar: AVATARS[i], members: 150 - i * 10,
        score: `${100 - i * 15}`, scoreLabel: 'Wins'
    })),
};

export const DiscoverView: React.FC<DiscoverViewProps> = ({ onLiveClick, onFamilyClick, onRankingsClick }) => {
  const [activeFamilyTab, setActiveFamilyTab] = useState('Level');
  const currentFamilyData = RANKING_DATA[activeFamilyTab];

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white pb-24">
      
      {/* 1. Header */}
      <div className="sticky top-0 z-50 bg-[#0f0f11]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Discover</h1>
            {/* Country Selector */}
            <button className="flex items-center gap-1 bg-[#1a1a1d] hover:bg-[#252529] px-2 py-1 rounded-full border border-white/10 transition-colors">
                <img 
                    src="https://flagcdn.com/w40/sa.png" 
                    alt="SA" 
                    className="w-5 h-3.5 object-cover rounded-[2px]" 
                />
                <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
        </div>
        <div className="flex items-center gap-4">
            <Search className="w-6 h-6 text-white" />
            <MessageSquareText className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        {/* 2. Banner / Carousel */}
        <div className="relative w-full aspect-[4/3.5] rounded-2xl overflow-hidden group shadow-2xl border border-white/5">
            <img 
                src="https://image.pollinations.ai/prompt/3d%20golden%20trophy%20carnival%20stage%20luxury%20city%20background%20night?width=800&height=700&seed=99&nologo=true"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Carnival"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1d] via-transparent to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-5">
                {/* Pagination Dots */}
                <div className="flex justify-center gap-1.5 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                    <div>
                        <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Flame className="w-3 h-3" /> Hot Event
                        </div>
                        <h2 className="text-lg font-bold text-white leading-tight">Carnival Gala Night</h2>
                        <p className="text-[10px] text-gray-400 mt-1">Join the biggest party of the year!</p>
                    </div>
                    <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors">
                        Join
                    </button>
                </div>
            </div>
        </div>

        {/* 3. Tribe Rankings Module - Wrapped in Green Gradient Card */}
        <div className="bg-gradient-to-b from-[#022c22] to-[#064e3b] rounded-3xl p-5 border border-[#10b981]/20 shadow-xl relative overflow-hidden">
            
            {/* Background Texture Effect */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Tribe Ranking
                    </h3>
                    <p className="text-[10px] text-emerald-200/60 font-medium">Top Communities</p>
                </div>
                <button 
                    onClick={onRankingsClick}
                    className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border border-white/10 text-white"
                >
                    View
                </button>
            </div>

            {/* Tabs - Integrated style */}
            <div className="flex items-center justify-between bg-black/20 p-1 rounded-xl mb-4 relative z-10 overflow-x-auto no-scrollbar">
                {['Level', 'Duration', 'Received', 'Supported'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveFamilyTab(cat)}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                            activeFamilyTab === cat 
                            ? 'bg-[#10b981] text-white shadow-md' 
                            : 'text-emerald-100/60 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* List - Simple Rows */}
            <div className="space-y-1 relative z-10">
                {currentFamilyData.slice(0, 6).map((tribe, index) => (
                    <div 
                        key={tribe.rank} 
                        onClick={onFamilyClick}
                        className="flex items-center py-3 border-b border-white/5 last:border-0 active:opacity-70 transition-opacity cursor-pointer"
                    >
                        {/* Rank */}
                        <div className={`w-6 font-bold text-center text-sm ${
                            tribe.rank === 1 ? 'text-[#fbbf24]' : 
                            tribe.rank === 2 ? 'text-gray-300' :
                            tribe.rank === 3 ? 'text-orange-400' :
                            'text-emerald-100/60'
                        }`}>
                            {tribe.rank}
                        </div>

                        {/* Avatar */}
                        <div className="relative mx-3">
                            <img src={tribe.avatar} className="w-10 h-10 rounded-xl object-cover bg-black/20" alt={tribe.name} />
                            {tribe.rank === 1 && (
                                <div className="absolute -top-1.5 -right-1.5 bg-[#fbbf24] rounded-full p-0.5 border border-[#022c22]">
                                    <Crown className="w-2.5 h-2.5 text-black fill-black" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-white truncate">{tribe.name}</div>
                            <div className="text-[10px] text-emerald-100/50 flex items-center gap-1 font-medium">
                                <Users className="w-3 h-3" /> {tribe.members} Members
                            </div>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                            <div className="text-[9px] text-emerald-100/40 font-medium uppercase tracking-wide mb-0.5">{tribe.scoreLabel}</div>
                            <div className={`text-sm font-bold ${
                                activeFamilyTab === 'Level' ? 'text-[#34d399]' : 
                                'text-white'
                            }`}>
                                {tribe.score}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};
