import React, { useState } from 'react';
import { Search, MessageSquareText, ChevronDown, Flame, Trophy, Gem, Video, Users, Crown, ChevronRight } from 'lucide-react';
import { Stream } from '../types';

interface DiscoverViewProps {
  onLiveClick: (stream: Stream) => void;
  onFamilyClick?: () => void;
  onRankingsClick?: () => void;
}

const CATEGORIES = ['All', 'Games', 'Music', 'Movie', 'Chat', 'Dance'];

// Mock Data for Top 6 Families in various categories
const FAMILY_NAMES = ["Royal Lions", "Golden Eagles", "Mystic Rose", "Thunder Squad", "Desert Storm", "Cyber Punks"];
const AVATARS = [
    'https://image.pollinations.ai/prompt/Esports%20team%20logo%20shield%20purple%20lion?width=100&height=100&seed=45&nologo=true',
    'https://image.pollinations.ai/prompt/Golden%20eagle%20logo?width=100&height=100&seed=46&nologo=true',
    'https://image.pollinations.ai/prompt/Mystic%20rose%20logo?width=100&height=100&seed=47&nologo=true',
    'https://image.pollinations.ai/prompt/Thunder%20squad%20logo?width=100&height=100&seed=48&nologo=true',
    'https://image.pollinations.ai/prompt/Desert%20storm%20logo?width=100&height=100&seed=49&nologo=true',
    'https://image.pollinations.ai/prompt/Cyber%20punk%20logo?width=100&height=100&seed=50&nologo=true'
];

const RANKING_DATA: Record<string, any[]> = {
    'Level': FAMILY_NAMES.map((name, i) => ({
        rank: i + 1, name, avatar: AVATARS[i], members: 150 - i * 10,
        score: `Lv.${14 - i}`, scoreLabel: 'Level'
    })),
    'Duration': FAMILY_NAMES.map((name, i) => ({
        rank: i + 1, name, avatar: AVATARS[i], members: 150 - i * 10,
        score: `${(300 - i * 40)}h`, scoreLabel: 'Hours'
    })),
    'Received': FAMILY_NAMES.map((name, i) => ({
        rank: i + 1, name, avatar: AVATARS[i], members: 150 - i * 10,
        score: `${(5.5 - i * 0.8).toFixed(1)}M`, scoreLabel: 'Diamonds'
    })),
    'Supported': FAMILY_NAMES.map((name, i) => ({
        rank: i + 1, name, avatar: AVATARS[i], members: 150 - i * 10,
        score: `${(8.2 - i * 1.2).toFixed(1)}M`, scoreLabel: 'Coins'
    })),
    'PK Wins': FAMILY_NAMES.map((name, i) => ({
        rank: i + 1, name, avatar: AVATARS[i], members: 150 - i * 10,
        score: `${100 - i * 15} Wins`, scoreLabel: 'Wins'
    })),
};

const TOP_STREAMERS = [
    { rank: 1, name: 'Ghost', gem: '****', avatar: 'https://image.pollinations.ai/prompt/Cool%20ghost%20mascot%20avatar%20green%20hoodie?width=100&height=100&seed=1&nologo=true' },
    { rank: 2, name: 'Ahmed', gem: '****', avatar: 'https://image.pollinations.ai/prompt/Cool%20ghost%20mascot%20avatar%20hoodie?width=100&height=100&seed=2&nologo=true' },
    { rank: 3, name: 'Kristin', gem: '1.5M', avatar: 'https://image.pollinations.ai/prompt/Portrait%20woman%20smiling%20professional?width=100&height=100&seed=3&nologo=true' },
    { rank: 4, name: 'Ralph', gem: '781.2K', avatar: 'https://image.pollinations.ai/prompt/Portrait%20man%20glasses%20handsome?width=100&height=100&seed=4&nologo=true' },
    { rank: 5, name: 'Jenny', gem: '681.2K', avatar: 'https://image.pollinations.ai/prompt/Portrait%20woman%20long%20hair?width=100&height=100&seed=5&nologo=true' },
    { rank: 6, name: 'Darlene', gem: '281.2K', avatar: 'https://image.pollinations.ai/prompt/Portrait%20woman%20blonde?width=100&height=100&seed=6&nologo=true' },
];

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

        {/* 3. Top Streamers (Horizontal Scroll) */}
        <div>
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Top Streamers
                </h3>
                <span className="text-xs text-gray-500">View All</span>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {TOP_STREAMERS.map((streamer) => (
                    <div key={streamer.rank} className="flex flex-col items-center min-w-[70px]">
                        <div className="relative">
                            <img 
                                src={streamer.avatar} 
                                className={`w-14 h-14 rounded-full object-cover border-2 ${streamer.rank <= 3 ? 'border-yellow-500' : 'border-white/10'}`} 
                                alt={streamer.name} 
                            />
                            <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold border border-[#0f0f11] ${
                                streamer.rank === 1 ? 'bg-yellow-500 text-black' :
                                streamer.rank === 2 ? 'bg-gray-300 text-black' :
                                streamer.rank === 3 ? 'bg-orange-600 text-white' :
                                'bg-gray-700 text-gray-400'
                            }`}>
                                {streamer.rank}
                            </div>
                        </div>
                        <div className="text-[10px] font-bold text-white mt-2 truncate w-full text-center">{streamer.name}</div>
                        <div className="text-[9px] text-[#A540FF] font-medium">{streamer.gem}</div>
                    </div>
                ))}
            </div>
        </div>

        {/* 4. Tribe Rankings */}
        <div>
            <div 
                className="flex items-center justify-between mb-3 px-1 cursor-pointer"
                onClick={onRankingsClick}
            >
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#A540FF]" />
                    Tribe Ranking
                </h3>
                <ChevronRight className="w-4 h-4 text-gray-500" />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-4">
                {['Level', 'Received', 'Supported', 'PK Wins'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveFamilyTab(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                            activeFamilyTab === cat 
                            ? 'bg-[#A540FF]/20 border-[#A540FF] text-[#A540FF]' 
                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-2">
                {currentFamilyData.slice(0, 5).map((family) => (
                    <div 
                        key={family.rank} 
                        onClick={onFamilyClick}
                        className="flex items-center p-3 bg-[#1a1a1d] rounded-xl border border-white/5 active:scale-[0.99] transition-transform cursor-pointer"
                    >
                        <div className={`w-6 font-bold text-center text-sm ${
                            family.rank === 1 ? 'text-yellow-500' :
                            family.rank === 2 ? 'text-gray-300' :
                            family.rank === 3 ? 'text-orange-500' : 'text-gray-600'
                        }`}>
                            {family.rank}
                        </div>
                        <img src={family.avatar} className="w-10 h-10 rounded-lg object-cover mx-3" alt={family.name} />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-white truncate">{family.name}</div>
                            <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                <Users className="w-3 h-3" /> {family.members} Members
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-[#A540FF]">{family.score}</div>
                            <div className="text-[9px] text-gray-500">{family.scoreLabel}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};
