import React, { useState } from 'react';
import { Search, MessageSquareText, ChevronDown, Flame, Trophy, Gem, Video, Users, Crown } from 'lucide-react';
import { Stream } from '../types';

interface DiscoverViewProps {
  onLiveClick: (stream: Stream) => void;
  onFamilyClick?: () => void;
}

const CATEGORIES = ['All', 'Games', 'Music', 'Movie', 'Chat', 'Dance'];
const FAMILY_RANKING_CATEGORIES = ['Level', 'Duration', 'Received', 'Supported', 'PK Wins'];

const FEATURED_LIVES = [
    {
        id: 'd1',
        rank: 1,
        image: 'https://image.pollinations.ai/prompt/Cinematic%20soccer%20match%20stadium%20action%20shot%20dynamic%20lighting?width=400&height=500&seed=777&nologo=true',
        title: 'Soccer Reality',
        user: 'JohnNeo',
        viewCount: '12.3K',
        likeCount: '12.3K'
    },
    {
        id: 'd2',
        rank: 1,
        image: 'https://image.pollinations.ai/prompt/Esports%20tournament%20stage%20blue%20neon%20lights%20crowd?width=400&height=500&seed=888&nologo=true',
        title: 'Soccer Reality',
        user: 'JohnNeo',
        viewCount: '12.3K',
        likeCount: '12.3K'
    }
];

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
    { rank: 2, name: 'Ghost', gem: '****', avatar: 'https://image.pollinations.ai/prompt/Cool%20ghost%20mascot%20avatar%20hoodie?width=100&height=100&seed=2&nologo=true' },
    { rank: 3, name: 'Kristin Watson', gem: '1.5M', avatar: 'https://image.pollinations.ai/prompt/Portrait%20woman%20smiling%20professional?width=100&height=100&seed=3&nologo=true' },
    { rank: 4, name: 'Ralph Edwards', gem: '781.2K', avatar: 'https://image.pollinations.ai/prompt/Portrait%20man%20glasses%20handsome?width=100&height=100&seed=4&nologo=true' },
    { rank: 5, name: 'Jenny Wilson', gem: '681.2K', avatar: 'https://image.pollinations.ai/prompt/Portrait%20woman%20long%20hair?width=100&height=100&seed=5&nologo=true' },
    { rank: 6, name: 'Darlene Robertson', gem: '281.2K', avatar: 'https://image.pollinations.ai/prompt/Portrait%20woman%20blonde?width=100&height=100&seed=6&nologo=true' },
];

