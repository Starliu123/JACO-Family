import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Users, Shield, Trophy, Star, Crown, Share2, CircleHelp, Coins, FilePenLine, UserPlus, Medal, ChevronDown,
  Home, ClipboardCheck, BarChart3, Calendar, Settings, Gift, Clock, PlayCircle, CheckCircle2, Zap, Check, X, Gem, Video, MoreHorizontal, Swords, Flame, HeartHandshake, Mic2, Sparkles, Gamepad2, ChevronRight, History, TrendingUp, MessageCircle, FileText, Send
} from 'lucide-react';

interface FamilyGuestViewProps {
  onBack: () => void;
}

type FilterType = 'Total' | 'Month' | 'Week';
// Guest tabs: No 'tasks' or 'manage'
export type FamilyTabType = 'home' | 'rankings' | 'events';
type RankingCategory = 'Level' | 'Duration' | 'Received' | 'Supported' | 'PK Wins';
type TimeFilter = 'Daily' | 'Weekly' | 'Monthly';
type ApplyStatus = 'idle' | 'pending';

interface RankingItem {
    rank: number;
    id: number;
    name: string;
    avatar: string;
    value: string;
    level: number;
    members: number;
    subValue?: string; // e.g. "Lv. 50"
    trend?: 'up' | 'down' | 'same';
}

// Role definitions for styling
const ROLE_STYLES: Record<string, string> = {
  'Family Chief': 'bg-gradient-to-r from-yellow-600 to-amber-500 text-white border-none',
  'Admin': 'bg-purple-500/20 text-purple-400 border border-purple-500/20',
  'Streamer': 'bg-pink-500/20 text-pink-400 border border-pink-500/20',
  'Supporter': 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
  'Speaker': 'bg-green-500/20 text-green-400 border border-green-500/20',
  'Member': 'bg-gray-700/50 text-gray-400 border border-white/5',
};

// Event Data - Optimized Images & Colors
const FAMILY_EVENTS = [
    {
        id: 1,
        title: "Carnival Activity",
        subtitle: "Win the Jaco Era Prize",
        image: "https://image.pollinations.ai/prompt/Cyberpunk%20neon%20carnival%20night%20purple%20blue%20lights%20ferris%20wheel?width=800&height=600&seed=201&nologo=true",
        tag: "Official",
        tagColor: "from-blue-600 to-indigo-600",
        cardBg: "from-[#17153B] to-[#0f0f11]" // Deep Indigo/Purple
    },
    {
        id: 2,
        title: "Family PK Championship",
        subtitle: "Battle for the Golden Shield 🛡️",
        image: "https://image.pollinations.ai/prompt/Esports%20arena%20stage%20red%20and%20orange%20lighting%20versus%20screen?width=800&height=600&seed=202&nologo=true",
        tag: "Hot",
        tagColor: "from-red-600 to-orange-600",
        cardBg: "from-[#450a0a] to-[#1a0505]" // Deep Red
    },
    {
        id: 3,
        title: "Voice of the Family",
        subtitle: "Sing & Win 50k Diamonds 💎",
        image: "https://image.pollinations.ai/prompt/Concert%20stage%20spotlight%20microphone%20pink%20purple%20atmosphere?width=800&height=600&seed=203&nologo=true",
        tag: "Big Reward",
        tagColor: "from-pink-600 to-rose-500",
        cardBg: "from-[#500724] to-[#1f020d]" // Deep Pink
    },
];

// Creative Family Names List
const FAMILY_NAMES = [
    "Royal Lions", "Golden Eagles", "Shadow Hunters", "Mystic Rose",
    "Thunder Squad", "Desert Storm", "Cyber Punks", "Noble Knights",
    "Savage Kings", "Elite Warriors", "Phoenix Rising", "Ice Dragons",
    "Solar Flares", "Velvet Touch", "Diamond Hands", "Ocean Waves",
    "Night Stalkers", "Crimson Tide", "Silver Wolves", "Iron Titans"
];

