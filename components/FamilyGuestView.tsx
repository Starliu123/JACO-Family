import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Users, Shield, Trophy, Star, Crown, Share2, CircleHelp, Coins, FilePenLine, UserPlus, Medal, ChevronDown,
  Home, ClipboardCheck, BarChart3, Calendar, Settings, Gift, Clock, PlayCircle, CheckCircle2, Zap, Check, X, Gem, Video, MoreHorizontal, Swords, Flame, HeartHandshake, Mic2, Sparkles, Gamepad2, ChevronRight, History, TrendingUp, MessageCircle, FileText, Send, Compass, PlusCircle, Search, Play, Target, ShieldCheck, Camera, CircleDashed, Lock, Filter, MessageSquareQuote, Info, AlertTriangle
} from 'lucide-react';

export type FamilyTabType = 'home' | 'rankings' | 'events';

interface FamilyGuestViewProps {
  onBack: () => void;
  initialView?: 'home' | 'benefits'; // New prop
  initialTab?: FamilyTabType;
}

type FilterType = 'Season' | 'Total';
// Guest tabs: No 'tasks' or 'manage'
type RankingCategory = 'Level' | 'Duration' | 'Received' | 'Supported' | 'PK Wins';
type TimeFilter = 'Daily' | 'Weekly' | 'Monthly';
type ApplyStatus = 'idle' | 'pending';
type CreateStep = 'idle' | 'check' | 'form';

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
  'Tribe Chief': 'bg-gradient-to-r from-yellow-600 to-amber-500 text-white border-none',
  'The Arif': 'bg-purple-500/20 text-purple-400 border border-purple-500/20',
  'Fazaa Knights': 'bg-pink-500/20 text-pink-400 border border-pink-500/20',
  'The Wajeeh': 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
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
        title: "Tribe PK Championship",
        subtitle: "Battle for the Golden Shield 🛡️",
        image: "https://image.pollinations.ai/prompt/Esports%20arena%20stage%20red%20and%20orange%20lighting%20versus%20screen?width=800&height=600&seed=202&nologo=true",
        tag: "Hot",
        tagColor: "from-red-600 to-orange-600",
        cardBg: "from-[#450a0a] to-[#1a0505]" // Deep Red
    },
    {
        id: 3,
        title: "Voice of the Tribe",
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

// --- Sub-Component: Recruitment Hall (Discover More Tribes) ---
const RecruitmentHall = ({ onBack, onApply, onTribeClick }: { onBack: () => void, onApply: (tribe: any) => void, onTribeClick: (tribe: any) => void }) => {
    const [sortBy, setSortBy] = useState<'newest' | 'level'>('newest');

    // Mock Recruitment Data
    const RECRUITMENT_LIST = useMemo(() => {
        return Array.from({ length: 15 }, (_, i) => ({
            id: `recruit-${i}`,
            name: FAMILY_NAMES[i % FAMILY_NAMES.length],
            avatar: `https://api.dicebear.com/9.x/glass/svg?seed=recruit_${i}`,
            level: Math.floor(Math.random() * 20) + 1,
            members: Math.floor(Math.random() * 50) + 10,
            maxMembers: 60 + Math.floor(Math.random() * 2) * 20,
            slogan: i % 3 === 0 ? "Looking for active PK players! Join us for daily battles ⚔️" :
                    i % 3 === 1 ? "Chill vibes only 🎵 Make friends and have fun." :
                    "Top 10 Tribe recruiting high level supporters! 🏆",
            isNew: i < 3
        })).sort((a, b) => {
            if (sortBy === 'level') return b.level - a.level;
            return 0; // Default order implies "newest" as is
        });
    }, [sortBy]);

    return (
        <div className="absolute inset-0 z-[60] bg-[#0f0f11] animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 left-0 w-full z-50 py-4 flex items-center justify-between bg-[#0f0f11]/95 backdrop-blur-md px-4 border-b border-white/5">
                <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[#A540FF]" />
                    Discover Tribes
                </div>
                <div className="w-10"></div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Banner Area */}
                <div className="px-4 mt-4 mb-6">
                    <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-5 border border-white/10 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold text-white mb-1">Find Your Squad</h2>
                            <p className="text-xs text-gray-300 max-w-[80%]">Explore recruitment announcements from top tribes. Find the community that fits your style.</p>
                        </div>
                        <Users className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white/5" />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="px-4 flex items-center gap-2 mb-4 sticky top-0 z-40">
                    <button 
                        onClick={() => setSortBy('newest')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                            sortBy === 'newest' 
                            ? 'bg-[#A540FF] text-white border-[#A540FF]' 
                            : 'bg-[#1a1a1d] text-gray-400 border-white/10 hover:border-white/20'
                        }`}
                    >
                        Newest
                    </button>
                    <button 
                         onClick={() => setSortBy('level')}
                         className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                            sortBy === 'level' 
                            ? 'bg-[#A540FF] text-white border-[#A540FF]' 
                            : 'bg-[#1a1a1d] text-gray-400 border-white/10 hover:border-white/20'
                        }`}
                    >
                        Highest Level
                    </button>
                </div>

                {/* List */}
                <div className="px-4 space-y-3 pb-10">
                    {RECRUITMENT_LIST.map((tribe) => (
                        <div 
                            key={tribe.id} 
                            onClick={() => onTribeClick(tribe)}
                            className="bg-[#1a1a1d] rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer active:scale-[0.98] transition-transform"
                        >
                            
                            {/* Top Row: Info */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={tribe.avatar} className="w-14 h-14 rounded-xl object-cover bg-black/20" alt={tribe.name} />
                                        {tribe.isNew && (
                                            <div className="absolute -top-1.5 -left-1.5 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-[#1a1a1d]">NEW</div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-white text-base">{tribe.name}</h3>
                                            <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded text-[10px] font-bold border border-yellow-500/20">
                                                <Shield className="w-2.5 h-2.5 fill-yellow-500" />
                                                Lv.{tribe.level}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500 font-medium">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" /> {tribe.members}/{tribe.maxMembers}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onApply(tribe);
                                    }}
                                    className="bg-white/10 hover:bg-[#A540FF] hover:text-white text-[#A540FF] text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 border border-[#A540FF]/30 hover:border-[#A540FF]"
                                >
                                    Apply
                                </button>
                            </div>

                            {/* Middle: Slogan */}
                            <div className="bg-black/20 rounded-xl p-3 relative">
                                <MessageSquareQuote className="absolute top-2 left-2 w-4 h-4 text-gray-600 opacity-50" />
                                <p className="text-sm text-gray-300 italic pl-5 leading-relaxed">"{tribe.slogan}"</p>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Sub-Component: Family Creation Check ---
const FamilyCreationCheck = ({ onBack, onNext }: { onBack: () => void, onNext: () => void }) => {
    const [checkedCount, setCheckedCount] = useState(0);
    const rules = [
        { id: 1, text: "No violation records in last 30 days", icon: ShieldCheck },
        { id: 2, text: "Account Level > 40", icon: Trophy },
        { id: 3, text: "Coins Balance > 40,000", icon: Coins },
    ];

    useEffect(() => {
        if (checkedCount < rules.length) {
            const timer = setTimeout(() => {
                setCheckedCount(prev => prev + 1);
            }, 600); // 600ms per check for visual effect
            return () => clearTimeout(timer);
        }
    }, [checkedCount, rules.length]);

    const allPassed = checkedCount === rules.length;

    return (
        <div className="absolute inset-0 z-[60] bg-[#0f0f11] animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 left-0 w-full z-50 py-4 flex items-center justify-between bg-[#0f0f11]/95 backdrop-blur-md px-4 border-b border-white/5">
                <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white whitespace-nowrap">
                    Creation Requirements
                </div>
                <div className="w-10"></div>
            </div>

            <div className="p-6 flex-1">
                <div className="bg-[#1a1a1d] rounded-2xl p-6 border border-white/5 space-y-6">
                    {rules.map((rule, idx) => {
                        const isChecked = idx < checkedCount;
                        const isCurrent = idx === checkedCount;
                        
                        return (
                            <div key={rule.id} className={`flex items-center justify-between transition-opacity duration-500 ${isChecked || isCurrent ? 'opacity-100' : 'opacity-40'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isChecked ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-gray-500'}`}>
                                        <rule.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-white">{rule.text}</span>
                                </div>
                                <div>
                                    {isChecked ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-500 animate-in zoom-in duration-300" />
                                    ) : isCurrent ? (
                                        <CircleDashed className="w-6 h-6 text-[#A540FF] animate-spin" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-white/10"></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-[#0f0f11]">
                 <button 
                    onClick={onNext}
                    disabled={!allPassed}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        allPassed 
                        ? 'bg-[#A540FF] hover:bg-[#9333ea] text-white shadow-lg shadow-purple-900/20 active:scale-[0.98]' 
                        : 'bg-white/5 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {allPassed ? 'Proceed to Create' : 'Checking Requirements...'}
                    {allPassed && <ChevronRight className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
};

// --- Sub-Component: Creation Form ---
const FamilyCreationForm = ({ onBack, onSubmit }: { onBack: () => void, onSubmit: (data: any) => void }) => {
    // Basic Info
    const [name, setName] = useState('');
    const [slogan, setSlogan] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);

    // Advanced Settings (Removed Join Condition & Approval Method)
    const [allowMemberInvite, setAllowMemberInvite] = useState(false);

    const handleAvatarClick = () => {
        // Mock upload
        setAvatar("https://image.pollinations.ai/prompt/Futuristic%20lion%20logo%20purple%20neon?width=200&height=200&seed=123&nologo=true");
    };

    // Updated validation logic (Name & Avatar mandatory, Slogan optional)
    const isFormValid = name.trim().length > 0 && avatar !== null;

    return (
        <div className="absolute inset-0 z-[60] bg-[#0f0f11] animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="sticky top-0 left-0 w-full z-50 py-4 flex items-center justify-between bg-[#0f0f11]/95 backdrop-blur-md px-4 border-b border-white/5">
                <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white whitespace-nowrap">
                    Setup Profile
                </div>
                <div className="w-10"></div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto pb-20">
                {/* 1. Basic Info Section */}
                <section className="mb-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Basic Info</h3>
                    
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center mb-6">
                        <div 
                            onClick={handleAvatarClick}
                            className="relative w-24 h-24 rounded-full bg-[#1a1a1d] border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-[#A540FF] transition-colors group overflow-hidden"
                        >
                            {avatar ? (
                                <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-gray-500 group-hover:text-[#A540FF]">
                                    <Camera className="w-6 h-6" />
                                    <span className="text-[9px] font-bold uppercase">Upload</span>
                                </div>
                            )}
                            {avatar && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FilePenLine className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>
                        <span className="text-xs text-gray-500 mt-2 font-medium">Tribe Avatar <span className="text-red-500">*</span></span>
                    </div>

                    <div className="space-y-5">
                        {/* Name Input */}
                        <div>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Tribe Name"
                                    maxLength={30}
                                    className="w-full bg-[#1a1a1d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#A540FF] transition-colors text-sm"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600">
                                    {name.length}/30
                                </div>
                            </div>
                            <div className="flex items-start gap-1.5 mt-2 px-1">
                                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Please submit with caution. You can only change the tribe name after upgrading and unlocking.
                                </p>
                            </div>
                        </div>
                        
                        {/* Slogan Input */}
                        <div>
                            <div className="relative">
                                <textarea 
                                    value={slogan}
                                    onChange={(e) => setSlogan(e.target.value)}
                                    placeholder="Write a catchy slogan (Optional)..."
                                    rows={3}
                                    maxLength={200}
                                    className="w-full bg-[#1a1a1d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-[#A540FF] transition-colors resize-none text-sm"
                                />
                                <div className="absolute right-3 bottom-3 text-xs text-gray-600">
                                    {slogan.length}/200
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 px-1">
                                Max 200 characters. Supports English, Arabic, Symbols & Emojis.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 2. Invite Settings Section */}
                <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Invite Settings</h3>
                    
                    <div className="bg-[#1a1a1d] rounded-xl border border-white/5 overflow-hidden">
                        {/* Member Invite Permission */}
                        <div className="p-4 flex items-center justify-between">
                            <div className="max-w-[80%]">
                                <div className="text-sm font-bold text-white">Allow Member Invite</div>
                                <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    Any member can invite others to join the tribe without review
                                </div>
                            </div>
                            <button 
                                onClick={() => setAllowMemberInvite(!allowMemberInvite)}
                                className={`w-10 h-6 rounded-full p-1 transition-colors flex-shrink-0 ${
                                    allowMemberInvite ? 'bg-[#A540FF]' : 'bg-gray-700'
                                }`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                                    allowMemberInvite ? 'translate-x-4' : 'translate-x-0'
                                }`} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <div className="p-6 border-t border-white/5 bg-[#0f0f11] flex flex-col gap-3">
                 <button 
                    onClick={() => onSubmit({ name, slogan, avatar, allowMemberInvite })}
                    disabled={!isFormValid}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        isFormValid 
                        ? 'bg-[#A540FF] hover:bg-[#9333ea] text-white shadow-lg shadow-purple-900/20 active:scale-[0.98]' 
                        : 'bg-white/5 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Confirm Creation
                </button>
                <p className="text-xs text-gray-500 text-center">
                    * You can modify these settings anytime after creation.
                </p>
            </div>
        </div>
    );
};

// --- Sub-Component: Family Benefits Page (Rich Media Redesign) ---
const FamilyBenefitsPage = ({ onBack, onDiscover, onCreate }: { onBack: () => void, onDiscover: () => void, onCreate: () => void }) => {
    const [activeRoleTab, setActiveRoleTab] = useState<'All' | 'Streamer' | 'Supporter' | 'Viewer'>('All');

    const roleContent = {
        All: [
            { icon: Shield, text: "Exclusive Identity & Belonging" },
            { icon: Gift, text: "Exclusive Tribe Events & Rewards" },
            { icon: HeartHandshake, text: "Collective Echo of Every Action" }
        ],
        Streamer: [
            { icon: Users, text: "Stable Support, Never Alone" },
            { icon: Target, text: "Fan Cohesion & Newbie Growth" },
            { icon: TrendingUp, text: "Long-term Influence & Honor" }
        ],
        Supporter: [
            { icon: Crown, text: "Support Seen by Everyone" },
            { icon: Star, text: "Exclusive Titles & Status" },
            { icon: Swords, text: "Lead the Faction to Victory" }
        ],
        Viewer: [
            { icon: Zap, text: "Low Barrier Participation" },
            { icon: TrendingUp, text: "Growth: Viewer → Core → Supporter" },
            { icon: MessageCircle, text: "Find Friends & Belonging" }
        ]
    };

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
                    Tribe Introduction
                </div>
                <div className="w-10"></div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto pb-10">
                
                {/* 1. Video Section: What is JACO Family? */}
                <div className="p-4">
                    <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#A540FF]" />
                        What is JACO Tribe?
                    </h2>
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer">
                        {/* Thumbnail */}
                        <img 
                            src="https://image.pollinations.ai/prompt/Cinematic%203d%20render%20of%20diverse%20group%20of%20gamers%20and%20streamers%20united%20holding%20a%20glowing%20purple%20flag?width=800&height=450&seed=101&nologo=true"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="Video Thumbnail"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 text-white fill-white ml-1" />
                            </div>
                        </div>
                        {/* Text Overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-sm font-medium text-white/90 drop-shadow-md leading-relaxed">
                                A <span className="text-[#A540FF] font-bold">long-term community</span> of Streamers, Supporters, and Viewers. Grow together, achieve goals, and win honors. This is your "home" in JACO.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. How to Play Section */}
                <div className="px-4 mt-2">
                    <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5 text-yellow-500" />
                        How to Play?
                    </h2>
                    <div className="bg-[#1a1a1d] rounded-2xl p-5 border border-white/5">
                        <p className="text-xs text-gray-400 mb-4">Every action in the tribe counts towards collective glory:</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#252529] p-3 rounded-xl flex flex-col gap-2 border border-white/5">
                                <Mic2 className="w-6 h-6 text-pink-500" />
                                <div>
                                    <div className="font-bold text-white text-sm">Streaming</div>
                                    <div className="text-[10px] text-gray-500">Every stream contributes</div>
                                </div>
                            </div>
                             <div className="bg-[#252529] p-3 rounded-xl flex flex-col gap-2 border border-white/5">
                                <MessageCircle className="w-6 h-6 text-blue-500" />
                                <div>
                                    <div className="font-bold text-white text-sm">Interaction</div>
                                    <div className="text-[10px] text-gray-500">Watch & Chat active points</div>
                                </div>
                            </div>
                             <div className="bg-[#252529] p-3 rounded-xl flex flex-col gap-2 border border-white/5">
                                <Gift className="w-6 h-6 text-yellow-500" />
                                <div>
                                    <div className="font-bold text-white text-sm">Gifting</div>
                                    <div className="text-[10px] text-gray-500">Support turns into Honor</div>
                                </div>
                            </div>
                             <div className="bg-[#252529] p-3 rounded-xl flex flex-col gap-2 border border-white/5">
                                <Trophy className="w-6 h-6 text-[#A540FF]" />
                                <div>
                                    <div className="font-bold text-white text-sm">Events</div>
                                    <div className="text-[10px] text-gray-500">Battle for Tribe Rankings</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Why Join Section (Tabs) */}
                <div className="px-4 mt-6">
                    <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <HeartHandshake className="w-5 h-5 text-red-500" />
                        Why Join?
                    </h2>
                    
                    {/* Tabs */}
                    <div className="flex p-1 bg-[#1a1a1d] rounded-xl mb-4 border border-white/5">
                        {Object.keys(roleContent).map((role) => (
                            <button
                                key={role}
                                onClick={() => setActiveRoleTab(role as any)}
                                className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                                    activeRoleTab === role 
                                    ? 'bg-[#A540FF] text-white shadow-md' 
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                {role === 'All' ? 'Everyone' : role}
                            </button>
                        ))}
                    </div>

                    {/* Content Card */}
                    <div className="bg-gradient-to-br from-[#252529] to-[#1a1a1d] p-5 rounded-2xl border border-white/5 min-h-[160px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-2 duration-300 key={activeRoleTab}">
                        {roleContent[activeRoleTab].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 mb-4 last:mb-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    idx === 0 ? 'bg-yellow-500/10 text-yellow-500' :
                                    idx === 1 ? 'bg-blue-500/10 text-blue-500' :
                                    'bg-green-500/10 text-green-500'
                                }`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div className="text-sm font-medium text-white">{item.text}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Create vs Join */}
                <div className="px-4 mt-6">
                     <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Compass className="w-5 h-5 text-cyan-400" />
                        Start Your Journey
                    </h2>

                    <div className="space-y-3">
                        {/* How to Create */}
                        <div className="bg-[#1a1a1d] p-4 rounded-xl border border-white/5">
                            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                                <PlusCircle className="w-4 h-4 text-[#A540FF]" /> How to Create a Tribe?
                            </h3>
                            <div className="flex items-center justify-between text-[10px] text-gray-400">
                                <div className="flex flex-col items-center gap-1 text-center max-w-[60px]">
                                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center font-bold">1</div>
                                    <span>Enter Page</span>
                                </div>
                                <div className="h-[1px] w-4 bg-gray-700"></div>
                                <div className="flex flex-col items-center gap-1 text-center max-w-[60px]">
                                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center font-bold">2</div>
                                    <span>Click Create</span>
                                </div>
                                <div className="h-[1px] w-4 bg-gray-700"></div>
                                <div className="flex flex-col items-center gap-1 text-center max-w-[60px]">
                                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center font-bold">3</div>
                                    <span>Set Profile</span>
                                </div>
                                <div className="h-[1px] w-4 bg-gray-700"></div>
                                <div className="flex flex-col items-center gap-1 text-center max-w-[60px]">
                                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center font-bold">4</div>
                                    <span>Invite</span>
                                </div>
                            </div>
                        </div>

                         {/* How to Join */}
                         <div className="bg-[#1a1a1d] p-4 rounded-xl border border-white/5">
                            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-emerald-500" /> How to Join?
                            </h3>
                            <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside">
                                <li>Browse the <strong>Tribe Square</strong></li>
                                <li>Join via Streamer or Friend invitation</li>
                                <li>Submit application & wait for approval</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="h-6"></div>
            </div>

             {/* Footer Actions */}
            <div className="p-4 border-t border-white/5 bg-[#0f0f11] flex items-center gap-3">
                <button 
                    onClick={onDiscover}
                    className="flex-1 bg-gradient-to-r from-[#A540FF] to-purple-600 hover:brightness-110 active:scale-[0.98] transition-all text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
                >
                    <Compass className="w-4 h-4" />
                    Discover Tribe
                </button>
                <button 
                    onClick={onCreate}
                    className="flex-1 bg-[#1a1a1d] hover:bg-[#252529] active:scale-[0.98] transition-all border border-white/10 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" />
                    Create Tribe
                </button>
            </div>
        </div>
    );
};

// --- Sub-Component: Application Form ---
const ApplyFamilyPage = ({ onBack, onSubmit, family }: { onBack: () => void, onSubmit: () => void, family?: any }) => {
    const [reason, setReason] = useState("");
    const maxLength = 1000;
    
    // Use passed family or default
    const target = family || {
        name: "Royal Lions",
        id: "882931",
        avatar: "https://image.pollinations.ai/prompt/Esports%20team%20logo%20shield%20purple%20lion?width=100&height=100&seed=45&nologo=true",
        level: 14
    };

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
                        src={target.avatar}
                        className="w-14 h-14 rounded-xl border border-white/10"
                        alt={target.name}
                    />
                    <div>
                        <div className="text-white font-bold text-lg">{target.name}</div>
                        <div className="text-gray-400 text-xs mt-0.5">Lv.{target.level}</div>
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
                        placeholder={`Please explain why you want to join ${target.name}...`}
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
                        * The tribe administrator will review your application. Please be patient.
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

export const FamilyGuestView: React.FC<FamilyGuestViewProps> = ({ onBack, initialView = 'home', initialTab = 'home' }) => {
  const FAMILY_AVATAR = "https://image.pollinations.ai/prompt/Esports%20team%20logo%20shield%20purple%20lion?width=100&height=100&seed=45&nologo=true";
  const HEADER_BG = "https://img.jacocdn.com/large/3b9ae203la1i8yryvrmrxj20rs0rpnpd.jpg";

  const [activeTab, setActiveTab] = useState<FamilyTabType>(initialTab);
  const [filter, setFilter] = useState<FilterType>('Season');
  const [visibleCount, setVisibleCount] = useState(20);
  
  // Application State
  const [isApplying, setIsApplying] = useState(false);
  const [applyStatus, setApplyStatus] = useState<ApplyStatus>('idle');
  const [applyingFamily, setApplyingFamily] = useState<any>(null); // Family being applied to
  const [showToast, setShowToast] = useState(false);
  const [showBenefits, setShowBenefits] = useState(initialView === 'benefits'); // Init based on prop
  const [createFlowStep, setCreateFlowStep] = useState<CreateStep>('idle'); // New State for Create Flow
  const [showDiscoverList, setShowDiscoverList] = useState(false); // New state for recruitment hall

  // Rankings State
  const [rankingCategory, setRankingCategory] = useState<RankingCategory>('Level');
  const [rankingTimeFilter, setRankingTimeFilter] = useState<TimeFilter>('Daily');
  // Timer State for Refresh
  const [timeLeft, setTimeLeft] = useState(19 * 3600 + 29 * 60 + 32); // Initial seconds

  // Active Family Data State
  const [currentFamilyData, setCurrentFamilyData] = useState({
        name: "Royal Lions",
        avatar: FAMILY_AVATAR,
        level: 14,
        slogan: "We roar together, we win together! 🦁",
        members: 154
  });

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
      // 2. Change status (only if default family, otherwise just toast)
      if (!applyingFamily) setApplyStatus('pending');
      // 3. Show Toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
  };
  
  // Handlers for Benefits Page
  const handleDiscoverFamily = () => {
      setShowBenefits(false);
      setShowDiscoverList(true); // Switch to the Recruitment Hall
  };
  
  const handleCreateFamily = () => {
       setCreateFlowStep('check'); // Start check flow
  };

  const handleApplyClick = (family?: any) => {
      setApplyingFamily(family || null);
      setIsApplying(true);
  };

  // Handler for clicking a tribe card in Recruitment Hall
  const handleTribeClick = (tribe: any) => {
      setCurrentFamilyData({
          name: tribe.name,
          avatar: tribe.avatar,
          level: tribe.level,
          members: tribe.members,
          slogan: tribe.slogan
      });
      setShowDiscoverList(false); // Close the list
      setActiveTab('home'); // Ensure we are on the home tab
  };

  // Generate extended mock data
  const allMembers = useMemo(() => {
    // UPDATED ROLES HERE
    const roles = ['Member', 'The Arif', 'Fazaa Knights', 'The Wajeeh'];
    const baseMembers = [
      { id: 1, name: "Ahmed_Live", role: "Tribe Chief", contributionTotal: "1.2M", contributionSeason: "300K", avatar: "https://image.pollinations.ai/prompt/Handsome%20Saudi%20Arab%20man%20streamer%20wearing%20red%20shemagh%20headset%20talking%20microphone%20professional%20gaming%20studio%20purple%20lighting?width=800&height=1000&seed=88&nologo=true" },
      { id: 2, name: "Desert_King", role: "The Arif", contributionTotal: "850K", contributionSeason: "210K", avatar: "https://image.pollinations.ai/prompt/Arab%20man%20sunglasses%20cool?width=100&height=100&seed=12&nologo=true" },
      { id: 3, name: "Sarah_Gamer", role: "The Arif", contributionTotal: "720K", contributionSeason: "180K", avatar: "https://image.pollinations.ai/prompt/Arab%20woman%20gamer%20headset?width=100&height=100&seed=33&nologo=true" },
      { id: 4, name: "Falcon_Eye", role: "Fazaa Knights", contributionTotal: "450K", contributionSeason: "120K", avatar: "https://image.pollinations.ai/prompt/Falcon%20portrait?width=100&height=100&seed=44&nologo=true" },
      { id: 5, name: "Riyadh_Drift", role: "The Wajeeh", contributionTotal: "300K", contributionSeason: "90K", avatar: "https://image.pollinations.ai/prompt/Race%20car%20driver?width=100&height=100&seed=55&nologo=true" },
      { id: 6, name: "Coffee_Lover", role: "Fazaa Knights", contributionTotal: "280K", contributionSeason: "85K", avatar: "https://image.pollinations.ai/prompt/Arab%20coffee%20dallah?width=100&height=100&seed=66&nologo=true" },
      { id: 7, name: "Night_Owl", role: "Member", contributionTotal: "150K", contributionSeason: "50K", avatar: "https://image.pollinations.ai/prompt/Owl%20neon?width=100&height=100&seed=77&nologo=true" },
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
        contributionSeason: `${(total * 0.3).toFixed(1)}K`,
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
      case 'Season': return member.contributionSeason;
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
    
    // Current User Rank Mock
    const myRank = {
        rank: 12,
        name: "Royal Lions",
        avatar: FAMILY_AVATAR,
        value: rankingCategory === 'Level' ? "Lv. 14" : 
               rankingCategory === 'Duration' ? "450 Hrs" : 
               rankingCategory === 'Received' ? "120.5M" : 
               rankingCategory === 'Supported' ? "88.2M" : "85 Wins",
        trend: 'up',
        level: 14,
        members: 154
    };

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
                    Tribe Rankings
                </div>
                
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition active:scale-95 flex-shrink-0">
                    <Search className="w-5 h-5 text-white" />
                </button>
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
                            {cat === 'Level' && 'Tribe Level'}
                            {cat === 'Duration' && 'Live Duration'}
                            {cat === 'Received' && 'Tribe Received'}
                            {cat === 'Supported' && 'Tribe Supported'}
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
                                <div className={`mt-3 text-center w-full flex flex-col items-center ${isFirst ? 'mb-4' : ''}`}>
                                    <div className="text-xs font-bold text-white truncate w-full mb-1">{item.name}</div>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                         {rankingCategory !== 'Level' && (
                                             <span className="text-[9px] font-bold text-yellow-500 bg-yellow-500/10 px-1 rounded border border-yellow-500/20 whitespace-nowrap">Lv.{item.level}</span>
                                         )}
                                         <span className="text-[9px] text-gray-400 flex items-center gap-0.5 whitespace-nowrap"><Users className="w-2.5 h-2.5"/>{item.members}</span>
                                    </div>
                                    <div className="text-[10px] inline-flex items-center justify-center gap-1 font-bold text-[#A540FF] bg-[#A540FF]/10 px-2.5 py-1 rounded-full border border-[#A540FF]/20 shadow-sm mb-1.5">
                                        {item.value}
                                    </div>
                                    <button 
                                        onClick={() => handleApplyClick(item)}
                                        className="bg-[#A540FF] hover:bg-[#9333ea] text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-lg shadow-purple-900/20 active:scale-95 transition-transform"
                                    >
                                        Apply
                                    </button>
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
                            <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-2">
                                 <div className="text-sm font-bold text-[#A540FF]">
                                    {item.value}
                                 </div>
                                 <button 
                                    onClick={() => handleApplyClick(item)}
                                    className="bg-[#A540FF] hover:bg-[#9333ea] text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-md active:scale-95 transition-transform"
                                 >
                                    Apply
                                 </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky "My Family" Rank Footer */}
            <div className="fixed bottom-[88px] left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-40 animate-in slide-in-from-bottom-10 duration-500">
                <div className="bg-[#242429] border border-[#A540FF]/30 rounded-2xl p-3 flex items-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#A540FF]/10 to-transparent pointer-events-none"></div>
                    
                    <div className="w-8 font-bold text-white text-center z-10">{myRank.rank}</div>
                    <img src={myRank.avatar} className="w-10 h-10 rounded-full object-cover border border-[#A540FF]/50 mr-3 z-10" alt="Me" />
                    
                    <div className="flex-1 z-10 min-w-0">
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                            {myRank.name}
                            <span className="text-[10px] bg-[#A540FF] text-white px-1.5 rounded font-bold flex-shrink-0">My Tribe</span>
                        </div>
                         <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                                {rankingCategory !== 'Level' && (
                                    <span className="bg-yellow-500/10 text-yellow-500 px-1 rounded flex items-center gap-0.5 border border-yellow-500/20 font-bold">
                                        Lv.{myRank.level}
                                    </span>
                                )}
                                <span className="flex items-center gap-0.5">
                                    <Users className="w-3 h-3" /> {myRank.members}
                                </span>
                        </div>
                    </div>
                    
                    <div className="text-right z-10 flex-shrink-0 ml-2">
                        <div className="text-sm font-bold text-white flex items-center justify-end gap-1.5">
                           {myRank.value}
                        </div>
                        <div className="text-[10px] text-gray-400 flex items-center justify-end gap-1">
                           To No.{myRank.rank - 1}: <span className="text-white">
                             {rankingCategory === 'Level' && '1,232 Exp'}
                             {rankingCategory === 'Duration' && '232 Hrs'}
                             {rankingCategory === 'Received' && '2,133 Diamonds'}
                             {rankingCategory === 'Supported' && '150K Coins'}
                             {rankingCategory === 'PK Wins' && '12 Wins'}
                           </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  // --- Main Render Logic ---
  const renderContent = () => {
    if (isApplying) return <ApplyFamilyPage onBack={() => setIsApplying(false)} onSubmit={handleApplySubmit} family={applyingFamily} />;
    
    if (createFlowStep === 'check') return <FamilyCreationCheck onBack={() => setCreateFlowStep('idle')} onNext={() => setCreateFlowStep('form')} />;
    
    if (createFlowStep === 'form') return <FamilyCreationForm onBack={() => setCreateFlowStep('check')} onSubmit={(data) => {
        setCreateFlowStep('idle');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    }} />;
    
    if (showDiscoverList) return <RecruitmentHall 
        onBack={() => setShowDiscoverList(false)} 
        onApply={handleApplyClick} 
        onTribeClick={handleTribeClick}
    />;
    
    if (showBenefits) return <FamilyBenefitsPage 
        onBack={onBack} 
        onDiscover={handleDiscoverFamily} 
        onCreate={handleCreateFamily} 
    />;

    // Rankings View
    if (activeTab === 'rankings') return renderRankings();

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

                {/* Content Container */}
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
  
    // Home View (Default)
    return (
        <div className="pb-32">
            {/* Background Effect: Blurred Avatar */}
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
                            src={currentFamilyData.avatar}
                            className="w-full h-full rounded-full object-cover border-4 border-[#1a1a1d]"
                            alt="Family"
                        />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-amber-500 text-white text-xs font-bold px-3 py-0.5 rounded-full border-2 border-[#1a1a1d] shadow-lg flex items-center gap-1 whitespace-nowrap">
                        <Shield className="w-3 h-3 fill-white" />
                        Lv {currentFamilyData.level}
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white mt-2 mb-1 drop-shadow-lg">{currentFamilyData.name}</h1>
                <p className="text-sm text-gray-200 italic mb-4 font-medium tracking-wide drop-shadow-md text-center">"{currentFamilyData.slogan}"</p>
                
                {/* Join Button State */}
                {applyStatus === 'pending' ? (
                     <button disabled className="bg-gray-600/50 text-gray-300 px-8 py-2.5 rounded-full font-bold text-sm border border-white/10 flex items-center gap-2 cursor-not-allowed">
                        <Clock className="w-4 h-4" /> Application Pending
                     </button>
                ) : (
                    <button 
                        onClick={() => handleApplyClick()}
                        className="bg-[#A540FF] hover:bg-[#9333ea] text-white px-8 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-purple-600/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                        Apply to Join
                    </button>
                )}
            </div>

            {/* Heroes' Hall Section */}
            <div className="px-6 mt-6 relative z-10">
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

            {/* Member List */}
            <div className="px-4 mt-10 relative z-10">
                <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                            <Users className="w-5 h-5 text-[#A540FF]" />
                            Members
                        </h3>
                        <span className="text-xs font-medium px-2 py-0.5 bg-white/10 rounded-full text-gray-300">{allMembers.length} / 200</span>
                    </div>
                    
                    <div className="relative">
                        <select 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as FilterType)}
                            className="appearance-none bg-[#252529] text-white text-xs font-medium pl-3 pr-8 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#A540FF] transition-colors cursor-pointer"
                        >
                            <option value="Season">Current Season</option>
                            <option value="Total">Total</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
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
                                    {member.role === 'Tribe Chief' && (
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
                        <span className="text-[10px] opacity-50">(Click to load 20 more)</span>
                        </div>
                    ) : (
                        <div className="text-[10px] text-gray-600 py-4">
                            No more members
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#0f0f11] text-white relative overflow-x-hidden animate-in slide-in-from-right duration-300">
        
        {/* Toast Notification */}
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100] transition-all duration-500 ease-out ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}>
            <div className="bg-[#1a1a1d] border border-white/10 rounded-2xl shadow-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                    <div className="text-sm font-bold text-white">Application Sent</div>
                    <div className="text-xs text-gray-400">You will be notified once approved.</div>
                </div>
            </div>
        </div>

        {renderContent()}

        {/* Floating Bottom Navigation */}
        {['home', 'rankings', 'events'].includes(activeTab) && !isApplying && createFlowStep === 'idle' && !showDiscoverList && !showBenefits && (
             <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[420px] z-50">
                 <div className="bg-[#0f0f11]/25 backdrop-blur-3xl border border-white/10 rounded-[32px] grid grid-cols-3 px-2 gap-2 items-center py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] ring-1 ring-white/5">
                     <NavButton 
                        icon={Home} 
                        label="Home" 
                        active={activeTab === 'home'} 
                        onClick={() => setActiveTab('home')} 
                     />
                     <NavButton 
                        icon={BarChart3} 
                        label="Rankings" 
                        active={activeTab === 'rankings'} 
                        onClick={() => setActiveTab('rankings')} 
                     />
                     <NavButton 
                        icon={Calendar} 
                        label="Events" 
                        active={activeTab === 'events'} 
                        onClick={() => setActiveTab('events')} 
                     />
                 </div>
             </div>
        )}
    </div>
  );
};

// Re-use NavButton helper
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