export const DiscoverView: React.FC<DiscoverViewProps> = ({ onLiveClick, onFamilyClick }) => {
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

                {/* Info Box - "Titanium Grey" Metallic Gradient */}
                <div className="bg-gradient-to-r from-[#2e2e36]/95 to-[#1a1a1d]/95 backdrop-blur-xl rounded-xl p-4 flex items-center justify-between border border-white/10 shadow-lg">
                    <div>
                        <h2 className="text-lg font-bold text-white leading-tight">Carnival Activity</h2>
                        <p className="text-xs text-gray-400 mt-1">Win the Jaco Era Prize</p>
                    </div>
                    <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors border border-white/10 shadow-sm">
                        View
                    </button>
                </div>
            </div>
        </div>

        {/* 3. Hourly Ranking & Featured Lives Module - "Deep Steel Blue" Gradient */}
        <div className="bg-gradient-to-br from-[#232530] via-[#1a1b23] to-[#101012] rounded-2xl border border-white/5 p-4 space-y-4 shadow-xl">
            {/* Module Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-bold text-white">Hourly Ranking</h3>
                    <p className="text-xs text-gray-400 mt-1">Explore the popular LIVEs in Jaco</p>
                </div>
                <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors border border-white/10 shadow-sm">
                    View
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {CATEGORIES.map((cat, idx) => (
                    <button 
                        key={cat} 
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                            idx === 0 
                                ? 'bg-white/10 text-white border border-white/10 shadow-sm' 
                                : 'bg-[#1e1e22] text-gray-500 border border-transparent hover:text-gray-300'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Featured Lives Grid */}
            <div className="grid grid-cols-2 gap-3">
                {FEATURED_LIVES.map((item, idx) => (
                    <div 
                        key={idx} 
                        className="relative rounded-xl overflow-hidden aspect-[3/4] group cursor-pointer bg-black/40 shadow-lg border border-white/5"
                        onClick={() => onLiveClick({
                            id: item.id,
                            thumbnail: item.image,
                            title: item.title,
                            user: { id: 'u'+idx, name: item.user, avatar: '', verified: true },
                            viewCount: item.viewCount,
                            likeCount: item.likeCount,
                            tags: []
                        })}
                    >
                        <img src={item.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.title} />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
                        
                        {/* Top Left Badge */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                            <div className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-md">
                                <Flame className="w-2.5 h-2.5 fill-black" /> 1
                            </div>
                            <div className="bg-black/40 backdrop-blur-sm p-1 rounded">
                                <img src="https://img.jacocdn.com/large/3b9ae203la1i8yo75jeqnj202f00k3yb.jpg" className="w-3 h-3 object-contain" alt="chest" />
                            </div>
                        </div>

                        {/* Mute Icon */}
                        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm p-1 rounded-full">
                            <Video className="w-3 h-3 text-white" />
                        </div>

                        {/* Bottom Info */}
                        <div className="absolute bottom-0 left-0 w-full p-2.5">
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-xs font-bold text-white truncate">{item.user}</span>
                                <div className="bg-[#A540FF] rounded-full p-[1px]">
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            </div>
                            <div className="text-[10px] text-gray-400 mb-1.5">{item.title}</div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 bg-white/5 w-fit px-1.5 py-0.5 rounded">
                                <span className="flex items-center gap-0.5">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                                    {item.likeCount}
                                </span>
                                <span className="flex items-center gap-0.5">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                    {item.viewCount}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 4. Family Ranking Module - "Deep Emerald Green" Gradient */}
        <div className="bg-gradient-to-br from-[#0c2e1e] via-[#081f14] to-[#04120a] rounded-2xl border border-white/5 p-4 space-y-4 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-bold text-white">Family Ranking</h3>
                    <p className="text-xs text-gray-400 mt-1">Top Communities</p>
                </div>
                 <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors border border-white/10 shadow-sm">
                    View
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {FAMILY_RANKING_CATEGORIES.map((cat) => (
                    <button 
                        key={cat} 
                        onClick={() => setActiveFamilyTab(cat)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                            activeFamilyTab === cat 
                                ? 'bg-white/10 text-white border border-white/10 shadow-sm' 
                                : 'bg-[#0f1f15] text-emerald-100/60 border border-transparent hover:text-emerald-100'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* List */}
             <div className="rounded-xl overflow-hidden bg-black/20 border border-white/5">
                {currentFamilyData.map((family, idx) => (
                    <div 
                        key={idx} 
                        className="flex items-center justify-between p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer group"
                        onClick={onFamilyClick}
                    >
                        <div className="flex items-center gap-3">
                             <span className={`text-sm font-bold w-4 text-center ${
                                family.rank === 1 ? 'text-yellow-500' : 
                                family.rank === 2 ? 'text-gray-300' : 
                                family.rank === 3 ? 'text-orange-400' : 'text-gray-500'
                            }`}>
                                {family.rank}
                            </span>
                            <div className="relative">
                                <img src={family.avatar} className="w-10 h-10 rounded-xl object-cover" alt={family.name} />
                                 {family.rank === 1 && (
                                    <div className="absolute -top-1.5 -right-1.5 bg-yellow-500 rounded-full p-0.5 border border-[#1a1a1d]">
                                        <Crown className="w-2 h-2 text-black fill-black" />
                                    </div>
                                )}
                            </div>
                            <div>
                                 <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{family.name}</div>
                                 <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                                    <Users className="w-3 h-3" /> {family.members} Members
                                 </div>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-[10px] text-gray-500 mb-0.5">{family.scoreLabel}</div>
                             <div className="text-sm font-bold text-emerald-400">{family.score}</div>
                        </div>
                    </div>
                ))}
             </div>
        </div>

        {/* 5. Top Streamers Module - "Dark Velvet Purple" Gradient */}
        <div className="bg-gradient-to-br from-[#2a2430] via-[#1f1a24] to-[#121014] rounded-2xl border border-white/5 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Top Streamers</h3>
                <Gem className="w-8 h-8 text-pink-500 opacity-80" />
            </div>

            <div className="rounded-xl overflow-hidden bg-black/20 border border-white/5">
                {TOP_STREAMERS.map((streamer, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <span className={`text-sm font-bold w-4 text-center ${
                                streamer.rank === 1 ? 'text-yellow-500' : 
                                streamer.rank === 2 ? 'text-gray-300' : 
                                streamer.rank === 3 ? 'text-orange-400' : 'text-gray-500'
                            }`}>
                                {streamer.rank}
                            </span>
                            <div className="relative">
                                <img src={streamer.avatar} className="w-10 h-10 rounded-full object-cover" alt={streamer.name} />
                                {streamer.rank === 1 && (
                                    <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 border border-[#1a1a1d]">
                                        <Trophy className="w-2 h-2 text-black fill-black" />
                                    </div>
                                )}
                            </div>
                            <span className="text-sm font-bold text-white">{streamer.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                            <Gem className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                            <span className="text-xs font-medium text-gray-300">{streamer.gem}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};