import React, { useMemo } from 'react';
import { Heart, Check } from 'lucide-react';
import { Stream } from '../types';

const CARD_TAGS = [
  null, // Option 1: No tag
  'https://img.jacocdn.com/large/3b9ae203la1i8yo08utiaj202900kq2q.jpg',
  'https://img.jacocdn.com/large/3b9ae203la1i8yo19l7b6j202200kgle.jpg',
  'https://img.jacocdn.com/large/3b9ae203la1i8yo1md5baj202400kt8i.jpg',
  'https://img.jacocdn.com/large/3b9ae203la1i8yo1w6hfxj201e00kt8h.jpg',
  'https://img.jacocdn.com/large/3b9ae203la1i8yo75jeqnj202f00k3yb.jpg'
];

interface LiveCardProps {
  stream: Stream;
  onClick?: (stream: Stream) => void;
}

export const LiveCard: React.FC<LiveCardProps> = ({ stream, onClick }) => {
  // Deterministically select a tag based on stream ID so it doesn't flicker on re-renders
  const tagImage = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < stream.id.length; i++) {
      hash = stream.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % CARD_TAGS.length;
    return CARD_TAGS[index];
  }, [stream.id]);

  return (
    <div 
        className="w-full flex flex-col group cursor-pointer"
        onClick={() => onClick?.(stream)}
    >
      {/* Image Section - Modified rounded corners: Top rounded only */}
      <div className="relative w-full aspect-[3/4] rounded-t-xl overflow-hidden bg-card mb-2">
        <img 
          src={stream.thumbnail} 
          alt={stream.title} 
          onError={(e) => {
            // Fallback image if generation fails
            e.currentTarget.src = "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=500&fit=crop"; 
          }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle gradient at top for tags visibility */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/60 to-transparent"></div>

        {/* Tags (Top Left) */}
        <div className="absolute top-2 left-2 z-10">
          {tagImage && (
             <img src={tagImage} alt="Tag" className="h-[18px] w-auto object-contain drop-shadow-sm" />
          )}
        </div>
      </div>

      {/* Content Section (Below Image) */}
      {/* Added pb-2 for extra spacing between grid rows */}
      <div className="px-1 flex flex-col pb-2">
        
        {/* Line 1: User Name + Verified Badge */}
        <div className="flex items-center mb-0.5">
           <span className="text-white text-[13px] font-medium truncate max-w-[85%] leading-tight">
              {stream.user.name}
           </span>
           {stream.user.verified && (
               <div className="ml-1 bg-[#A540FF] rounded-full p-[2px] flex-shrink-0">
                  <Check size={8} strokeWidth={4} className="text-white" />
               </div>
           )}
        </div>

        {/* Line 2: Title */}
        <div className="text-gray-400 text-[11px] truncate mb-1.5 leading-tight">
           {stream.title}
        </div>
        
        {/* Line 3: Stats (Views + Likes) - Unified Style & Removed PK */}
        <div className="flex items-center space-x-2">
            {/* View Count */}
            <div className="flex items-center bg-gray-800/40 px-1.5 py-0.5 rounded text-[10px] text-gray-400">
               <span className="mr-1">▷</span>
               {stream.viewCount}
            </div>

            {/* Like Count - Unified Style with View Count */}
            <div className="flex items-center bg-gray-800/40 px-1.5 py-0.5 rounded text-[10px] text-gray-400">
                <Heart className="w-3 h-3 mr-1 fill-gray-500/20" />
                <span>{stream.likeCount}</span>
            </div>
        </div>
      </div>
    </div>
  );
};