import React, { useState } from 'react';
import { Share2, MessageCircle, ChevronLeft, ChevronRight, Pin, Play, Hexagon, MoreHorizontal, Plus } from 'lucide-react';

interface GuestProfileViewProps {
    user: any; // The user object passed from LiveRoom
    onBack: () => void;
    onNavigateToFamily?: () => void;
}

export const GuestProfileView: React.FC<GuestProfileViewProps> = ({ user, onBack, onNavigateToFamily }) => {
  // Simulate if the user has a family (derived from user data in a real app)
  // For demo, we assume they have one if the passed user object implies it, or hardcode true for visual demo
  const hasFamily = true; 

  return (
    <div className="w-full min-h-screen bg-[#0f0f11] text-white pb-24 relative overflow-x-hidden animate-in slide-in-from-right duration-300 z-[250]">
        
        {/* Header - Back Button & Actions */}
        <div className="absolute top-0 left-0 right-0 px-4 py-3 flex justify-between items-center z-30 pt-4">
            <button 
                onClick={onBack}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition active:scale-95"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center space-x-3">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition"><Share2 className="w-5 h-5 text-white" /></button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition"><MoreHorizontal className="w-5 h-5 text-white" /></button>
            </div>
        </div>

        {/* Hero / Background Image Area */}
        <div className="relative h-[420px] w-full">
            <img 
                src={user?.thumbnail || user?.avatar || "https://image.pollinations.ai/prompt/Handsome%20Saudi%20Arab%20man%20streamer%20wearing%20red%20shemagh%20headset%20talking%20microphone%20professional%20gaming%20studio%20purple%20lighting?width=800&height=1000&seed=88&nologo=true"}
                className="w-full h-full object-cover"
                alt="Profile Background"
            />
            
            {/* Bottom heavy gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/90 via-50% to-transparent"></div>
            
            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 w-full px-4 pb-2 z-10">
                {/* Name Row */}
                <div className="flex items-center space-x-2 mb-1">
                    <h1 className="text-2xl font-bold tracking-wide text-white drop-shadow-sm">{user?.user?.name || user?.name || "Featured Streamer"}</h1>
                    <span className="text-xl">🦅</span>
                    <img 
                        src="https://img.jacocdn.com/large/3b9ae203la1i8yp02pfakj201f00mt8i.jpg" 
                        alt="Level 57" 
                        className="h-5 w-auto object-contain drop-shadow-md"
                    />
                </div>
                
                {/* Handle */}
                <div className="text-gray-200 text-xs mb-4 font-medium drop-shadow-sm">@ {user?.id || "99283712"}</div>
                
                {/* Stats & Follow Actions */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex space-x-6">
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-none text-white">4460</span>
                            <span className="text-[11px] text-gray-300 mt-1 font-medium">Following</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-none text-white">405.4K</span>
                            <span className="text-[11px] text-gray-300 mt-1 font-medium">Followers</span>
                        </div>
                    </div>
                    
                    {/* Guest Actions: Follow & Message */}
                    <div className="flex gap-2">
                        <button className="flex items-center px-6 py-1.5 bg-[#A540FF] hover:bg-[#9333ea] rounded-full text-sm font-bold shadow-lg shadow-purple-900/20 active:scale-95 transition-all">
                            <Plus className="w-4 h-4 mr-1" strokeWidth={3} />
                            Follow
                        </button>
                        <button className="flex items-center justify-center w-9 h-9 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Tags Row */}
                <div className="flex items-center space-x-2 mb-3">
                    <div className="bg-white/20 text-white text-[10px] pl-1 pr-2 py-1 rounded-[5px] flex items-center font-medium backdrop-blur-sm">
                        <div className="bg-purple-500 rounded-full p-0.5 mr-1.5">
                            <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        JACO CREATOR
                    </div>
                    <div className="bg-white/20 text-white px-2.5 py-1 rounded-[5px] text-[10px] flex items-center font-bold backdrop-blur-sm">
                        ♂
                    </div>
                    <div className="bg-white/20 text-white text-[10px] px-2 py-1 rounded-[5px] flex items-center gap-1.5 font-medium backdrop-blur-sm">
                         Snapchat
                    </div>
                </div>

                {/* Bio */}
                <p className="text-[13px] text-gray-200 leading-relaxed line-clamp-2 pr-4 font-light drop-shadow-sm">
                    Professional gamer and tech enthusiast. Join the squad for daily streams! 🎮✨
                </p>
                
                {/* Pagination Dots */}
                <div className="flex space-x-1 mt-3 justify-center w-full">
                     <div className="w-1 h-1 rounded-full bg-white shadow-sm"></div>
                     <div className="w-1 h-1 rounded-full bg-white/40 shadow-sm"></div>
                     <div className="w-1 h-1 rounded-full bg-white/40 shadow-sm"></div>
                </div>
            </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="px-4 space-y-6 mt-4">
            
            {/* LIVE Hub (Retained & Adapted for Guest) */}
            <div>
                <div className="flex justify-between items-center mb-2.5 px-1">
                    <h3 className="font-bold text-sm text-white">LIVE Hub</h3>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
                <div className="bg-[#1a1a1d] rounded-[5px] p-4 flex justify-between items-center shadow-sm border border-white/5">
                    <div>
                        <div className="text-sm font-semibold text-gray-200">No LIVE Schedule yet</div>
                        <div className="text-[11px] text-gray-500 mt-1">Stay tuned for the next stream!</div>
                    </div>
                    <button className="bg-white/10 text-gray-400 text-xs font-bold px-4 py-2 rounded-lg cursor-not-allowed border border-white/5">
                        Remind Me
                    </button>
                </div>
            </div>

            {/* Family Module (Guest View - Optimized) */}
            <div>
                 <div 
                    className="flex justify-between items-center mb-2.5 px-1 cursor-pointer active:opacity-80 transition-opacity"
                    onClick={hasFamily ? onNavigateToFamily : undefined}
                 >
                    <h3 className="font-bold text-sm text-white">Family</h3>
                    {hasFamily && <ChevronRight className="w-4 h-4 text-gray-500" />}
                </div>
                
                {hasFamily ? (
                    /* Display ONLY the Family Identity Card, full width */
                    <div 
                        className="bg-[#1a1a1d] rounded-[5px] p-3 flex items-center shadow-sm h-20 cursor-pointer active:scale-95 transition-transform border border-white/5"
                        onClick={onNavigateToFamily}
                    >
                        {/* Avatar with Golden Frame */}
                        <div className="relative mr-4 flex-shrink-0">
                            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-yellow-600 via-yellow-200 to-yellow-500 shadow-lg">
                                <img 
                                    src="https://image.pollinations.ai/prompt/Esports%20team%20logo%20shield%20purple%20lion?width=100&height=100&seed=45&nologo=true"
                                    className="w-full h-full rounded-full object-cover border-2 border-[#1a1a1d]"
                                    alt="Family"
                                />
                            </div>
                            {/* Level Badge */}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-amber-500 text-white text-[7px] font-bold px-1 py-[1px] rounded-full border border-[#1a1a1d] shadow-sm z-10 whitespace-nowrap">
                                Lv 14
                            </div>
                        </div>

                        <div className="flex flex-col justify-center flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[14px] font-bold text-white leading-tight">Royal Lions</span>
                                <span className="text-[9px] bg-[#A540FF]/20 text-[#A540FF] px-1.5 py-0.5 rounded font-bold border border-[#A540FF]/30">
                                    Chief
                                </span>
                            </div>
                            {/* Removed ID as requested */}
                            <span className="text-[11px] text-gray-500 mt-1">154 Members</span>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </div>
                ) : (
                    /* No Family State */
                    <div className="bg-[#1a1a1d] rounded-[5px] p-4 flex items-center gap-3 text-gray-500 border border-white/5">
                        <Hexagon className="w-5 h-5" />
                        <span className="text-xs">Not joined a family yet</span>
                    </div>
                )}
            </div>

            {/* Badge Gallery (Retained) */}
            <div>
                 <h3 className="font-bold text-sm mb-2.5 px-1">Badge Gallery</h3>
                 <img 
                    src="https://img.jacocdn.com/large/3b9ae203la1i8yp1jt49gj20ag02v0u4.jpg" 
                    className="w-full h-auto rounded-xl object-cover"
                    alt="Badge Gallery"
                 />
            </div>

             {/* Video Tabs */}
             <div className="mt-8">
                <div className="flex space-x-8 px-2">
                    <button className="text-white font-bold text-sm border-b-2 border-white pb-3 px-1">Videos</button>
                    <button className="text-gray-500 font-medium text-sm pb-3 px-1 hover:text-gray-300">Liked</button>
                    <button className="text-gray-500 font-medium text-sm pb-3 px-1 hover:text-gray-300">Favorite</button>
                </div>

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
