import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Users, Shield, Trophy, Star, Crown, Share2, CircleHelp, Coins, FilePenLine, UserPlus, Medal, ChevronDown,
  Home, ClipboardCheck, BarChart3, Calendar, Settings, Gift, Clock, PlayCircle, CheckCircle2, Zap, Check, X, Gem, Video, MoreHorizontal, Swords, Flame, HeartHandshake, Mic2, Sparkles, Gamepad2, ChevronRight, History, TrendingUp, MessageCircle
} from 'lucide-react';
import { FamilyManage } from './family/FamilyManage';

interface FamilyViewProps {
  onBack: () => void;
  initialTab?: FamilyTabType;
}

type FilterType = 'Total' | 'Month' | 'Week';
export type FamilyTabType = 'home' | 'tasks' | 'rankings' | 'events' | 'manage';
type TaskStatus = 'go' | 'claim' | 'done';
// Updated Categories: Added Supported, Renamed Gifting to Received
type RankingCategory = 'Level' | 'Duration' | 'Received' | 'Supported' | 'PK Wins';
type TimeFilter = 'Daily' | 'Weekly' | 'Monthly';

interface Reward {
    type: 'exp' | 'coin' | 'gem';
    value: number;
    icon: any;
    label: string;
}

interface Task {
    id: number;
    icon: any;
    color: string;
    title: string;
    desc: string;
    rewards: Reward[];
    status: TaskStatus;
    current: number;
    target: number;
}

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

// History Item Interface
interface HistoryItem {
    id: number;
    type: 'contribution' | 'levelup';
    date: Date; // Actual date object for grouping
    timeDisplay: string; // Display string like "14:30" or "2 mins ago"
    // For contribution
    user?: { name: string; avatar: string };
    action?: string;
    xp?: number;
    // For levelup
    level?: number;
}

// Role definitions for styling
const ROLE_STYLES: Record<string, string> = {
  'Tribe Chief': 'bg-gradient-to-r from-yellow-600 to-amber-500 text-white border-none',
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
    {
        id: 4,
        title: "Desert Nights Gala",
        subtitle: "Exclusive Frames & Gifts 🎁",
        image: "https://image.pollinations.ai/prompt/Arabian%20night%20desert%20tent%20luxury%20lanterns%20warm%20gold%20light?width=800&height=600&seed=204&nologo=true",
        tag: "Official",
        tagColor: "from-blue-600 to-indigo-600",
        cardBg: "from-[#451a03] to-[#1c0a00]" // Deep Amber/Brown
    },
    {
        id: 5,
        title: "Recruitment Rally",
        subtitle: "Invite friends, unlock Griffin Avatar 🦅",
        image: "https://image.pollinations.ai/prompt/Futuristic%20griffin%20logo%20glowing%20emerald%20green%20tech%20background?width=800&height=600&seed=205&nologo=true",
        tag: "Hot",
        tagColor: "from-red-600 to-orange-600",
        cardBg: "from-[#022c22] to-[#00100d]" // Deep Green
    }
];

// Initial Data
const INITIAL_MY_TASKS: Task[] = [
    { 
        id: 1, 
        icon: CheckCircle2, 
        color: "text-green-400",
        title: "Daily Check-in", 
        desc: "Check in to support your tribe",
        rewards: [
            { type: 'exp', value: 50, icon: Trophy, label: 'Exp' }
        ],
        status: 'claim', 
        current: 1, 
        target: 1 
    },
    { 
        id: 2, 
        icon: Clock, 
        color: "text-blue-400",
        title: "Watch Live Stream", 
        desc: "Join LIVE and watch for 10 mins",
        rewards: [
            { type: 'exp', value: 100, icon: Trophy, label: 'Exp' },
            { type: 'coin', value: 200, icon: Coins, label: 'Coins' }
        ],
        status: 'go', 
        current: 2, 
        target: 10 
    },
    { 
        id: 4, 
        icon: Video, 
        color: "text-purple-400", 
        title: "Host a Great Stream", 
        desc: "Start live and stream for 20+ mins",
        rewards: [
             { type: 'exp', value: 300, icon: Trophy, label: 'Exp' },
             { type: 'gem', value: 20, icon: Gem, label: 'Gems' }
        ],
        status: 'go', 
        current: 12, 
        target: 20 
    },
    { 
        id: 3, 
        icon: Gift, 
        color: "text-pink-400", 
        title: "Send a Gift", 
        desc: "Send any gift to tribe members",
        rewards: [
             { type: 'exp', value: 200, icon: Trophy, label: 'Exp' },
             { type: 'gem', value: 5, icon: Gem, label: 'Gems' }
        ],
        status: 'done', 
        current: 1, 
        target: 1 
    },
];

