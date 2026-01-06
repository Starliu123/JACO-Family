import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Plus, Flame, Gift, MessageCircle, Share2, Gamepad2, LayoutGrid, 
  Link, Mic, Video, Heart, Send, User, Coffee, MoreHorizontal, Check, Gem, ChevronRight,
  Shield, Crown
} from 'lucide-react';
import { Stream } from '../types';
import { FamilyGuestView } from './FamilyGuestView';
import { GuestProfileView } from './GuestProfileView';

interface LiveRoomProps {
  stream: Stream;
  onClose: () => void;
}

interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  text: string;
  type?: 'gift' | 'chat';
  giftCount?: number;
}

const DUMMY_COMMENTS = [
  "Wow, this is amazing! 😍",
  "Hello from Riyadh! 🇸🇦",
  "Can you say hi to my friend?",
  "Sent Rose x1",
  "Love the vibes here ✨",
  "What game are you playing later?",
  "Sent Rose x14"
];

const VIEWER_AVATARS = [
  "https://image.pollinations.ai/prompt/avatar1?width=50&height=50&nologo=true",
  "https://image.pollinations.ai/prompt/avatar2?width=50&height=50&nologo=true",
  "https://image.pollinations.ai/prompt/avatar3?width=50&height=50&nologo=true"
];