// Mock Data for Rankings
const MOCK_RANKINGS: Record<RankingCategory, RankingItem[]> = {
    'Level': Array.from({ length: 20 }, (_, i) => ({
        rank: i + 1,
        id: i,
        name: FAMILY_NAMES[i % FAMILY_NAMES.length],
        avatar: `https://api.dicebear.com/9.x/glass/svg?seed=level_${i}`,
        value: `Lv. ${50 - i}`,
        level: 50 - i,
        members: Math.floor(Math.random() * 150) + 50,
        trend: 'same'
    })),
    'Duration': Array.from({ length: 20 }, (_, i) => ({
        rank: i + 1,
        id: i + 20,
        name: FAMILY_NAMES[(i + 5) % FAMILY_NAMES.length],
        avatar: `https://api.dicebear.com/9.x/glass/svg?seed=duration_${i}`,
        value: `${(10000 - i * 400).toLocaleString()} Hrs`,
        level: Math.floor(Math.random() * 30) + 10,
        members: Math.floor(Math.random() * 150) + 50,
        trend: i % 2 === 0 ? 'up' : 'down'
    })),
    'Received': Array.from({ length: 20 }, (_, i) => ({
        rank: i + 1,
        id: i + 40,
        name: FAMILY_NAMES[(i + 10) % FAMILY_NAMES.length],
        avatar: `https://api.dicebear.com/9.x/glass/svg?seed=received_${i}`,
        value: `${(500 - i * 15).toFixed(1)}M`,
        level: Math.floor(Math.random() * 30) + 10,
        members: Math.floor(Math.random() * 150) + 50,
        trend: 'up'
    })),
    'Supported': Array.from({ length: 20 }, (_, i) => ({
        rank: i + 1,
        id: i + 80,
        name: FAMILY_NAMES[(i + 15) % FAMILY_NAMES.length],
        avatar: `https://api.dicebear.com/9.x/glass/svg?seed=supported_${i}`,
        value: `${(800 - i * 20).toFixed(1)}M`,
        level: Math.floor(Math.random() * 30) + 10,
        members: Math.floor(Math.random() * 150) + 50,
        trend: 'up'
    })),
    'PK Wins': Array.from({ length: 20 }, (_, i) => ({
        rank: i + 1,
        id: i + 60,
        name: FAMILY_NAMES[(i + 3) % FAMILY_NAMES.length],
        avatar: `https://api.dicebear.com/9.x/glass/svg?seed=pk_${i}`,
        value: `${(2000 - i * 80)} Wins`,
        level: Math.floor(Math.random() * 30) + 10,
        members: Math.floor(Math.random() * 150) + 50,
        trend: 'same'
    }))
};