const FAMILY_TASKS = [
    {
        id: 1,
        title: "Total Live Duration",
        current: 320,
        target: 500,
        unit: "hrs",
        reward: 5000,
        contributors: [
            "https://image.pollinations.ai/prompt/avatar1?width=50&height=50&nologo=true",
            "https://image.pollinations.ai/prompt/avatar2?width=50&height=50&nologo=true",
            "https://image.pollinations.ai/prompt/avatar3?width=50&height=50&nologo=true",
            "https://image.pollinations.ai/prompt/avatar4?width=50&height=50&nologo=true",
        ]
    },
    {
        id: 2,
        title: "Tribe Gift Value",
        current: 12500,
        target: 50000,
        unit: "coins",
        reward: 10000,
        contributors: [
             "https://image.pollinations.ai/prompt/avatar5?width=50&height=50&nologo=true",
             "https://image.pollinations.ai/prompt/avatar6?width=50&height=50&nologo=true",
        ]
    },
    {
        id: 3,
        title: "New Members Recruited",
        current: 8,
        target: 10,
        unit: "members",
        reward: 2000,
        contributors: [
            "https://image.pollinations.ai/prompt/avatar7?width=50&height=50&nologo=true",
            "https://image.pollinations.ai/prompt/avatar8?width=50&height=50&nologo=true",
            "https://image.pollinations.ai/prompt/avatar9?width=50&height=50&nologo=true",
        ]
    }
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

// Date Generators
const NOW = new Date();
const SUB_MINS = (mins: number) => new Date(NOW.getTime() - mins * 60000);
const YESTERDAY_DATE = new Date(NOW); YESTERDAY_DATE.setDate(NOW.getDate() - 1);
const LAST_MONTH_DATE = new Date(NOW); LAST_MONTH_DATE.setMonth(NOW.getMonth() - 1);

// Mock History Data (With Dates)
const MOCK_HISTORY: HistoryItem[] = [
    {
        id: 1,
        type: 'contribution',
        date: SUB_MINS(2), // Today
        timeDisplay: '14:23',
        user: { name: 'Ahmed_Live', avatar: 'https://image.pollinations.ai/prompt/Handsome%20Saudi%20Arab%20man%20streamer%20wearing%20red%20shemagh%20headset%20talking%20microphone%20professional%20gaming%20studio%20purple%20lighting?width=100&height=100&seed=88&nologo=true' },
        action: 'Started a live stream',
        xp: 150
    },
    {
        id: 2,
        type: 'contribution',
        date: SUB_MINS(15), // Today
        timeDisplay: '14:10',
        user: { name: 'Desert_King', avatar: 'https://image.pollinations.ai/prompt/Arab%20man%20sunglasses%20cool?width=100&height=100&seed=12&nologo=true' },
        action: 'Completed daily check-in',
        xp: 50
    },
    {
        id: 3,
        type: 'contribution',
        date: SUB_MINS(32), // Today
        timeDisplay: '13:53',
        user: { name: 'Sarah_Gamer', avatar: 'https://image.pollinations.ai/prompt/Arab%20woman%20gamer%20headset?width=100&height=100&seed=33&nologo=true' },
        action: 'Won a PK Match',
        xp: 500
    },
    {
        id: 4,
        type: 'contribution',
        date: SUB_MINS(60), // Today
        timeDisplay: '13:25',
        user: { name: 'Falcon_Eye', avatar: 'https://image.pollinations.ai/prompt/Falcon%20portrait?width=100&height=100&seed=44&nologo=true' },
        action: 'Sent a Luxury Gift',
        xp: 200
    },
    {
        id: 5,
        type: 'levelup',
        date: SUB_MINS(120), // Today
        timeDisplay: '12:25',
        level: 14
    },
    {
        id: 6,
        type: 'contribution',
        date: YESTERDAY_DATE, // Yesterday
        timeDisplay: '22:45',
        user: { name: 'Riyadh_Drift', avatar: 'https://image.pollinations.ai/prompt/Race%20car%20driver?width=100&height=100&seed=55&nologo=true' },
        action: 'Joined the tribe',
        xp: 20
    },
    {
        id: 7,
        type: 'contribution',
        date: YESTERDAY_DATE, // Yesterday
        timeDisplay: '18:30',
        user: { name: 'Coffee_Lover', avatar: 'https://image.pollinations.ai/prompt/Arab%20coffee%20dallah?width=100&height=100&seed=66&nologo=true' },
        action: 'Hosted audio room for 1hr',
        xp: 300
    },
    {
         id: 8,
         type: 'contribution',
         date: YESTERDAY_DATE, // Yesterday
         timeDisplay: '09:15',
         user: { name: 'Night_Owl', avatar: 'https://image.pollinations.ai/prompt/Owl%20neon?width=100&height=100&seed=77&nologo=true' },
         action: 'Sent Gift "Desert Camel"',
         xp: 120
    },
    {
        id: 9,
        type: 'contribution',
        date: LAST_MONTH_DATE, // Last Month
        timeDisplay: '15:00',
        user: { name: 'Ahmed_Live', avatar: 'https://image.pollinations.ai/prompt/Handsome%20Saudi%20Arab%20man%20streamer%20wearing%20red%20shemagh%20headset%20talking%20microphone%20professional%20gaming%20studio%20purple%20lighting?width=100&height=100&seed=88&nologo=true' },
        action: 'Completed Weekly Goal',
        xp: 1000
    }
];

// Extracted HistoryView Component to prevent Conditional Hook execution
const HistoryView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    // Grouping Logic using useMemo
    const groupedHistory = useMemo(() => {
        const groups: Record<string, Record<string, HistoryItem[]>> = {};

        MOCK_HISTORY.forEach(item => {
            const dateObj = new Date(item.date);
            // Level 1 Group: Month Year (e.g., Dec 2025)
            const monthYear = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            // Level 2 Group: Day (Today, Yesterday, Dec 12)
            let dayLabel = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            
            const today = new Date();
            const isToday = dateObj.toDateString() === today.toDateString();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const isYesterday = dateObj.toDateString() === yesterday.toDateString();

            if (isToday) dayLabel = 'Today';
            else if (isYesterday) dayLabel = 'Yesterday';

            if (!groups[monthYear]) groups[monthYear] = {};
            if (!groups[monthYear][dayLabel]) groups[monthYear][dayLabel] = [];
            
            groups[monthYear][dayLabel].push(item);
        });
        return groups;
    }, []);

    return (
      <div className="min-h-screen bg-[#0f0f11] relative z-50">
          {/* Header */}
          <div className="sticky top-0 left-0 w-full z-50 py-4 flex items-center justify-between bg-[#0f0f11]/80 backdrop-blur-md px-4 border-b border-white/5 relative">
              <button 
                  onClick={onBack} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition active:scale-95 flex-shrink-0"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-[#A540FF]" />
                  Contribution Record
              </div>
              
              <div className="w-10"></div>
          </div>

          <div className="px-6 py-8">
               {/* Timeline Container */}
               <div className="relative border-l-2 border-white/10 ml-3">
                   
                   {Object.entries(groupedHistory).map(([month, days]) => (
                       <div key={month} className="mb-6 animate-in slide-in-from-bottom-2 duration-500">
                           {/* Level 1 Group: Month Header */}
                           <div className="pl-6 mb-4 mt-8">
                               <h3 className="text-2xl font-black text-white uppercase tracking-tight">{month}</h3>
                           </div>

                           {Object.entries(days).map(([day, items]) => (
                               <div key={day} className="mb-8">
                                   {/* Level 2 Group: Day Header (Timeline Node) */}
                                   <div className="relative pl-8 mb-2 flex items-center">
                                       {/* Purple Sphere Node */}
                                       <div className="absolute -left-[6px] w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#d28eff] to-[#7e22ce] border-2 border-[#0f0f11] z-10 shadow-[0_0_8px_rgba(165,64,255,0.6)]"></div>
                                       <span className="text-sm font-bold text-gray-400">{day}</span>
                                   </div>

                                   {/* Items Loop */}
                                   <div className="space-y-0 pl-8">
                                       {items.map(item => {
                                            if (item.type === 'levelup') {
                                                // Critical Event: Level Up
                                                return (
                                                    <div key={item.id} className="relative mb-4 mt-2">
                                                         {/* Level Up Banner - Timestamp removed */}
                                                         <div className="w-full bg-gradient-to-r from-yellow-500/20 to-transparent border-l-4 border-l-yellow-500 p-4 rounded-r-xl flex items-center justify-between">
                                                             <div className="flex items-center gap-3">
                                                                 <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50">
                                                                     <TrendingUp className="w-6 h-6 text-yellow-500" />
                                                                 </div>
                                                                 <div>
                                                                     <div className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Milestone Reached</div>
                                                                     <div className="text-white font-bold text-lg">Upgraded to Level {item.level}</div>
                                                                 </div>
                                                             </div>
                                                         </div>
                                                    </div>
                                                );
                                            } else {
                                                // Regular Contribution - List Style
                                                return (
                                                    <div key={item.id} className="relative py-3 border-b border-white/5 last:border-0">
                                                         <div className="flex items-start justify-between">
                                                             <div className="flex items-center gap-3">
                                                                 <img src={item.user?.avatar} alt={item.user?.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                                                 <div>
                                                                     <div className="text-[13px] text-white font-bold">{item.user?.name}</div>
                                                                     <div className="text-[11px] text-gray-400 mt-0.5">{item.action}</div>
                                                                 </div>
                                                             </div>
                                                             
                                                             <div className="text-right">
                                                                 <div className="flex items-center gap-1 justify-end">
                                                                     <Trophy className="w-3 h-3 text-yellow-500" />
                                                                     <span className="text-xs font-bold text-yellow-500">+{item.xp}</span>
                                                                 </div>
                                                                 <div className="text-[10px] text-gray-600 mt-1 font-medium">{item.timeDisplay}</div>
                                                             </div>
                                                         </div>
                                                    </div>
                                                );
                                            }
                                       })}
                                   </div>
                               </div>
                           ))}
                       </div>
                   ))}

                   {/* Start Node */}
                   <div className="relative pl-8 pb-4">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-gray-600 border-2 border-[#0f0f11] z-10"></div>
                        <div className="text-xs text-gray-600 italic">History started...</div>
                   </div>

               </div>
          </div>
      </div>
    );
};

export const FamilyView: React.FC<FamilyViewProps> = ({ onBack, initialTab = 'home' }) => {
  const FAMILY_AVATAR = "https://image.pollinations.ai/prompt/Esports%20team%20logo%20shield%20purple%20lion?width=100&height=100&seed=45&nologo=true";
  const HEADER_BG = "https://img.jacocdn.com/large/3b9ae203la1i8yryvrmrxj20rs0rpnpd.jpg";

  const [activeTab, setActiveTab] = useState<FamilyTabType>(initialTab);
  const [showHistory, setShowHistory] = useState(false); // New state for history page
  const [isManageSubPageOpen, setIsManageSubPageOpen] = useState(false);
  
  const [filter, setFilter] = useState<FilterType>('Total');
  const [visibleCount, setVisibleCount] = useState(20);
  
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

  // Experience State
  const [familyExp, setFamilyExp] = useState(14500);
  const MAX_EXP = 20000;
  
  // Animation Refs & State
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [flyingParticle, setFlyingParticle] = useState<{ startX: number, startY: number, endX: number, endY: number } | null>(null);
  const [expBubble, setExpBubble] = useState<{ show: boolean, value: number, leftPercent: number } | null>(null);

  // Task State
  const [myTasks, setMyTasks] = useState<Task[]>(INITIAL_MY_TASKS);
  
  // Calculate unclaimed tasks count
  const unclaimedCount = myTasks.filter(t => t.status === 'claim').length;

  // Handle Back Navigation
  const handleBack = () => {
      if (showHistory) {
          setShowHistory(false);
      } else {
          onBack();
      }
  };

  const handleClaim = (task: Task, e: React.MouseEvent) => {
      // 1. Calculate Coordinates
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;

      let endX = startX;
      let endY = 0;

      if (progressBarRef.current) {
          const barRect = progressBarRef.current.getBoundingClientRect();
          endX = barRect.left + barRect.width / 2; // Target center of bar
          endY = barRect.top + barRect.height / 2;
      }

      // 2. Trigger Flying Particle
      setFlyingParticle({ startX, startY, endX, endY });
      
      const expReward = task.rewards.find(r => r.type === 'exp')?.value || 0;

      // 3. Timing Sequence
      
      // End flight logic
      setTimeout(() => {
          setFlyingParticle(null);

          // Update Experience (Grow Bar)
          if (expReward > 0) {
             const newExp = Math.min(familyExp + expReward, MAX_EXP);
             
             // Calculate percentage for bubble position
             const percent = (newExp / MAX_EXP) * 100;

             setFamilyExp(newExp);
             
             // Show Bubble at the tip
             setExpBubble({ show: true, value: expReward, leftPercent: percent });

             // Hide Bubble after 1.5s
             setTimeout(() => setExpBubble(null), 1500);
          }
      }, 800); // Flight duration

      // 4. Mark Task Done & Reorder (Delayed to let animation finish)
      setTimeout(() => {
          setMyTasks(prev => {
              // Mark as done
              const updated = prev.map(t => 
                  t.id === task.id ? { ...t, status: 'done' as TaskStatus } : t
              );
              // Sort: Active first, Done last
              return updated.sort((a, b) => {
                  const aDone = a.status === 'done';
                  const bDone = b.status === 'done';
                  if (aDone === bDone) return 0;
                  return aDone ? 1 : -1;
              });
          });
      }, 2000);
  };

  // Generate extended mock data
  const allMembers = useMemo(() => {
    const roles = ['Member', 'Streamer', 'Supporter', 'Speaker', 'Admin'];
    const baseMembers = [
      { id: 1, name: "Ahmed_Live", role: "Tribe Chief", contributionTotal: "1.2M", contributionMonth: "300K", contributionWeek: "50K", avatar: "https://image.pollinations.ai/prompt/Handsome%20Saudi%20Arab%20man%20streamer%20wearing%20red%20shemagh%20headset%20talking%20microphone%20professional%20gaming%20studio%20purple%20lighting?width=800&height=1000&seed=88&nologo=true" },
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

  // Filter and Slice Logic
  const displayMembers = useMemo(() => {
    // Sort logic could go here based on filter value if real numbers were used
    // For now we just return the list and map the display value
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

  // Limited to 3 heroes, unified gold theme based on top 3 fixed members
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

  // Render Experience Panel Function (Reusable)
  const renderExperiencePanel = () => (
    <div 
        onClick={() => setShowHistory(true)}
        className="w-full max-w-[340px] relative mt-4 group mx-auto mb-6 cursor-pointer active:scale-95 transition-transform duration-200"
    >
        
        {/* Glass Container */}
        <div className="relative z-10 bg-gradient-to-br from-[#4a4a4f]/50 via-[#262629]/40 to-black/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
            
            {/* Subtle Inner Highlight/Shine */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-50"></div>

            {/* Top Right Arrow */}
            <div className="absolute top-4 right-4 text-gray-400 group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
            </div>
            
            {/* Progress Bar Header */}
            <div className="relative flex justify-between text-xs text-gray-200 mb-3 font-medium">
                <span className="flex items-center gap-1.5 drop-shadow-md"><Trophy className="w-3.5 h-3.5 text-yellow-500" /> Current Exp</span>
                <span className="text-white font-bold drop-shadow-md pr-6">{familyExp.toLocaleString()} <span className="text-gray-400 font-normal">/ {MAX_EXP.toLocaleString()}</span></span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="relative h-2.5 w-full bg-black/50 rounded-full border border-white/5 mb-4 shadow-inner">
                {/* Active Progress */}
                <div 
                    ref={progressBarRef}
                    className="h-full bg-gradient-to-r from-[#A540FF] to-purple-400 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all duration-1000 ease-out relative"
                    style={{ width: `${Math.min((familyExp / MAX_EXP) * 100, 100)}%` }}
                >
                     {/* Pop-out Bubble */}
                     {expBubble && expBubble.show && (
                         <div className="absolute right-0 top-0 -translate-y-[140%] translate-x-1/2 flex flex-col items-center animate-in zoom-in slide-in-from-bottom-2 duration-300">
                             <div className="bg-[#A540FF] text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg whitespace-nowrap border border-white/20">
                                 +{expBubble.value} Exp
                             </div>
                             {/* Triangle arrow */}
                             <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#A540FF]"></div>
                         </div>
                     )}
                </div>
            </div>
            
            {/* Unlock Text */}
            <div className="relative text-[11px] text-center text-gray-300 mb-5 font-medium drop-shadow-sm">
                <span className="text-white font-bold">{(MAX_EXP - familyExp).toLocaleString()} Exp</span> to <span className="text-yellow-500 font-bold">Lv 15</span>. And unlock:
            </div>

            {/* Unlockables Grid - REALISTIC 3D ICONS */}
            <div className="relative grid grid-cols-4 gap-2">
                {/* Badge - 3D Gold Shield */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center shadow-inner backdrop-blur-sm overflow-hidden p-2">
                        <img 
                            src="https://image.pollinations.ai/prompt/3d%20luxury%20gold%20shield%20badge%20icon%20mobile%20game%20ui%20black%20background?width=100&height=100&seed=50&nologo=true" 
                            className="w-full h-full object-contain mix-blend-screen"
                            alt="Badge"
                        />
                    </div>
                    <span className="text-[9px] text-gray-300 font-medium text-center leading-tight">Lv Badge</span>
                </div>
                
                {/* Gold - 3D Coins */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center shadow-inner backdrop-blur-sm overflow-hidden p-2">
                        <img 
                            src="https://image.pollinations.ai/prompt/3d%20stack%20of%20shiny%20gold%20coins%20icon%20game%20ui%20black%20background?width=100&height=100&seed=51&nologo=true"
                            className="w-full h-full object-contain mix-blend-screen"
                            alt="Gold Pack"
                        />
                    </div>
                    <span className="text-[9px] text-gray-300 font-medium text-center leading-tight">Gold Pack</span>
                </div>

                {/* Rename - 3D Blue Pen/Quill */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center shadow-inner backdrop-blur-sm overflow-hidden p-2">
                        <img 
                            src="https://image.pollinations.ai/prompt/3d%20neon%20blue%20quill%20pen%20edit%20icon%20game%20ui%20black%20background?width=100&height=100&seed=52&nologo=true"
                            className="w-full h-full object-contain mix-blend-screen"
                            alt="Rename"
                        />
                    </div>
                    <span className="text-[9px] text-gray-300 font-medium text-center leading-tight">Rename</span>
                </div>

                {/* Limit - 3D Green User Icon */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center shadow-inner backdrop-blur-sm overflow-hidden p-2">
                        <img 
                            src="https://image.pollinations.ai/prompt/3d%20neon%20green%20user%20avatar%20plus%20icon%20game%20ui%20black%20background?width=100&height=100&seed=53&nologo=true"
                            className="w-full h-full object-contain mix-blend-screen"
                            alt="Limit Up"
                        />
                    </div>
                    <span className="text-[9px] text-gray-300 font-medium text-center leading-tight">Limit Up</span>
                </div>
            </div>
        </div>
        
        {/* Outer Glow Effect behind card */}
        <div className="absolute inset-0 bg-purple-500/10 rounded-3xl blur-2xl -z-10"></div>
    </div>
  );

  const renderRankings = () => {
    const data = MOCK_RANKINGS[rankingCategory];
    const top3 = data.slice(0, 3);
    const rest = data.slice(3);
    
    // Sort top 3 for podium display: 2nd, 1st, 3rd
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
            {/* Header - Centered Title & Equal Margins */}
            <div className="sticky top-0 left-0 w-full z-50 py-4 flex items-center justify-between bg-[#0f0f11]/80 backdrop-blur-md px-4 border-b border-white/5 relative">
                <button 
                    onClick={onBack} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition active:scale-95 flex-shrink-0"
                >
                <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                {/* Absolute Centered Title */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#A540FF]" />
                    Tribe Rankings
                </div>
                
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition active:scale-95 flex-shrink-0">
                    <CircleHelp className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* New Horizontal Sliding Tabs */}
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
                            
                            {/* Active Underline Indicator */}
                            {rankingCategory === cat && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-[#A540FF] rounded-t-full shadow-[0_-2px_8px_rgba(165,64,255,0.6)]"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Content Container */}
            <div className="px-4">
                {/* Filter / Timer Row (Conditional) */}
                <div className={`text-xs text-gray-500 mb-6 mt-4 flex justify-between items-center px-1 h-6 transition-all ${rankingCategory === 'Level' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    {rankingCategory !== 'Level' && (
                        <>
                            <span>Refresh in <span className="text-[#A540FF] font-mono font-bold tracking-wide">{formatTime(timeLeft)}</span></span>
                            
                            {/* Functional Dropdown for Time Filter */}
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
                        // idx 0 is 2nd place, idx 1 is 1st place, idx 2 is 3rd place
                        const isFirst = idx === 1;
                        const isSecond = idx === 0;
                        const isThird = idx === 2;
                        
                        return (
                            <div key={item.id} className={`flex flex-col items-center relative flex-1 ${isFirst ? '-mb-4 z-10 mx-2' : ''}`}>
                                {/* Crowns Removed */}

                                {/* Avatar Container */}
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
                                
                                {/* Podium Base Info */}
                                <div className={`mt-3 text-center w-full ${isFirst ? 'mb-4' : ''}`}>
                                    <div className="text-xs font-bold text-white truncate w-full mb-1">{item.name}</div>
                                    
                                    {/* New Details Line for Podium: Level & Members */}
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                         {rankingCategory !== 'Level' && (
                                             <span className="text-[9px] font-bold text-yellow-500 bg-yellow-500/10 px-1 rounded border border-yellow-500/20 whitespace-nowrap">Lv.{item.level}</span>
                                         )}
                                         <span className="text-[9px] text-gray-400 flex items-center gap-0.5 whitespace-nowrap"><Users className="w-2.5 h-2.5"/>{item.members}</span>
                                    </div>

                                    <div className="text-[10px] inline-flex items-center justify-center gap-1 font-bold text-[#A540FF] bg-[#A540FF]/10 px-2.5 py-1 rounded-full border border-[#A540FF]/20 shadow-sm">
                                        {rankingCategory === 'Received' && <Gem className="w-3 h-3" />}
                                        {rankingCategory === 'Supported' && <Coins className="w-3 h-3" />}
                                        {rankingCategory === 'Duration' && <Clock className="w-3 h-3" />}
                                        {rankingCategory === 'PK Wins' && <Swords className="w-3 h-3" />}
                                        {rankingCategory === 'Level' && <Shield className="w-3 h-3" />}
                                        {item.value}
                                    </div>
                                </div>

                                {/* Podium Background Gradient for #1 */}
                                {isFirst && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-500/20 blur-3xl -z-10 rounded-full"></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* List 4+ */}
                <div className="space-y-1">
                    {rest.map((item) => (
                        <div key={item.id} className="flex items-center py-3 px-3 bg-[#1a1a1d]/50 rounded-xl border border-white/5 hover:bg-[#1a1a1d] transition-colors">
                            <div className="w-8 font-bold text-gray-500 text-center">{item.rank}</div>
                            <img src={item.avatar} className="w-10 h-10 rounded-full bg-gray-700 object-cover border border-white/10 mr-3" alt={item.name} />
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm text-white truncate">{item.name}</div>
                                {/* Family Level & Members in List Item */}
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
                                    {rankingCategory === 'Received' && <Gem className="w-3 h-3" />}
                                    {rankingCategory === 'Supported' && <Coins className="w-3 h-3" />}
                                    {item.value}
                                 </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky "My Family" Rank Footer */}
            {/* Positioned above the bottom navigation bar */}
            <div className="fixed bottom-[88px] left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-40 animate-in slide-in-from-bottom-10 duration-500">
                <div className="bg-[#242429] border border-[#A540FF]/30 rounded-2xl p-3 flex items-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Highlight Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#A540FF]/10 to-transparent pointer-events-none"></div>
                    
                    <div className="w-8 font-bold text-white text-center z-10">{myRank.rank}</div>
                    <img src={myRank.avatar} className="w-10 h-10 rounded-full object-cover border border-[#A540FF]/50 mr-3 z-10" alt="Me" />
                    
                    <div className="flex-1 z-10 min-w-0">
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                            {myRank.name}
                            <span className="text-[10px] bg-[#A540FF] text-white px-1.5 rounded font-bold flex-shrink-0">My Tribe</span>
                        </div>
                        {/* My Rank Details */}
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

  const renderContent = () => {
    // Intercept with History View if active
    if (showHistory) {
        return <HistoryView onBack={() => setShowHistory(false)} />;
    }

    if (activeTab === 'home') {
      return (
        <div className="pb-32">
            {/* Background Effect: Blurred Avatar */}
            <div className="absolute top-0 left-0 right-0 h-[500px] z-0 overflow-hidden pointer-events-none">
                <img 
                    src={HEADER_BG} 
                    className="w-full h-full object-cover blur-[5px] scale-110 opacity-80"
                    alt="Background"
                />
                {/* Gradient to smooth transition to body color */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f0f11]/20 to-[#0f0f11]"></div>
            </div>

            {/* Header: Transparent with Back Button and Actions */}
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
                {/* Avatar with Golden Frame */}
                <div className="relative mb-5 transform transition-transform hover:scale-105 duration-300">
                    <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-yellow-600 via-yellow-200 to-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                        <img 
                            src={FAMILY_AVATAR}
                            className="w-full h-full rounded-full object-cover border-4 border-[#1a1a1d]"
                            alt="Family"
                        />
                    </div>
                    {/* Level Badge */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-amber-500 text-white text-xs font-bold px-3 py-0.5 rounded-full border-2 border-[#1a1a1d] shadow-lg flex items-center gap-1 whitespace-nowrap">
                        <Shield className="w-3 h-3 fill-white" />
                        Lv 14
                    </div>
                </div>

                {/* Name & Slogan */}
                <h1 className="text-2xl font-bold text-white mt-2 mb-1 drop-shadow-lg">Royal Lions</h1>
                <p className="text-sm text-gray-200 italic mb-4 font-medium tracking-wide drop-shadow-md">"We roar together, we win together! 🦁"</p>

                {/* Experience Bar & Benefits Card - Using Reusable Function */}
                {renderExperiencePanel()}
            </div>

            {/* Heroes' Hall Section - Redesigned */}
            <div className="px-6 mt-6 relative z-10">
                <div className="flex items-center justify-center mb-8">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-white drop-shadow-md">
                        <Medal className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                        <span className="bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent uppercase tracking-wider">Heroes' Hall</span>
                        <Medal className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                    </h3>
                </div>
                
                {/* Grid for 3 items, spread out, aligned bottom */}
                <div className="flex justify-around items-end gap-2 pb-2">
                    {heroes.map((hero, idx) => (
                        <div key={hero.id} className="flex flex-col items-center relative group">
                            
                            {/* Crown Icon (Top) */}
                            <div className="absolute -top-[22px] z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                <Crown className="w-7 h-7 text-yellow-300 fill-yellow-500" strokeWidth={1.5} />
                            </div>

                            {/* Avatar Container with Unified Gold/Orange Gradient */}
                            <div className="relative w-[72px] h-[72px] mb-2">
                                {/* Glow */}
                                <div className="absolute inset-0 rounded-full bg-yellow-500 opacity-20 blur-md"></div>
                                
                                {/* Frame */}
                                <div className="relative w-full h-full rounded-full p-[3px] bg-gradient-to-b from-yellow-300 via-orange-400 to-yellow-600 shadow-lg">
                                    <div className="w-full h-full rounded-full bg-[#1a1a1d] p-[2px]">
                                        <img src={hero.avatar} className="w-full h-full rounded-full object-cover" alt={hero.name} />
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <span className="text-[11px] font-bold text-white truncate max-w-[90px] mb-1.5 tracking-tight drop-shadow-sm">{hero.name}</span>
                            
                            {/* Unified Title Badge */}
                            <div className="text-[9px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-700 via-amber-700 to-orange-700 border border-orange-500/30 text-orange-100 font-bold uppercase tracking-wider shadow-sm whitespace-nowrap">
                                {hero.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Member List */}
            <div className="px-4 mt-10 relative z-10">
                {/* List Header with Filter */}
                <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                            <Users className="w-5 h-5 text-[#A540FF]" />
                            Members
                        </h3>
                        <span className="text-xs font-medium px-2 py-0.5 bg-white/10 rounded-full text-gray-300">{allMembers.length} / 200</span>
                    </div>
                    
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <select 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as FilterType)}
                            className="appearance-none bg-[#252529] text-white text-xs font-medium pl-3 pr-8 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#A540FF] transition-colors cursor-pointer"
                        >
                            <option value="Total">Total Contrib</option>
                            <option value="Month">Monthly</option>
                            <option value="Week">Weekly</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Member Items */}
                <div className="space-y-2.5">
                    {displayMembers.map((member, index) => (
                        // Removed white border
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
                                    {/* Role Badge - Dynamic Styling */}
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
                                    {/* Changed Star to Trophy to match family exp */}
                                    <Trophy className="w-3 h-3 text-yellow-500" />
                                    {getContributionDisplay(member)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Pagination / Load More */}
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
    } 
    
    if (activeTab === 'tasks') {
        return (
            <div className="pb-32 min-h-screen relative bg-[#0f0f11]">
                 {/* Flying Particle */}
                 {flyingParticle && (
                    <div 
                        className="fixed z-50 pointer-events-none transition-all duration-[800ms] ease-in-out"
                        style={{
                            left: 0,
                            top: 0,
                            transform: `translate(${flyingParticle.startX}px, ${flyingParticle.startY}px)`,
                        }}
                    >
                         {/* This inner div handles the transition to the end position using a keyframe or just standard transition hack */}
                         <div 
                             className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.6)] animate-pulse"
                             ref={(el) => {
                                 if (el) {
                                     // Trigger reflow to ensure start position is set before transitioning
                                     requestAnimationFrame(() => {
                                         el.style.transform = `translate(${flyingParticle.endX - flyingParticle.startX}px, ${flyingParticle.endY - flyingParticle.startY}px) scale(0.5)`;
                                         el.style.opacity = '0';
                                         el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                                     });
                                 }
                             }}
                         >
                            <Trophy className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                         </div>
                    </div>
                 )}

                 {/* Header: Standardized to match Rankings View */}
                <div className="sticky top-0 left-0 w-full z-50 py-4 flex items-center justify-between bg-[#0f0f11]/80 backdrop-blur-md px-4 border-b border-white/5 relative">
                    <button 
                        onClick={onBack} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition active:scale-95 flex-shrink-0"
                    >
                    <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    
                    {/* Absolute Centered Title */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white flex items-center gap-2">
                        <ClipboardCheck className="w-5 h-5 text-[#A540FF]" />
                        Tribe Tasks
                    </div>
                    
                    {/* Help Button */}
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition active:scale-95 flex-shrink-0">
                        <CircleHelp className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Content Container */}
                <div className="px-4 pt-4">
                    {/* Experience Panel for Tasks Page */}
                    {renderExperiencePanel()}

                    {/* My Daily Tasks Module */}
                    <div className="mb-8">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-yellow-500" />
                            My Daily Contribution
                        </h3>
                        <div className="space-y-3">
                            {myTasks.map(task => {
                                const isDone = task.status === 'done';
                                const isClaim = task.status === 'claim';
                                
                                return (
                                    <div 
                                        key={task.id} 
                                        className={`p-4 rounded-xl flex items-center justify-between border transition-all duration-300 ${
                                            isDone 
                                                ? 'bg-[#111a14] border-white/5'  // Subtle dark green/black
                                                : 'bg-[#1a1a1d] border-white/5'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                                isDone ? 'bg-emerald-900/20' : 'bg-white/5 ' + task.color
                                            }`}>
                                                <task.icon className={`w-5 h-5 ${isDone ? 'text-emerald-700' : ''}`} />
                                            </div>
                                            <div>
                                                <div className={`font-bold text-sm ${isDone ? 'text-gray-500' : 'text-white'}`}>{task.title}</div>
                                                <div className={`text-[11px] mb-1.5 ${isDone ? 'text-gray-600' : 'text-gray-500'}`}>{task.desc}</div>
                                                
                                                {/* Rewards Capsules */}
                                                <div className="flex gap-1.5 flex-wrap">
                                                    {task.rewards.map((reward, i) => (
                                                        <div key={i} className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                            isDone 
                                                                ? 'bg-emerald-900/10 text-emerald-700 opacity-60' // Dimmed style for done
                                                                : reward.type === 'exp' 
                                                                    ? 'bg-yellow-500/10 text-yellow-500' 
                                                                    : 'bg-blue-500/10 text-blue-400'
                                                        }`}>
                                                            <reward.icon className="w-3 h-3" fill={reward.type === 'exp' ? "currentColor" : "none"} />
                                                            +{reward.value} {reward.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Action Button */}
                                        {isDone ? (
                                            <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center border border-[#10b981]/50">
                                                <Check className="w-5 h-5 text-[#10b981]" strokeWidth={3} />
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={(e) => isClaim && handleClaim(task, e)}
                                                disabled={!isClaim}
                                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all min-w-[70px] text-center ${
                                                    task.status === 'go' 
                                                        ? 'bg-[#A540FF] text-white hover:bg-[#9333ea]' 
                                                        : 'bg-yellow-500 text-black hover:bg-yellow-400 animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                                                }`}
                                            >
                                                {task.status === 'go' ? 'Go' : 'Claim'}
                                                {task.status === 'go' && task.id !== 4 && <span className="ml-1 opacity-70">({task.current}/{task.target})</span>}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Family Tasks Module */}
                    <div>
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            Tribe Goals
                        </h3>
                        <div className="space-y-4">
                            {FAMILY_TASKS.map(task => {
                                const percent = Math.min((task.current / task.target) * 100, 100);
                                return (
                                    <div key={task.id} className="bg-[#1a1a1d] p-4 rounded-xl border border-white/5 relative overflow-hidden">
                                         {/* Background Gradient for subtle effect */}
                                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                            <Users className="w-32 h-32 text-white" />
                                        </div>

                                        <div className="flex justify-between items-start mb-3 relative z-10">
                                            <div>
                                                <div className="font-bold text-white mb-1">{task.title}</div>
                                                <div className="text-[10px] text-gray-400 flex items-center gap-2">
                                                    <span>Reward:</span>
                                                    {/* Unified Exp Icon to Trophy */}
                                                    <span className="text-yellow-500 font-bold flex items-center gap-1">
                                                        <Trophy className="w-3 h-3" fill="currentColor" />
                                                        {task.reward} Exp
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xl font-bold text-[#A540FF]">{task.current.toLocaleString()}</span>
                                                <span className="text-xs text-gray-500">/{task.target.toLocaleString()} {task.unit}</span>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="h-2 w-full bg-black/50 rounded-full mb-4 relative z-10 overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-blue-500 to-[#A540FF] rounded-full transition-all duration-1000"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>

                                        {/* Contributors */}
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="text-[10px] text-gray-500 font-medium">They contributed</div>
                                            <div className="flex -space-x-2">
                                                {task.contributors.map((avatar, idx) => (
                                                    <img 
                                                        key={idx} 
                                                        src={avatar} 
                                                        className="w-6 h-6 rounded-full border border-[#1a1a1d] object-cover" 
                                                        alt="Contributor" 
                                                    />
                                                ))}
                                                {task.contributors.length >= 4 && (
                                                    <div className="w-6 h-6 rounded-full bg-white/10 border border-[#1a1a1d] flex items-center justify-center text-white">
                                                        <MoreHorizontal className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Rankings View
    if (activeTab === 'rankings') {
        return renderRankings();
    }

    if (activeTab === 'events') {
        return (
            <div className="pb-32 min-h-screen relative bg-[#0f0f11]">
                 {/* Header */}
                <div className="sticky top-0 left-0 w-full z-50 py-4 flex items-center justify-between bg-[#0f0f11]/80 backdrop-blur-md px-4 border-b border-white/5 relative">
                    <button 
                        onClick={handleBack} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition active:scale-95 flex-shrink-0"
                    >
                    <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#A540FF]" />
                        Official Events
                    </div>
                    
                    {/* Placeholder div to keep title centered since Share button is removed */}
                    <div className="w-10"></div>
                </div>

                {/* Content Container */}
                <div className="px-4 pt-4 space-y-4">
                    {FAMILY_EVENTS.map(event => (
                        <div key={event.id} className="w-full rounded-2xl overflow-hidden shadow-lg border border-white/5 relative group">
                            
                            {/* Card Header Image - Adjusted Ratio to 4:3 (Shortened by approx 15-20% from square) */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                <img 
                                    src={event.image} 
                                    alt={event.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Overlay Removed as requested */}
                                
                                {/* Tag - Unified Color per Tag Text */}
                                <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold text-white bg-gradient-to-r ${event.tagColor} shadow-lg uppercase tracking-wider`}>
                                    {event.tag}
                                </div>

                                {/* Pagination Dots Removed as requested */}
                            </div>

                            {/* Card Content Body - Dynamic Background based on Card Theme */}
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
                    
                    {/* Bottom Padding */}
                    <div className="h-6"></div>
                </div>
            </div>
        );
    }

    if (activeTab === 'manage') {
        return <FamilyManage onBack={handleBack} onSubPageChange={setIsManageSubPageOpen} />;
    }

    return null;
  };

  return (
    <div className="w-full min-h-screen bg-[#0f0f11] text-white relative overflow-x-hidden animate-in slide-in-from-right duration-300">
      
      {/* Content Renderer */}
      {renderContent()}

      {/* Floating Bottom Navigation (iOS Style) - Hide if History is showing OR in manage sub-page */}
      {!showHistory && !(activeTab === 'manage' && isManageSubPageOpen) && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[420px] z-50">
             <div className="bg-[#0f0f11]/25 backdrop-blur-3xl border border-white/10 rounded-[32px] grid grid-cols-5 px-2 gap-2 items-center py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] ring-1 ring-white/5">
                 <NavButton 
                    icon={Home} 
                    label="Home" 
                    active={activeTab === 'home'} 
                    onClick={() => setActiveTab('home')} 
                 />
                 <NavButton 
                    icon={ClipboardCheck} 
                    label="Tasks" 
                    active={activeTab === 'tasks'} 
                    onClick={() => setActiveTab('tasks')} 
                    badge={unclaimedCount}
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
                 <NavButton 
                    icon={MoreHorizontal} 
                    label="More" 
                    active={activeTab === 'manage'} 
                    onClick={() => setActiveTab('manage')} 
                 />
             </div>
          </div>
      )}

    </div>
  );
};

// Helper Component for Navigation Buttons
const NavButton = ({ icon: Icon, label, active, onClick, badge }: { icon: any, label: string, active: boolean, onClick: () => void, badge?: number }) => (
    <button 
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center w-full h-12 rounded-2xl transition-all duration-300 group`}
    >
        {/* Background removed as requested */}
        {badge !== undefined && badge > 0 && (
             <div className="absolute top-0 right-1/4 translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-[#1a1a1d] flex items-center justify-center text-[9px] font-bold text-white z-10">
                {badge}
             </div>
        )}
        
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