// --- Sub-Component: User Profile Modal ---
const UserProfileModal = ({ user, onClose, onFamilyClick, onProfileClick }: { user: any, onClose: () => void, onFamilyClick: () => void, onProfileClick: () => void }) => {
    return (
        <div className="absolute inset-0 z-[200] flex flex-col justify-end isolate">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" 
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative w-full bg-[#18181b] rounded-t-[32px] p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl border-t border-white/5">
                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-gray-600/40 rounded-full mx-auto mb-6"></div>
                
                {/* Header Section: Avatar + Info (Clickable) */}
                <div 
                    className="flex items-start gap-4 mb-6 cursor-pointer group"
                    onClick={onProfileClick}
                >
                     {/* Avatar */}
                     <div className="relative flex-shrink-0">
                         <img 
                            src={user.avatar || user.thumbnail}
                            className="w-20 h-20 rounded-full object-cover border-[3px] border-[#18181b] shadow-lg group-active:scale-95 transition-transform" 
                            alt="Profile"
                         />
                         {/* Streamer Tag Overlay */}
                         <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-full text-[9px] text-white font-bold whitespace-nowrap z-10 shadow-sm">
                            Streamer
                         </div>
                     </div>

                     {/* Info Column */}
                     <div className="flex flex-col pt-1 gap-1 flex-1 min-w-0 pl-1 group-active:opacity-80 transition-opacity">
                        {/* Line 1: Name + Verified */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                             <h2 className="text-xl font-bold text-white leading-tight">
                                {user.user?.name || "Ahmed Mohammed"}
                            </h2>
                            {/* Verified Badge */}
                            <div className="bg-[#A540FF] rounded-full p-0.5 flex-shrink-0">
                                <Check className="w-3 h-3 text-white" strokeWidth={4} />
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                        </div>

                        {/* Line 2: Username */}
                        <div className="text-gray-400 text-xs font-medium">@Nnn</div>

                        {/* Line 3: Level + Tags */}
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                             {/* Level Image */}
                             <img 
                                src="https://img.jacocdn.com/large/3b9ae203la1i8yp02pfakj201f00mt8i.jpg" 
                                alt="Level 57" 
                                className="h-4 w-auto object-contain drop-shadow-md"
                             />
                             
                             {/* Creator Tag - Scaled Down */}
                             <div className="bg-white/5 border border-white/5 rounded px-1.5 py-0.5 flex items-center gap-1">
                                 <div className="bg-purple-500 rounded-full p-[1px]">
                                    <Check className="w-1.5 h-1.5 text-white" strokeWidth={3} />
                                 </div>
                                 <span className="text-[8px] text-gray-300 font-bold uppercase tracking-wide">CREATOR</span>
                            </div>

                            {/* Gender Tag - Scaled Down */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded px-1.5 py-0.5 flex items-center justify-center">
                                <span className="text-[9px] text-blue-400 font-bold">♂</span>
                            </div>

                            {/* Snapchat Tag - Scaled Down */}
                            <div className="bg-white/5 border border-white/5 rounded px-1.5 py-0.5 flex items-center gap-1">
                                 <span className="text-[8px] text-gray-300 font-bold">👻 Snap</span>
                            </div>
                        </div>
                     </div>

                     {/* More Button (Top Right) */}
                     <button 
                        onClick={(e) => { e.stopPropagation(); }} 
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
                     >
                        <MoreHorizontal className="w-5 h-5" />
                     </button>
                </div>

                {/* Stats & Follow Button */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-6">
                        <div className="flex flex-col">
                            <span className="text-base font-bold text-white leading-none">4460</span>
                            <span className="text-[10px] text-gray-500 mt-1 font-medium">Following</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-bold text-white leading-none">405.4K</span>
                            <span className="text-[10px] text-gray-500 mt-1 font-medium">Followers</span>
                        </div>
                    </div>
                    
                    <button className="bg-[#A540FF] hover:bg-[#9333ea] active:scale-95 transition-all text-white h-8 px-6 rounded-full font-bold text-xs shadow-lg shadow-purple-900/20 flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" strokeWidth={3} /> Follow
                    </button>
                </div>
                
                {/* Family Entry Card */}
                <div className="w-full mb-4">
                     {/* Added Watermark and Styling */}
                     <div 
                        onClick={onFamilyClick}
                        className="relative bg-gradient-to-r from-[#1e1e24] to-[#121214] border border-white/10 rounded-xl p-3 flex items-center justify-between shadow-md active:opacity-90 transition-all cursor-pointer group overflow-hidden"
                     >
                        
                        {/* Graphical Watermark (Shield) */}
                        <div className="absolute -right-3 -bottom-6 pointer-events-none opacity-10 transform rotate-[-15deg]">
                             <Shield className="w-24 h-24 text-white fill-white" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex items-center gap-3 z-10 relative">
                            <div className="relative">
                                 <img 
                                    src="https://image.pollinations.ai/prompt/Esports%20team%20logo%20shield%20purple%20lion?width=100&height=100&seed=45&nologo=true"
                                    className="w-11 h-11 rounded-xl object-cover border border-white/10 shadow-sm" 
                                    alt="Family"
                                 />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white tracking-wide">Royal Lions</span>
                                    <span className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/10 text-yellow-500 text-[8px] px-1.5 py-0.5 rounded border border-yellow-500/20 font-bold flex items-center shadow-sm">
                                        Lv.14
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                                     <span>154 Members</span>
                                     <span className="w-0.5 h-0.5 rounded-full bg-gray-600"></span>
                                     <span className="text-[#A540FF] flex items-center gap-1">
                                        <Crown className="w-3 h-3 fill-[#A540FF]" />
                                        Chief
                                     </span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors z-10" />
                     </div>
                </div>

                {/* Badge Gallery Image */}
                <div className="w-full">
                     <img 
                        src="https://img.jacocdn.com/large/3b9ae203la1i8yp1jt49gj20ag02v0u4.jpg" 
                        className="w-full h-auto rounded-xl object-cover"
                        alt="Badge Gallery"
                     />
                </div>
            </div>
        </div>
    )
}

// --- Main Component ---

export const LiveRoom: React.FC<LiveRoomProps> = ({ stream, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, user: "Armin Arlert", avatar: VIEWER_AVATARS[0], text: "sent Rose", type: 'gift', giftCount: 1 },
    { id: 2, user: "Armin Arlert", avatar: VIEWER_AVATARS[0], text: "sent Rose", type: 'gift', giftCount: 14 },
    { id: 3, user: "Omar Korsgaard", avatar: VIEWER_AVATARS[1], text: "sdcsfcsfe dfvd dswedewgh ghnghn", type: 'chat' },
    { id: 4, user: "Jordyn Carder", avatar: VIEWER_AVATARS[2], text: "Lorem ipsum dolor sit amet consectetur. Est nibh placerat suscipit vel.", type: 'chat' },
    { id: 5, user: "Marilyn Passaquindici", avatar: VIEWER_AVATARS[0], text: "@Madelyn Lorem ipsum dolor sit amet consectetur.", type: 'chat' }
  ]);
  
  const [joinNotification, setJoinNotification] = useState<string | null>("Angel Vetrovs joined");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showGuestFamily, setShowGuestFamily] = useState(false);
  const [showGuestProfile, setShowGuestProfile] = useState(false); // New state for Guest Profile View
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate incoming chat/gifts
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = DUMMY_COMMENTS[Math.floor(Math.random() * DUMMY_COMMENTS.length)];
      const isGift = randomMsg.includes("Sent");
      
      const newMsg: ChatMessage = {
        id: Date.now(),
        user: `User_${Math.floor(Math.random() * 1000)}`,
        avatar: `https://image.pollinations.ai/prompt/avatar${Math.floor(Math.random() * 100)}?width=50&height=50&nologo=true`,
        text: randomMsg,
        type: isGift ? 'gift' : 'chat',
        giftCount: isGift ? Math.floor(Math.random() * 10) + 1 : undefined
      };

      setMessages(prev => [...prev.slice(-10), newMsg]);
      
      if (Math.random() > 0.7) {
        setJoinNotification(`User_${Math.floor(Math.random() * 999)} joined`);
        setTimeout(() => setJoinNotification(null), 3000);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-[100] bg-black text-white overflow-hidden animate-in zoom-in-95 duration-300">
      
      {/* Guest Family View (Full Overlay) */}
      {showGuestFamily && (
          <div className="absolute inset-0 z-[300]">
              <FamilyGuestView onBack={() => setShowGuestFamily(false)} />
          </div>
      )}

      {/* Guest Profile View (Full Overlay) */}
      {showGuestProfile && (
          <div className="absolute inset-0 z-[300]">
              <GuestProfileView 
                  user={stream}
                  onBack={() => setShowGuestProfile(false)}
                  onNavigateToFamily={() => setShowGuestFamily(true)}
              />
          </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
          <UserProfileModal 
             user={stream} 
             onClose={() => setShowProfileModal(false)} 
             onFamilyClick={() => setShowGuestFamily(true)}
             onProfileClick={() => {
                 setShowProfileModal(false);
                 setShowGuestProfile(true);
             }}
          />
      )}

      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={stream.thumbnail} 
          className="w-full h-full object-cover opacity-60 blur-sm" 
          alt="bg" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between pb-6 pt-4 px-4">
        
        {/* --- Top Header Area --- */}
        <div className="flex flex-col gap-2">
            {/* Top Row: Profile & Viewers */}
            <div className="flex items-start justify-between">
                
                {/* Host Profile Capsule */}
                <button 
                    onClick={() => setShowProfileModal(true)}
                    className="flex items-center bg-black/40 backdrop-blur-md rounded-full p-1 pr-4 border border-white/10 active:scale-95 transition-transform"
                >
                    <div className="relative w-9 h-9 mr-2">
                        <img 
                            src={stream.thumbnail} 
                            className="w-full h-full rounded-full object-cover border border-white/20"
                            alt="Host" 
                        />
                        {/* Verified badge or level could go here */}
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-white max-w-[80px] truncate">{stream.user.name}</span>
                        <div className="flex items-center text-[10px] text-gray-300">
                            <Heart className="w-3 h-3 text-red-500 fill-red-500 mr-1" />
                            {stream.likeCount || '1232'}
                        </div>
                    </div>
                    <div className="ml-3 bg-[#A540FF] rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-[#9333ea]">
                        <Plus className="w-4 h-4 text-white" />
                    </div>
                </button>

                {/* Right Side: Viewers & Close */}
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {VIEWER_AVATARS.map((av, i) => (
                            <img key={i} src={av} className="w-8 h-8 rounded-full border border-black" alt="viewer" />
                        ))}
                    </div>
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold border border-white/10">
                        {stream.viewCount || '2126'}
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-black/20 hover:bg-white/10 transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>
            </div>

            {/* Second Row: Badges & Gift Goal */}
            <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                    {/* Hourly Rank */}
                    <div className="flex items-center bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm">
                        <Flame className="w-3 h-3 fill-white mr-1" />
                        Top 1 Hourly
                    </div>
                    {/* Popular Rank */}
                    <div className="flex items-center bg-gray-700/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] font-bold border border-white/10 text-gray-200">
                        <Flame className="w-3 h-3 text-gray-400 mr-1" />
                        Popular 4
                    </div>
                </div>

                {/* Gift Goal Pill */}
                <div className="flex items-center bg-black/40 backdrop-blur-sm rounded-full pl-3 pr-1 py-1 text-[10px] border border-white/10">
                    <div className="flex flex-col mr-2 items-end">
                        <span className="font-bold text-gray-300 leading-none">Gift Name</span>
                        <span className="text-white font-bold leading-none mt-0.5">0/50</span>
                    </div>
                    <div className="w-7 h-7 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-500/50">
                        <Coffee className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="ml-1 bg-black/50 px-1 rounded text-[8px] font-mono text-gray-400">00:30</div>
                </div>
            </div>
        </div>

        {/* --- Bottom Area --- */}
        <div className="flex flex-col w-full relative">
            
            {/* Chat Messages */}
            <div 
                ref={scrollRef}
                className="w-[75%] max-h-60 overflow-y-auto no-scrollbar space-y-2 mb-4 mask-image-b"
            >
                {messages.map((msg) => (
                    <div key={msg.id} className="animate-in slide-in-from-left duration-300 fade-in-0">
                        {msg.type === 'gift' ? (
                            <div className="flex items-center bg-gradient-to-r from-blue-900/60 to-transparent rounded-full p-1 pr-4 w-fit border-l-2 border-blue-400">
                                <img src={msg.avatar} className="w-8 h-8 rounded-full border border-white/20 mr-2" alt={msg.user} />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white">{msg.user}</span>
                                    <span className="text-[10px] text-blue-200">{msg.text}</span>
                                </div>
                                <div className="ml-2 text-xl font-bold italic text-white drop-shadow-lg flex items-center">
                                    <img src="https://em-content.zobj.net/source/microsoft-teams/337/rose_1f339.png" className="w-6 h-6 mr-1" alt="rose" />
                                    x{msg.giftCount}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-black/30 backdrop-blur-[2px] rounded-[18px] px-3 py-2 w-fit max-w-full mb-1 flex items-start gap-2 shadow-sm">
                                {/* Level Badge Simulator */}
                                <div className="mt-0.5 bg-indigo-500 text-[8px] font-bold px-1 rounded h-3.5 flex items-center justify-center min-w-[20px]">
                                    {Math.floor(Math.random() * 20) + 1}
                                </div>
                                
                                <div className="text-[13px] leading-tight text-white/90">
                                    <span className="text-white/60 font-bold mr-1.5">{msg.user}</span>
                                    <span className="text-white/90 drop-shadow-sm">{msg.text}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Notifications (Joined) */}
            {joinNotification && (
                <div className="mb-4 animate-in slide-in-from-left duration-300 fade-out duration-1000">
                    <div className="bg-gradient-to-r from-purple-500/20 to-transparent backdrop-blur-md rounded-full px-3 py-1.5 inline-flex items-center gap-2 border-l-2 border-[#A540FF]">
                        <span className="text-xs font-bold text-white shadow-black drop-shadow-md">{joinNotification}</span>
                    </div>
                </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                    {/* Host Icon */}
                    <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors">
                         <Link className="w-5 h-5 text-[#A540FF]" />
                    </button>
                    {/* Guest/Chat Icon */}
                    <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-colors">
                        <MessageCircle className="w-5 h-5 text-yellow-500" />
                    </button>
                    {/* Input Placeholder */}
                    <div className="h-10 px-4 rounded-full bg-black/20 backdrop-blur-md flex items-center text-gray-400 text-sm w-32 border border-white/5">
                        Say hi...
                    </div>
                </div>

                <div className="flex items-center gap-3">
                     {/* Gamepad */}
                     <button className="flex flex-col items-center gap-0.5">
                        <Gamepad2 className="w-6 h-6 text-white drop-shadow-md" />
                        <span className="text-[9px] font-medium text-white/80">Intera...</span>
                     </button>
                     
                     {/* Grid/More */}
                     <button className="flex flex-col items-center gap-0.5">
                        <LayoutGrid className="w-6 h-6 text-white drop-shadow-md" />
                        <span className="text-[9px] font-medium text-white/80">More</span>
                     </button>

                     {/* Share */}
                     <button className="flex flex-col items-center gap-0.5">
                        <Share2 className="w-6 h-6 text-white drop-shadow-md" />
                        <span className="text-[9px] font-medium text-white/80">Share</span>
                     </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};