// --- Sub-Component: Family Benefits Page (FAQ) ---
const FamilyBenefitsPage = ({ onBack }: { onBack: () => void }) => {
    const benefits = [
        {
            icon: Shield,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            title: "Exclusive Identity",
            desc: "Show off your family identity with a unique badge next to your name in all chat rooms."
        },
        {
            icon: Gift,
            color: "text-pink-500",
            bg: "bg-pink-500/10",
            title: "Daily Rewards",
            desc: "Complete simple family tasks to earn coins, gems, and experience points every day."
        },
        {
            icon: MessageCircle,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            title: "Private Community",
            desc: "Access exclusive group chats and voice rooms to hang out with friends and streamers."
        },
        {
            icon: Swords,
            color: "text-red-500",
            bg: "bg-red-500/10",
            title: "Family Battles",
            desc: "Participate in family PK tournaments and win massive prizes and honor together."
        }
    ];

    return (
        <div className="absolute inset-0 z-[60] bg-[#0f0f11] animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 left-0 w-full z-50 py-4 flex items-center justify-between bg-[#0f0f11]/95 backdrop-blur-md px-4 border-b border-white/5">
                <button 
                    onClick={onBack} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition active:scale-95 flex-shrink-0"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white">
                    Family Privileges
                </div>
                <div className="w-10"></div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto">
                {/* Visual Header */}
                <div className="mb-8 text-center">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-b from-[#A540FF]/20 to-transparent rounded-full flex items-center justify-center mb-4">
                         <img 
                            src="https://image.pollinations.ai/prompt/3d%20treasure%20chest%20gold%20coins%20gems%20purple%20background?width=300&height=300&seed=101&nologo=true"
                            className="w-28 h-28 object-contain drop-shadow-2xl"
                            alt="Rewards"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-white leading-tight">Unlock Premium Features</h2>
                    <p className="text-sm text-gray-400 mt-2 px-2 leading-relaxed">Join a family to elevate your streaming experience and connect with like-minded people.</p>
                </div>

                {/* Benefits List */}
                <div className="space-y-4 pb-10">
                    {benefits.map((benefit, idx) => (
                        <div key={idx} className="bg-[#1a1a1d] p-4 rounded-2xl flex items-start gap-4 border border-white/5 hover:bg-[#202024] transition-colors">
                            <div className={`w-12 h-12 rounded-full ${benefit.bg} flex items-center justify-center flex-shrink-0`}>
                                <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-base mb-1">{benefit.title}</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">{benefit.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Sub-Component: Application Form ---
const ApplyFamilyPage = ({ onBack, onSubmit }: { onBack: () => void, onSubmit: () => void }) => {
    const [reason, setReason] = useState("");
    const maxLength = 1000;

    return (
        <div className="absolute inset-0 z-[60] bg-[#0f0f11] animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 left-0 w-full z-50 py-4 flex items-center justify-between bg-[#0f0f11]/95 backdrop-blur-md px-4 border-b border-white/5">
                <button 
                    onClick={onBack} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition active:scale-95 flex-shrink-0"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white">
                    Apply to Join
                </div>
                <div className="w-10"></div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                    <img 
                        src="https://image.pollinations.ai/prompt/Esports%20team%20logo%20shield%20purple%20lion?width=100&height=100&seed=45&nologo=true"
                        className="w-14 h-14 rounded-xl border border-white/10"
                        alt="Family"
                    />
                    <div>
                        <div className="text-white font-bold text-lg">Royal Lions</div>
                        <div className="text-gray-400 text-xs mt-0.5">ID: 882931 • Lv.14</div>
                    </div>
                </div>

                <div className="bg-[#1a1a1d] rounded-2xl p-4 border border-white/5 relative focus-within:border-[#A540FF]/50 transition-colors">
                    <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-3 block flex items-center gap-2">
                        <FileText className="w-3 h-3" /> Application Reason
                    </label>
                    <textarea 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        maxLength={maxLength}
                        placeholder="Please explain why you want to join this family..."
                        className="w-full bg-transparent text-white text-sm font-medium placeholder-gray-600 outline-none resize-none h-48 leading-relaxed"
                    />
                    
                    {/* Character Count */}
                    <div className="flex justify-end items-center mt-2 border-t border-white/5 pt-3">
                         <div className={`text-xs font-mono ${reason.length >= maxLength ? 'text-red-500' : 'text-gray-500'}`}>
                            {reason.length} / {maxLength}
                         </div>
                    </div>
                </div>

                <div className="mt-4 px-2">
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                        * The family administrator will review your application. Please be patient.
                    </p>
                </div>
            </div>

            {/* Footer Button */}
            <div className="p-6 pb-10 bg-[#0f0f11] border-t border-white/5">
                <button 
                    onClick={onSubmit}
                    disabled={reason.length === 0}
                    className="w-full bg-gradient-to-r from-[#A540FF] to-purple-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                    <Send className="w-4 h-4" />
                    Submit Application
                </button>
            </div>
        </div>
    );
};

export const FamilyGuestView: React.FC<FamilyGuestViewProps> = ({ onBack }) => {
  const FAMILY_AVATAR = "https://image.pollinations.ai/prompt/Esports%20team%20logo%20shield%20purple%20lion?width=100&height=100&seed=45&nologo=true";
  const HEADER_BG = "https://img.jacocdn.com/large/3b9ae203la1i8yryvrmrxj20rs0rpnpd.jpg";

  const [activeTab, setActiveTab] = useState<FamilyTabType>('home');
  const [filter, setFilter] = useState<FilterType>('Total');
  const [visibleCount, setVisibleCount] = useState(20);
  
  // Application State
  const [isApplying, setIsApplying] = useState(false);
  const [applyStatus, setApplyStatus] = useState<ApplyStatus>('idle');
  const [showToast, setShowToast] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false); // New state for FAQ
  
  // Rankings State
  const [rankingCategory, setRankingCategory] = useState<RankingCategory>('Level');
  const [rankingTimeFilter, setRankingTimeFilter] = useState<TimeFilter>('Daily');
  // Timer State for Refresh
  const [timeLeft, setTimeLeft] = useState(19 * 3600 + 29 * 60 + 32); // Initial seconds

  useEffect(() => {
    // Only run timer if not in Level tab
    if (activeTab === 'rankings' && rankingCategory !== 'Level') {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 86400));
        }, 1000);
        return () => clearInterval(timer);
    }
  }, [activeTab, rankingCategory]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };
  
  const handleApplySubmit = () => {
      // 1. Close sub-page
      setIsApplying(false);
      // 2. Change status
      setApplyStatus('pending');
      // 3. Show Toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
  };

  // Generate extended mock data
  const allMembers = useMemo(() => {
    const roles = ['Member', 'Streamer', 'Supporter', 'Speaker', 'Admin'];
    const baseMembers = [
      { id: 1, name: "Ahmed_Live", role: "Family Chief", contributionTotal: "1.2M", contributionMonth: "300K", contributionWeek: "50K", avatar: "https://image.pollinations.ai/prompt/Handsome%20Saudi%20Arab%20man%20streamer%20wearing%20red%20shemagh%20headset%20talking%20microphone%20professional%20gaming%20studio%20purple%20lighting?width=800&height=1000&seed=88&nologo=true" },
      { id: 2, name: "Desert_King", role: "Admin", contributionTotal: "850K", contributionMonth: "210K", contributionWeek: "45K", avatar: "https://image.pollinations.ai/prompt/Arab%20man%20sunglasses%20cool?width=100&height=100&seed=12&nologo=true" },
      { id: 3, name: "Sarah_Gamer", role: "Admin", contributionTotal: "720K", contributionMonth: "180K", contributionWeek: "40K", avatar: "https://image.pollinations.ai/prompt/Arab%20woman%20gamer%20headset?width=100&height=100&seed=33&nologo=true" },
      { id: 4, name: "Falcon_Eye", role: "Streamer", contributionTotal: "450K", contributionMonth: "120K", contributionWeek: "30K", avatar: "https://image.pollinations.ai/prompt/Falcon%20portrait?width=100&height=100&seed=44&nologo=true" },
      { id: 5, name: "Riyadh_Drift", role: "Supporter", contributionTotal: "300K", contributionMonth: "90K", contributionWeek: "25K", avatar: "https://image.pollinations.ai/prompt/Race%20car%20driver?width=100&height=100&seed=55&nologo=true" },
      { id: 6, name: "Coffee_Lover", role: "Speaker", contributionTotal: "280K", contributionMonth: "85K", contributionWeek: "20K", avatar: "https://image.pollinations.ai/prompt/Arab%20coffee%20dallah?width=100&height=100&seed=66&nologo=true" },
      { id: 7, name: "Night_Owl", role: "Member", contributionTotal: "150K", contributionMonth: "50K", contributionWeek: "10K", avatar: "https://image.pollinations.ai/prompt/Owl%20neon?width=100&height=100&seed=77&nologo=true" },
    ];

    // Generate remaining members to reach 60
    const generated = Array.from({ length: 53 }).map((_, i) => {
      const id = i + 8;
      const role = roles[Math.floor(Math.random() * roles.length)];
      const total = Math.floor(Math.random() * 100) + 10;
      return {
        id,
        name: `User_${id}`,
        role,
        contributionTotal: `${total}K`,
        contributionMonth: `${(total * 0.3).toFixed(1)}K`,
        contributionWeek: `${(total * 0.05).toFixed(1)}K`,
        avatar: `https://image.pollinations.ai/prompt/Arab%20avatar%20portrait%20illustration?width=100&height=100&seed=${id + 200}&nologo=true`
      };
    });

    return [...baseMembers, ...generated];
  }, []);

  const displayMembers = useMemo(() => {
    return allMembers.slice(0, visibleCount);
  }, [allMembers, visibleCount, filter]);

  const getContributionDisplay = (member: any) => {
    switch (filter) {
      case 'Month': return member.contributionMonth;
      case 'Week': return member.contributionWeek;
      default: return member.contributionTotal;
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 20, allMembers.length));
  };

  const heroes = [
    { 
        id: 1, 
        name: allMembers[0].name, 
        title: "Top Streamer", 
        avatar: allMembers[0].avatar, 
    },
    { 
        id: 2, 
        name: allMembers[1].name, 
        title: "Best Support", 
        avatar: allMembers[1].avatar, 
    },
    { 
        id: 3, 
        name: allMembers[2].name, 
        title: "Rising Star", 
        avatar: allMembers[2].avatar, 
    },
  ];

  const renderRankings = () => {
    const data = MOCK_RANKINGS[rankingCategory];
    const top3 = data.slice(0, 3);
    const rest = data.slice(3);
    const podium = [top3[1], top3[0], top3[2]];

    return (
        <div className="pb-32 min-h-screen relative bg-[#0f0f11]">
            {/* Header */}
            <div className="sticky top-0 left-0 w-full z-50 py-4 flex items-center justify-between bg-[#0f0f11]/80 backdrop-blur-md px-4 border-b border-white/5 relative">
                <button 
                    onClick={onBack} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition active:scale-95 flex-shrink-0"
                >
                <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#A540FF]" />
                    Family Rankings
                </div>
                
                <div className="w-10"></div>
            </div>

            {/* Tabs */}
            <div className="sticky top-[73px] bg-[#0f0f11] z-40 border-b border-white/10">
                <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar px-4 pt-2">
                    {(['Level', 'Duration', 'Received', 'Supported', 'PK Wins'] as RankingCategory[]).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setRankingCategory(cat)}
                            className={`pb-3 text-sm font-bold whitespace-nowrap transition-all relative ${
                                rankingCategory === cat 
                                    ? 'text-white' 
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {cat === 'Level' && 'Family Level'}
                            {cat === 'Duration' && 'Live Duration'}
                            {cat === 'Received' && 'Family Received'}
                            {cat === 'Supported' && 'Family Supported'}
                            {cat === 'PK Wins' && 'PK Wins'}
                            {rankingCategory === cat && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-[#A540FF] rounded-t-full shadow-[0_-2px_8px_rgba(165,64,255,0.6)]"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Content Container */}
            <div className="px-4">
                <div className={`text-xs text-gray-500 mb-6 mt-4 flex justify-between items-center px-1 h-6 transition-all ${rankingCategory === 'Level' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    {rankingCategory !== 'Level' && (
                        <>
                            <span>Refresh in <span className="text-[#A540FF] font-mono font-bold tracking-wide">{formatTime(timeLeft)}</span></span>
                            <div className="relative">
                                <select 
                                    value={rankingTimeFilter}
                                    onChange={(e) => setRankingTimeFilter(e.target.value as TimeFilter)}
                                    className="appearance-none bg-white/5 border border-white/5 text-white text-xs px-3 py-1 pr-8 rounded-full outline-none focus:border-[#A540FF] cursor-pointer"
                                >
                                    <option value="Daily" className="bg-[#1a1a1d]">Daily</option>
                                    <option value="Weekly" className="bg-[#1a1a1d]">Weekly</option>
                                    <option value="Monthly" className="bg-[#1a1a1d]">Monthly</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                            </div>
                        </>
                    )}
                </div>

                {/* Podium */}
                <div className="flex justify-between items-end w-full px-4 mb-8 mt-2">
                    {podium.map((item, idx) => {
                        const isFirst = idx === 1;
                        const isSecond = idx === 0;
                        return (
                            <div key={item.id} className={`flex flex-col items-center relative flex-1 ${isFirst ? '-mb-4 z-10 mx-2' : ''}`}>
                                <div className={`relative rounded-full p-[3px] shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
                                    isFirst ? 'w-24 h-24 bg-gradient-to-tr from-yellow-400 via-orange-500 to-yellow-600' :
                                    isSecond ? 'w-16 h-16 bg-gradient-to-tr from-slate-300 to-slate-500' :
                                    'w-16 h-16 bg-gradient-to-tr from-orange-300 to-amber-700'
                                }`}>
                                    <img src={item.avatar} className="w-full h-full rounded-full object-cover border-2 border-[#1a1a1d]" alt={item.name} />
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center">
                                        {isFirst ? (
                                            <div className="text-3xl font-bold text-yellow-500 drop-shadow-md italic">1</div>
                                        ) : isSecond ? (
                                            <div className="text-xl font-bold text-slate-400 drop-shadow-md italic">2</div>
                                        ) : (
                                            <div className="text-xl font-bold text-amber-600 drop-shadow-md italic">3</div>
                                        )}
                                    </div>
                                </div>
                                <div className={`mt-3 text-center w-full ${isFirst ? 'mb-4' : ''}`}>
                                    <div className="text-xs font-bold text-white truncate w-full mb-1">{item.name}</div>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                         {rankingCategory !== 'Level' && (
                                             <span className="text-[9px] font-bold text-yellow-500 bg-yellow-500/10 px-1 rounded border border-yellow-500/20 whitespace-nowrap">Lv.{item.level}</span>
                                         )}
                                         <span className="text-[9px] text-gray-400 flex items-center gap-0.5 whitespace-nowrap"><Users className="w-2.5 h-2.5"/>{item.members}</span>
                                    </div>
                                    <div className="text-[10px] inline-flex items-center justify-center gap-1 font-bold text-[#A540FF] bg-[#A540FF]/10 px-2.5 py-1 rounded-full border border-[#A540FF]/20 shadow-sm">
                                        {item.value}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* List 4+ */}
                <div className="space-y-1">
                    {rest.map((item) => (
                        <div key={item.id} className="flex items-center py-3 px-3 bg-[#1a1a1d]/50 rounded-xl border border-white/5">
                            <div className="w-8 font-bold text-gray-500 text-center">{item.rank}</div>
                            <img src={item.avatar} className="w-10 h-10 rounded-full bg-gray-700 object-cover border border-white/10 mr-3" alt={item.name} />
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm text-white truncate">{item.name}</div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                                    {rankingCategory !== 'Level' && (
                                        <span className="bg-yellow-500/10 text-yellow-500 px-1 rounded flex items-center gap-0.5 border border-yellow-500/20 font-bold">
                                            Lv.{item.level}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-0.5">
                                        <Users className="w-3 h-3" /> {item.members}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                 <div className="text-sm font-bold text-[#A540FF] flex items-center justify-end gap-1.5">
                                    {item.value}
                                 </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  }

  const renderContent = () => {
    // Show Benefits FAQ
    if (showBenefits) {
        return <FamilyBenefitsPage onBack={() => setShowBenefits(false)} />;
    }

    // Show Apply Form Overlay
    if (isApplying) {
        return <ApplyFamilyPage onBack={() => setIsApplying(false)} onSubmit={handleApplySubmit} />;
    }

    if (activeTab === 'home') {
      return (
        <div className="pb-10">
            {/* Background Effect */}
            <div className="absolute top-0 left-0 right-0 h-[500px] z-0 overflow-hidden pointer-events-none">
                <img 
                    src={HEADER_BG} 
                    className="w-full h-full object-cover blur-[5px] scale-110 opacity-80"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f0f11]/20 to-[#0f0f11]"></div>
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 w-full z-50 px-4 py-4 flex items-center justify-between">
                <button 
                    onClick={onBack} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition active:scale-95"
                >
                <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition active:scale-95">
                        <Share2 className="w-5 h-5 text-white" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition active:scale-95">
                        <CircleHelp className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="flex flex-col items-center pt-24 pb-8 px-4 relative z-10">
                <div className="relative mb-5 transform transition-transform hover:scale-105 duration-300">
                    <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-yellow-600 via-yellow-200 to-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                        <img 
                            src={FAMILY_AVATAR}
                            className="w-full h-full rounded-full object-cover border-4 border-[#1a1a1d]"
                            alt="Family"
                        />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-amber-500 text-white text-xs font-bold px-3 py-0.5 rounded-full border-2 border-[#1a1a1d] shadow-lg flex items-center gap-1 whitespace-nowrap">
                        <Shield className="w-3 h-3 fill-white" />
                        Lv 14
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white mt-2 mb-1 drop-shadow-lg">Royal Lions</h1>
                <p className="text-sm text-gray-200 italic mb-6 font-medium tracking-wide drop-shadow-md">"We roar together, we win together! 🦁"</p>

                {/* Apply to Join Button - Logic Updated */}
                {applyStatus === 'idle' ? (
                     <button 
                        onClick={() => setIsApplying(true)}
                        className="bg-gradient-to-r from-[#A540FF] to-purple-600 hover:brightness-110 text-white font-bold py-3 px-12 rounded-full shadow-[0_4px_20px_rgba(165,64,255,0.4)] flex items-center justify-center gap-2 transition-transform active:scale-95"
                     >
                        <UserPlus className="w-5 h-5" />
                        Apply to Join
                     </button>
                ) : (
                    <button 
                        disabled
                        className="bg-gray-800 border border-gray-600 text-gray-300 font-bold py-3 px-12 rounded-full flex items-center justify-center gap-2 cursor-not-allowed shadow-inner"
                     >
                        <Clock className="w-5 h-5 text-gray-400" />
                        Request Pending
                     </button>
                )}
                
                {/* Why Join Hint */}
                <button 
                    onClick={() => setShowBenefits(true)}
                    className="mt-4 text-xs text-gray-400 underline decoration-gray-500/50 hover:text-white hover:decoration-white transition-colors flex items-center gap-1"
                >
                    Why join a family?
                    <ChevronRight className="w-3 h-3" />
                </button>
            </div>

            {/* Heroes' Hall Section - Moved Up */}
            <div className="px-6 mt-4 relative z-10">
                <div className="flex items-center justify-center mb-8">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-white drop-shadow-md">
                        <Medal className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                        <span className="bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent uppercase tracking-wider">Heroes' Hall</span>
                        <Medal className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                    </h3>
                </div>
                
                <div className="flex justify-around items-end gap-2 pb-2">
                    {heroes.map((hero, idx) => (
                        <div key={hero.id} className="flex flex-col items-center relative group">
                            <div className="absolute -top-[22px] z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                <Crown className="w-7 h-7 text-yellow-300 fill-yellow-500" strokeWidth={1.5} />
                            </div>
                            <div className="relative w-[72px] h-[72px] mb-2">
                                <div className="absolute inset-0 rounded-full bg-yellow-500 opacity-20 blur-md"></div>
                                <div className="relative w-full h-full rounded-full p-[3px] bg-gradient-to-b from-yellow-300 via-orange-400 to-yellow-600 shadow-lg">
                                    <div className="w-full h-full rounded-full bg-[#1a1a1d] p-[2px]">
                                        <img src={hero.avatar} className="w-full h-full rounded-full object-cover" alt={hero.name} />
                                    </div>
                                </div>
                            </div>
                            <span className="text-[11px] font-bold text-white truncate max-w-[90px] mb-1.5 tracking-tight drop-shadow-sm">{hero.name}</span>
                            <div className="text-[9px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-700 via-amber-700 to-orange-700 border border-orange-500/30 text-orange-100 font-bold uppercase tracking-wider shadow-sm whitespace-nowrap">
                                {hero.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Member List Preview - Moved Up */}
            <div className="px-4 mt-10 relative z-10">
                <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                            <Users className="w-5 h-5 text-[#A540FF]" />
                            Members
                        </h3>
                        <span className="text-xs font-medium px-2 py-0.5 bg-white/10 rounded-full text-gray-300">{allMembers.length} / 200</span>
                    </div>
                </div>

                <div className="space-y-2.5">
                    {displayMembers.map((member, index) => (
                        <div key={member.id} className="bg-[#1a1a1d] hover:bg-[#222226] transition-colors rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`text-sm font-bold w-5 text-center ${index < 3 ? 'text-yellow-500' : 'text-gray-600'}`}>
                                    {index === 0 ? <Crown className="w-4 h-4 mx-auto fill-yellow-500" /> : index + 1}
                                </div>
                                <div className="relative">
                                    <img src={member.avatar} className="w-10 h-10 rounded-full bg-gray-700 object-cover border border-white/5" alt={member.name} />
                                    {member.role === 'Family Chief' && (
                                        <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 border border-[#1a1a1d]">
                                            <Crown className="w-2 h-2 text-black fill-black" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-white">{member.name}</div>
                                    <div className={`text-[9px] px-1.5 py-px rounded w-fit mt-1 font-bold tracking-wide uppercase ${ROLE_STYLES[member.role] || ROLE_STYLES['Member']}`}>
                                        {member.role}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-gray-500 mb-0.5">
                                    Contribution
                                </div>
                                <div className="text-sm font-bold text-white flex items-center justify-end gap-1">
                                    <Trophy className="w-3 h-3 text-yellow-500" />
                                    {getContributionDisplay(member)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 mb-8 text-center">
                    {visibleCount < allMembers.length ? (
                        <div 
                            onClick={handleLoadMore}
                            className="text-xs text-gray-500 hover:text-white cursor-pointer py-4 flex flex-col items-center gap-1 transition-colors group"
                        >
                        <span className="group-hover:translate-y-1 transition-transform">Pull up to load more</span>
                        </div>
                    ) : (
                        <div className="text-[10px] text-gray-600 py-4">No more members</div>
                    )}
                </div>
            </div>
        </div>
      );
    } 
    
    // Rankings View (Identical for Guest)
    if (activeTab === 'rankings') {
        return renderRankings();
    }

    if (activeTab === 'events') {
        return (
            <div className="pb-32 min-h-screen relative bg-[#0f0f11]">
                 {/* Header */}
                <div className="sticky top-0 left-0 w-full z-50 py-4 flex items-center justify-between bg-[#0f0f11]/80 backdrop-blur-md px-4 border-b border-white/5 relative">
                    <button 
                        onClick={onBack} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition active:scale-95 flex-shrink-0"
                    >
                    <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#A540FF]" />
                        Official Events
                    </div>
                    <div className="w-10"></div>
                </div>

                <div className="px-4 pt-4 space-y-4">
                    {FAMILY_EVENTS.map(event => (
                        <div key={event.id} className="w-full rounded-2xl overflow-hidden shadow-lg border border-white/5 relative group">
                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                <img 
                                    src={event.image} 
                                    alt={event.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold text-white bg-gradient-to-r ${event.tagColor} shadow-lg uppercase tracking-wider`}>
                                    {event.tag}
                                </div>
                            </div>
                            <div className={`p-4 flex justify-between items-center relative z-20 bg-gradient-to-br ${event.cardBg}`}>
                                <div>
                                    <h3 className="text-base font-bold text-white leading-tight mb-1">{event.title}</h3>
                                    <p className="text-xs text-gray-300 font-medium opacity-80">{event.subtitle}</p>
                                </div>
                                <button className="bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white text-xs font-bold px-4 py-2 rounded-lg border border-white/5 shadow-sm">
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="h-6"></div>
                </div>
            </div>
        );
    }

    return null;
  };

  return (
    <div className="w-full min-h-screen bg-[#0f0f11] text-white relative overflow-x-hidden animate-in slide-in-from-right duration-300 z-[300]">
      
      {/* Top Notification Toast */}
      <div 
         className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[150] transition-all duration-500 ease-out 
         ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-32 opacity-0 pointer-events-none'}`}
      >
         <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-4 flex items-center gap-3 border border-gray-100/20 text-gray-900">
             <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                 <CheckCircle2 className="w-5 h-5 text-green-600" strokeWidth={3} />
             </div>
             <div>
                 <div className="text-sm font-bold">Application Submitted</div>
                 <div className="text-xs text-gray-500 font-medium mt-0.5 leading-tight">Please wait for family admin approval.</div>
             </div>
         </div>
      </div>

      {/* Content Renderer */}
      {renderContent()}
    </div>
  );
};

// Helper Component for Navigation Buttons (Unused currently but kept for potential tab extensions)
const NavButton = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center w-full h-12 rounded-2xl transition-all duration-300 group`}
    >
        <Icon 
            className={`w-5 h-5 mb-1 transition-all duration-300 ${active ? 'text-[#A540FF] -translate-y-0.5' : 'text-gray-500 group-hover:text-gray-300'}`} 
            fill="none" 
            strokeWidth={active ? 2.5 : 2}
        />
        <span className={`text-[10px] font-medium transition-colors duration-300 ${active ? 'text-[#A540FF]' : 'text-gray-500 group-hover:text-gray-400'}`}>
            {label}
        </span>
    </button>
);