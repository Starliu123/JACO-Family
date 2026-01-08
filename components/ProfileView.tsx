import React, { useState, useEffect } from 'react';
import { Settings, Share2, MessageCircle, Edit3, ChevronRight, Wallet, DollarSign, Gift, Pin, Play, Hexagon, Shield, Swords, Users, Plus, CircleHelp } from 'lucide-react';

const TASKS = [
    "Start a live stream",
    "Stream 20+ mins", 
    "Schedule next stream"
];

interface ProfileViewProps {
    onNavigateToFamily?: () => void;
    onNavigateToFamilyTasks?: () => void;
    onNavigateToFamilyGuest?: (initialView?: 'home' | 'benefits') => void; // Updated signature
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigateToFamily, onNavigateToFamilyTasks, onNavigateToFamilyGuest }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [hasFamily, setHasFamily] = useState(true); // State to simulate family membership

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentTaskIndex((prev) => (prev + 1) % TASKS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0f0f11] text-white pb-24 relative overflow-x-hidden">
        {/* Hero / Background Image Area */}
        <div className="relative h-[420px] w-full">
            <img 
                src="https://image.pollinations.ai/prompt/Handsome%20Saudi%20Arab%20man%20streamer%20wearing%20red%20shemagh%20headset%20talking%20microphone%20professional%20gaming%20studio%20purple%20lighting?width=800&height=1000&seed=88&nologo=true" 
                className="w-full h-full object-cover"
                alt="Profile Background"
            />
            
            {/* Gradient Overlays: Adjusted for maximum text readability */}
            {/* Top vignetting removed to clarify image as requested */}
            
            {/* Bottom heavy gradient: Restricted height to only cover text area */}
            <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/90 via-50% to-transparent"></div>
            
            {/* Top Navigation Icons */}
            <div className="absolute top-0 left-0 right-0 px-4 py-3 flex justify-between items-center z-20">
                {/* SETTINGS BUTTON: Toggles Family State for Demo */}
                <button 
                    onClick={() => setHasFamily(!hasFamily)}
                    className="p-2 rounded-full hover:bg-black/20 transition backdrop-blur-sm active:scale-95"
                >
                    <Hexagon className={`w-6 h-6 ${hasFamily ? 'text-white' : 'text-yellow-500'}`} />
                </button>
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-full hover:bg-black/20 transition backdrop-blur-sm"><Share2 className="w-6 h-6 text-white" /></button>
                    <button className="p-2 rounded-full hover:bg-black/20 transition backdrop-blur-sm"><MessageCircle className="w-6 h-6 text-white" /></button>
                </div>
            </div>

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 w-full px-4 pb-2 z-10">
                {/* Name Row */}
                <div className="flex items-center space-x-2 mb-1">
                    <h1 className="text-2xl font-bold tracking-wide text-white drop-shadow-sm">Ahmed_Live</h1>
                    <span className="text-xl">🦅</span>
                    <img 
                        src="https://img.jacocdn.com/large/3b9ae203la1i8yp02pfakj201f00mt8i.jpg" 
                        alt="Level 57" 
                        className="h-5 w-auto object-contain drop-shadow-md"
                    />
                </div>
                
                {/* Handle - Lightened for visibility */}
                <div className="text-gray-200 text-xs mb-4 font-medium drop-shadow-sm">@ 99283712</div>
                
                {/* Stats & Edit Button */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-6">
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-none text-white">402.2K</span>
                            {/* Label Lightened */}
                            <span className="text-[11px] text-gray-300 mt-1 font-medium">Following</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-none text-white">189.2K</span>
                            {/* Label Lightened */}
                            <span className="text-[11px] text-gray-300 mt-1 font-medium">Followers</span>
                        </div>
                    </div>
                    <button className="flex items-center px-4 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm font-medium backdrop-blur-md hover:bg-white/20 transition-colors">
                        <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                        Edit Profile
                    </button>
                </div>

                {/* Tags Row - Unified Style: bg-white/20, rounded-[5px] */}
                <div className="flex items-center space-x-2 mb-3">
                    {/* Tag 1: Creator */}
                    <div className="bg-white/20 text-white text-[10px] pl-1 pr-2 py-1 rounded-[5px] flex items-center font-medium backdrop-blur-sm">
                        <div className="bg-purple-500 rounded-full p-0.5 mr-1.5">
                            <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        JACO CREATOR
                    </div>
                    
                    {/* Tag 2: Gender */}
                    <div className="bg-white/20 text-white px-2.5 py-1 rounded-[5px] text-[10px] flex items-center font-bold backdrop-blur-sm">
                        ♂
                    </div>

                    {/* Tag 3: Snapchat - Removed yellow icon */}
                    <div className="bg-white/20 text-white text-[10px] px-2 py-1 rounded-[5px] flex items-center gap-1.5 font-medium backdrop-blur-sm">
                         Snapchat
                    </div>
                </div>

                {/* Bio */}
                <p className="text-[13px] text-gray-200 leading-relaxed line-clamp-2 pr-4 font-light drop-shadow-sm">
                    Welcome to my stream! Professional gamer and tech enthusiast. Join the squad for daily streams.
                </p>
                
                {/* Pagination Dots - Center Aligned */}
                <div className="flex space-x-1 mt-3 justify-center w-full">
                     <div className="w-1 h-1 rounded-full bg-white shadow-sm"></div>
                     <div className="w-1 h-1 rounded-full bg-white/40 shadow-sm"></div>
                     <div className="w-1 h-1 rounded-full bg-white/40 shadow-sm"></div>
                     <div className="w-1 h-1 rounded-full bg-white/40 shadow-sm"></div>
                </div>
            </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="px-4 space-y-6 mt-4">
            
            {/* LIVE Hub */}
            <div>
                <div className="flex justify-between items-center mb-2.5 px-1">
                    <h3 className="font-bold text-sm text-white">LIVE Hub</h3>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
                {/* Rounded 5px, Removed Border */}
                <div className="bg-[#1a1a1d] rounded-[5px] p-4 flex justify-between items-center shadow-sm">
                    <div>
                        <div className="text-sm font-semibold text-gray-200">No LIVE Schedule yet</div>
                        <div className="text-[11px] text-gray-500 mt-1">Add schedule can get viewers in advance</div>
                    </div>
                    <button className="bg-[#A540FF] hover:bg-[#9333ea] text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors">Add</button>
                </div>
            </div>

             {/* LIVE Data */}
             <div>
                <div className="flex justify-between items-center mb-2.5 px-1">
                    <h3 className="font-bold text-sm text-white">LIVE Data</h3>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                    <DataCard label="Likes" value="171.2B" change="+4%" positive />
                    <DataCard label="Viewers" value="123.4K" change="-2%" />
                    <DataCard label="PCU" value="123.4K" change="-2%" />
                </div>
            </div>

            {/* My Tribe Module (Dynamic State) */}
            <div>
                 <div 
                    className="flex justify-between items-center mb-2.5 px-1 cursor-pointer active:opacity-80 transition-opacity"
                    onClick={hasFamily ? onNavigateToFamily : undefined}
                 >
                    <h3 className="font-bold text-sm text-white">My Tribe</h3>
                    {hasFamily && <ChevronRight className="w-4 h-4 text-gray-500" />}
                </div>
                
                {hasFamily ? (
                    /* STATE A: HAS FAMILY (Existing) */
                    <div className="grid grid-cols-2 gap-2.5 animate-in slide-in-from-right duration-300">
                        {/* Family Card */}
                        <div 
                            className="bg-[#1a1a1d] rounded-[5px] p-3 flex items-center shadow-sm h-20 cursor-pointer active:scale-95 transition-transform"
                            onClick={onNavigateToFamily}
                        >
                            {/* Avatar with Golden Frame */}
                            <div className="relative mr-3 flex-shrink-0">
                                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-yellow-600 via-yellow-200 to-yellow-500 shadow-lg">
                                    <img 
                                        src="https://image.pollinations.ai/prompt/Esports%20team%20logo%20shield%20purple%20lion?width=100&height=100&seed=45&nologo=true"
                                        className="w-full h-full rounded-full object-cover border-2 border-[#1a1a1d]"
                                        alt="Family"
                                    />
                                </div>
                                {/* Level Badge - Smaller Size */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-amber-500 text-white text-[7px] font-bold px-1 py-[1px] rounded-full border border-[#1a1a1d] shadow-sm z-10 whitespace-nowrap">
                                    Lv 14
                                </div>
                            </div>

                            <div className="flex flex-col justify-center">
                                <span className="text-[14px] font-bold text-white leading-tight">Royal Lions</span>
                                <span className="text-[11px] text-gray-500 mt-1">154 Members</span>
                            </div>
                        </div>

                        {/* Tasks Card */}
                        <div 
                            className="bg-[#1a1a1d] rounded-[5px] p-3 flex flex-col justify-between shadow-sm h-20 relative cursor-pointer active:scale-95 transition-transform"
                            onClick={onNavigateToFamilyTasks}
                        >
                            <div className="flex justify-between items-start">
                                 <span className="text-[13px] font-bold text-white">Today's Tasks</span>
                                 {/* Restored Purple Background 2/5 */}
                                 <span className="text-[9px] text-[#A540FF] bg-[#A540FF]/10 px-1.5 py-0.5 rounded font-bold">2/5</span>
                            </div>
                            
                            {/* Task Carousel - Vertical Push Animation */}
                            <div className="mt-auto w-full bg-white/5 rounded-[4px] px-2 py-1.5 relative overflow-hidden h-7">
                                {TASKS.map((task, idx) => {
                                    let positionClass = 'translate-y-full duration-0'; // Default: Waiting at bottom
                                    
                                    if (idx === currentTaskIndex) {
                                        positionClass = 'translate-y-0 duration-500'; // Active
                                    } else if (idx === (currentTaskIndex - 1 + TASKS.length) % TASKS.length) {
                                        positionClass = '-translate-y-full duration-500'; // Exiting to top
                                    }

                                    return (
                                        <div 
                                            key={idx} 
                                            className={`absolute inset-0 flex items-center justify-center transition-transform ease-in-out ${positionClass}`}
                                        >
                                            <span className="text-[10px] text-gray-300 font-medium truncate w-full text-center">
                                                {task}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* STATE B: NO FAMILY (Simplified) */
                    <div 
                        onClick={() => onNavigateToFamilyGuest?.('benefits')}
                        className="bg-[#1a1a1d] rounded-[5px] p-4 flex items-center justify-between cursor-pointer border border-white/5 shadow-sm active:scale-[0.99] transition-transform group animate-in slide-in-from-left duration-300"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <Shield className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white group-hover:text-[#A540FF] transition-colors">Join a Tribe</div>
                                <div className="text-[11px] text-gray-400 mt-0.5">You haven't joined a tribe yet. Tap to learn more.</div>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                )}
            </div>

            {/* Badge Gallery */}
            <div>
                 <h3 className="font-bold text-sm mb-2.5 px-1">Badge Gallery</h3>
                 <img 
                    src="https://img.jacocdn.com/large/3b9ae203la1i8yp1jt49gj20ag02v0u4.jpg" 
                    className="w-full h-auto rounded-xl object-cover"
                    alt="Badge Gallery"
                 />
            </div>

            {/* Management */}
            <div>
                 <h3 className="font-bold text-sm mb-2.5 px-1">Management</h3>
                 <div className="grid grid-cols-3 gap-2.5">
                    <ManagementBtn icon={Wallet} label="Wallet" />
                    <ManagementBtn icon={DollarSign} label="Revenue" />
                    <ManagementBtn icon={Gift} label="Bounty" />
                 </div>
            </div>

             {/* Video Tabs */}
             <div className="mt-8">
                {/* Removed border-b border-white/10 to remove the gray line */}
                <div className="flex space-x-8 px-2">
                    <button className="text-white font-bold text-sm border-b-2 border-white pb-3 px-1">Videos</button>
                    <button className="text-gray-500 font-medium text-sm pb-3 px-1 hover:text-gray-300">Liked</button>
                    <button className="text-gray-500 font-medium text-sm pb-3 px-1 hover:text-gray-300">Favorite</button>
                </div>

                {/* Video Grid - Removed mt-2 (set to mt-0) to close the gap */}
                <div className="grid grid-cols-3 gap-0.5 mt-0 -mx-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <div key={i} className="relative aspect-[3/4] bg-gray-800 group overflow-hidden">
                            <img 
                                src={`https://image.pollinations.ai/prompt/Selfie%20portrait%20aesthetic%20Arab%20man%20lighting%20moody?width=300&height=400&seed=${i + 50}&nologo=true`} 
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                alt={`Video ${i}`}
                            />
                            {i <= 3 && (
                                <div className="absolute top-1.5 left-1.5 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] flex items-center text-white font-medium border border-white/10">
                                    <Pin className="w-2.5 h-2.5 mr-1 text-white fill-white rotate-45" /> Pinned
                                </div>
                            )}
                            <div className="absolute bottom-1 right-1 flex items-center text-[10px] font-medium drop-shadow-md">
                                <Play className="w-2.5 h-2.5 mr-0.5 fill-white text-white" /> 1247
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        </div>
    </div>
  )
}

const DataCard = ({ label, value, change, positive }: { label: string, value: string, change: string, positive?: boolean }) => (
    // Rounded 5px, Removed Border
    <div className="bg-[#1a1a1d] p-3 rounded-[5px] flex flex-col justify-between h-20 shadow-sm">
        <div className="flex items-end justify-between w-full">
            <span className="text-[15px] font-bold text-white tracking-tight">{value}</span>
            <span className={`text-[10px] font-medium ${positive ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>{change}</span>
        </div>
        <div className="text-[11px] text-gray-500 font-medium">{label}</div>
    </div>
)

const ManagementBtn = ({ icon: Icon, label }: { icon: any, label: string }) => (
    // Rounded 5px, Removed Border, Left Aligned, Larger Text/Icon
    <button className="bg-[#1a1a1d] px-3 py-2 rounded-[5px] flex items-center justify-start space-x-2 hover:bg-white/5 transition-colors h-14 w-full shadow-sm">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="text-[13px] font-semibold text-gray-300">{label}</span>
    </button>
)