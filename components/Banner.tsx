import React, { useState, useEffect } from 'react';
import { Stream } from '../types';

const TAG_IMAGES = [
  'https://img.jacocdn.com/large/3b9ae203la1i8yo08utiaj202900kq2q.jpg',
  'https://img.jacocdn.com/large/3b9ae203la1i8yo19l7b6j202200kgle.jpg',
  'https://img.jacocdn.com/large/3b9ae203la1i8yo1md5baj202400kt8i.jpg',
  'https://img.jacocdn.com/large/3b9ae203la1i8yo1w6hfxj201e00kt8h.jpg'
];

// Added 'tagImage' to replace 'tagType'
const BANNER_SLIDES = [
  {
    id: 1,
    image: 'https://image.pollinations.ai/prompt/Arab%20financial%20analyst%20in%20thobe%20looking%20at%20stock%20charts%20professional%20office?width=800&height=600&seed=101&nologo=true',
    title: 'Analyze the stock market',
    tagImage: TAG_IMAGES[2], 
    color: '#431407' // Dark Orange/Brown
  },
  {
    id: 2,
    image: 'https://image.pollinations.ai/prompt/Oud%20musician%20performing%20in%20traditional%20tent%20evening%20warm%20lighting?width=800&height=600&seed=102&nologo=true',
    title: 'Late Night Jazz Club',
    tagImage: TAG_IMAGES[0],
    color: '#3b0764' // Dark Purple
  },
  {
    id: 3,
    image: 'https://image.pollinations.ai/prompt/Saudi%20gamer%20wearing%20ghutra%20headset%20neon%20gaming%20setup%20excitement?width=800&height=600&seed=103&nologo=true',
    title: 'Epic Gaming Moments',
    tagImage: TAG_IMAGES[1],
    color: '#172554' // Dark Blue
  },
  {
    id: 4,
    image: 'https://image.pollinations.ai/prompt/Delicious%20Middle%20Eastern%20feast%20shawarma%20mezze%20platter%20cinematic?width=800&height=600&seed=104&nologo=true',
    title: 'Street Food Adventure',
    tagImage: TAG_IMAGES[3],
    color: '#052e16' // Dark Green
  },
  {
    id: 5,
    image: 'https://image.pollinations.ai/prompt/Arab%20man%20fitness%20workout%20modern%20gym%20dubai%20view?width=800&height=600&seed=105&nologo=true',
    title: 'Daily Fitness Routine',
    tagImage: TAG_IMAGES[1],
    color: '#450a0a' // Dark Red
  }
];

interface BannerProps {
  onMainColorChange?: (color: string) => void;
  onBannerClick?: (stream: Stream) => void;
}

export const Banner: React.FC<BannerProps> = ({ onMainColorChange, onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Notify parent of the initial color
    if (onMainColorChange) {
      onMainColorChange(BANNER_SLIDES[currentIndex].color);
    }
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNER_SLIDES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Effect to notify parent when index changes
  useEffect(() => {
    if (onMainColorChange) {
      onMainColorChange(BANNER_SLIDES[currentIndex].color);
    }
  }, [currentIndex, onMainColorChange]);

  const currentSlide = BANNER_SLIDES[currentIndex];

  const handleClick = () => {
    if (onBannerClick) {
        // Construct a mock stream object from banner data
        const mockStream: Stream = {
            id: `banner-${currentSlide.id}`,
            thumbnail: currentSlide.image,
            title: currentSlide.title,
            user: { 
                id: 'banner-user', 
                name: 'Featured Streamer', 
                avatar: currentSlide.image,
                verified: true 
            },
            viewCount: '500K',
            likeCount: '250K',
            tags: [{ type: 'top1', text: 'Top 1' }]
        };
        onBannerClick(mockStream);
    }
  };

  return (
    <div className="px-4 pt-2 pb-0">
      <div 
        onClick={handleClick}
        className="relative w-full h-[450px] rounded-2xl overflow-hidden shadow-2xl group transition-transform duration-500 cursor-pointer active:scale-95"
      >
        {/* Main Image */}
        <img 
          src={currentSlide.image} 
          alt={currentSlide.title} 
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          key={currentSlide.id} 
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col justify-end h-full pointer-events-none">
          {/* Spacer to push content down */}
          <div className="flex-grow"></div> 
          
          <div className="mb-24 relative z-10">
            {/* Tag Image */}
            <div className="mb-2">
               <img 
                 src={currentSlide.tagImage} 
                 alt="Tag" 
                 className="h-6 w-auto object-contain"
               />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md leading-tight max-w-[80%]">
              {currentSlide.title}
            </h2>
          </div>
        </div>

        {/* Pagination: Row of Circular Avatars */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-6 z-20 px-4">
            {BANNER_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                }}
                className={`relative flex-shrink-0 transition-all duration-300 rounded-full overflow-hidden border-2 shadow-lg ${
                  currentIndex === index 
                    ? 'w-14 h-14 border-white opacity-100 scale-110 ring-2 ring-black/20' 
                    : 'w-11 h-11 border-transparent opacity-60 hover:opacity-100 scale-95'
                }`}
              >
                <img 
                  src={slide.image} 
                  alt={`Slide ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};