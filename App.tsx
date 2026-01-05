import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ContentTabs } from './components/ContentTabs';
import { Banner } from './components/Banner';
import { LiveCard } from './components/LiveCard';
import { BottomNav } from './components/BottomNav';
import { ProfileView } from './components/ProfileView';
import { FamilyView, FamilyTabType } from './components/FamilyView';
import { FamilyGuestView } from './components/FamilyGuestView';
import { LiveRoom } from './components/LiveRoom';
import { DiscoverView } from './components/DiscoverView';
import { Stream, TabType } from './types';
import { fetchCreativeStreamData } from './services/geminiService';

// Initial Mock Data with 12 Arabic Themed Items
const INITIAL_STREAMS: Stream[] = [
  {
    id: '1',
    thumbnail: 'https://image.pollinations.ai/prompt/Young%20Arab%20man%20professional%20gamer%20headset%20neon%20lights%20esports?width=400&height=500&seed=1001&nologo=true',
    title: 'Pro Gamer KSA',
    user: { id: 'u1', name: 'Ranked Match', avatar: '', verified: true },
    viewCount: '45.2K',
    likeCount: '20K',
    tags: [{ type: 'pk', text: 'PK' }]
  },
  {
    id: '2',
    thumbnail: 'https://image.pollinations.ai/prompt/Arab%20man%20podcast%20studio%20microphone%20talking%20warm%20lighting?width=400&height=500&seed=1002&nologo=true',
    title: 'Midnight Talks',
    user: { id: 'u2', name: 'Voice of Night', avatar: '', verified: true },
    viewCount: '12.8K',
    likeCount: '5K',
    tags: [{ type: 'top1', text: 'Top 1' }]
  },
  {
    id: '3',
    thumbnail: 'https://image.pollinations.ai/prompt/Saudi%20football%20player%20green%20jersey%20celebrating%20goal%20stadium?width=400&height=500&seed=1003&nologo=true',
    title: 'Goal Highlights',
    user: { id: 'u3', name: 'Sports HD', avatar: '', verified: false },
    viewCount: '102K',
    likeCount: '88K',
    tags: [{ type: 'exclusive', text: 'Live' }]
  },
  {
    id: '4',
    thumbnail: 'https://image.pollinations.ai/prompt/Traditional%20Arabic%20coffee%20pouring%20dallah%20dates%20desert%20setting?width=400&height=500&seed=1004&nologo=true',
    title: 'Morning Coffee',
    user: { id: 'u4', name: 'Desert Vibes', avatar: '', verified: false },
    viewCount: '8.5K',
    likeCount: '2K',
    tags: []
  },
  {
    id: '5',
    thumbnail: 'https://image.pollinations.ai/prompt/Close%20up%20Oud%20instrument%20musician%20hands%20playing%20traditional%20music?width=400&height=500&seed=1005&nologo=true',
    title: 'Oud Melodies',
    user: { id: 'u5', name: 'Music Soul', avatar: '', verified: true },
    viewCount: '34K',
    likeCount: '15K',
    tags: [{ type: 'generic', text: 'Music' }]
  },
  {
    id: '6',
    thumbnail: 'https://image.pollinations.ai/prompt/Arab%20vlogger%20holding%20camera%20selfie%20in%20Dubai%20Mall%20luxury?width=400&height=500&seed=1006&nologo=true',
    title: 'Dubai Shopping',
    user: { id: 'u6', name: 'Travel Daily', avatar: '', verified: false },
    viewCount: '19K',
    likeCount: '4K',
    tags: []
  },
  {
    id: '7',
    thumbnail: 'https://image.pollinations.ai/prompt/Chef%20cooking%20massive%20Kabsa%20rice%20dish%20traditional%20kitchen?width=400&height=500&seed=1007&nologo=true',
    title: 'Cooking Kabsa',
    user: { id: 'u7', name: 'Chef Ahmed', avatar: '', verified: true },
    viewCount: '55K',
    likeCount: '30K',
    tags: [{ type: 'top1', text: 'Hot' }]
  },
  {
    id: '8',
    thumbnail: 'https://image.pollinations.ai/prompt/Luxury%20car%20interior%20night%20drive%20Riyadh%20street%20lights?width=400&height=500&seed=1008&nologo=true',
    title: 'Night Drive',
    user: { id: 'u8', name: 'Car Enthusiast', avatar: '', verified: false },
    viewCount: '22K',
    likeCount: '9K',
    tags: []
  },
  {
    id: '9',
    thumbnail: 'https://image.pollinations.ai/prompt/Falconry%20man%20holding%20falcon%20desert%20golden%20hour?width=400&height=500&seed=1009&nologo=true',
    title: 'Falcon Training',
    user: { id: 'u9', name: 'Heritage Life', avatar: '', verified: true },
    viewCount: '41K',
    likeCount: '12K',
    tags: [{ type: 'exclusive', text: 'Exclusive' }]
  },
  {
    id: '10',
    thumbnail: 'https://image.pollinations.ai/prompt/Arab%20artist%20painting%20calligraphy%20art%20canvas%20close%20up?width=400&height=500&seed=1010&nologo=true',
    title: 'Art Session',
    user: { id: 'u10', name: 'Creative Hands', avatar: '', verified: false },
    viewCount: '6K',
    likeCount: '1K',
    tags: []
  },
  {
    id: '11',
    thumbnail: 'https://image.pollinations.ai/prompt/Group%20of%20friends%20camping%20desert%20fire%20night%20stars?width=400&height=500&seed=1011&nologo=true',
    title: 'Desert Camping',
    user: { id: 'u11', name: 'Adventure Squad', avatar: '', verified: false },
    viewCount: '28K',
    likeCount: '14K',
    tags: [{ type: 'pk', text: 'PK' }]
  },
  {
    id: '12',
    thumbnail: 'https://image.pollinations.ai/prompt/Hands%20holding%20latest%20smartphone%20unboxing%20tech%20review%20sleek%20desk?width=400&height=500&seed=9999&nologo=true',
    title: 'New Tech Unboxing',
    user: { id: 'u12', name: 'Tech Geeks', avatar: '', verified: true },
    viewCount: '15K',
    likeCount: '3K',
    tags: []
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('For You');
  // Updated page state to include 'discover' and 'family_guest'
  const [activePage, setActivePage] = useState<'home' | 'profile' | 'family' | 'live' | 'discover' | 'family_guest'>('home');
  const [streams, setStreams] = useState<Stream[]>(INITIAL_STREAMS);
  const [loading, setLoading] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [themeColor, setThemeColor] = useState('#000000');
  const [familyTab, setFamilyTab] = useState<FamilyTabType>('home');
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Hide header if scrolled down more than 20px
      const currentScrollY = window.scrollY;
      setIsHeaderVisible(currentScrollY < 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to load "new" content when tab changes
  useEffect(() => {
    const loadNewContent = async () => {
      if (activeTab === 'For You' && streams === INITIAL_STREAMS) return;

      setLoading(true);
      const generatedData = await fetchCreativeStreamData(activeTab);
      
      const newStreams: Stream[] = generatedData.map((item, index) => {
        const imagePrompt = `Arab live streamer ${activeTab} ${item.username} traditional clothing ${index}`;
        const encodedPrompt = encodeURIComponent(imagePrompt);
        
        return {
          id: `gen-${Date.now()}-${index}`,
          thumbnail: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=400&height=500&seed=${Date.now() + index}&nologo=true`,
          title: item.username,
          user: { 
            id: `u-${index}`, 
            name: item.title, 
            avatar: '', 
            verified: Math.random() > 0.5 
          },
          viewCount: (Math.random() * 20 + 1).toFixed(1) + 'K',
          likeCount: (Math.random() * 20 + 1).toFixed(1) + 'K',
          tags: index % 2 === 0 ? [{ type: 'exclusive', text: 'Live' }] : []
        };
      });

      setStreams(newStreams);
      setLoading(false);
    };

    loadNewContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleOpenLive = (stream: Stream) => {
      setCurrentStream(stream);
      setActivePage('live');
  };

  const handleCloseLive = () => {
      setActivePage('home'); // Return to home by default
      setCurrentStream(null);
  };

  return (
    <div className="min-h-screen bg-black pb-24 text-white font-sans antialiased selection:bg-purple-500/30">
      {/* Container to restrict width on desktop to simulate mobile app */}
      <div className="max-w-md mx-auto min-h-screen relative bg-neutral-900/50 shadow-2xl overflow-hidden">
        
        {/* Render content based on activePage */}
        {activePage === 'home' ? (
          <>
            {/* Dynamic Background Layer for Home */}
            <div className="absolute top-0 left-0 right-0 h-[650px] z-0 pointer-events-none">
              <div 
                className="absolute inset-0 transition-colors duration-1000 ease-in-out"
                style={{ backgroundColor: themeColor }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black"></div>
            </div>

            <div className="relative z-10">
              <Header visible={isHeaderVisible} />
              
              <div className="pt-16">
                 <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />
                 
                 <main className="pt-2">
                   <Banner 
                       onMainColorChange={setThemeColor} 
                       onBannerClick={handleOpenLive}
                   />
                   
                   <div className="px-4 mt-2">
                      <div className="flex items-center justify-between mb-2 h-4">
                         {loading && <span className="text-xs text-purple-400 animate-pulse ml-auto">Refreshing...</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {streams.map((stream) => (
                          <LiveCard 
                              key={stream.id} 
                              stream={stream} 
                              onClick={handleOpenLive}
                          />
                        ))}
                        {loading && streams.length === 0 && [1,2,3,4].map(i => (
                           <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse"></div>
                        ))}
                      </div>
                   </div>
                 </main>
              </div>
            </div>
          </>
        ) : activePage === 'discover' ? (
          /* Discover Page View */
          <div className="relative z-10 animate-fade-in bg-[#0f0f11]">
              <DiscoverView 
                onLiveClick={handleOpenLive} 
                onFamilyClick={() => setActivePage('family_guest')}
              />
          </div>
        ) : activePage === 'profile' ? (
          /* Profile Page View */
          <div className="relative z-10 animate-fade-in">
             <ProfileView 
                onNavigateToFamily={() => {
                    setFamilyTab('home');
                    setActivePage('family');
                }} 
                onNavigateToFamilyTasks={() => {
                    setFamilyTab('tasks');
                    setActivePage('family');
                }}
             />
          </div>
        ) : activePage === 'family' ? (
          /* Family Page View */
          <div className="relative z-10 bg-[#0f0f11]">
             <FamilyView 
                onBack={() => setActivePage('profile')} 
                initialTab={familyTab}
             />
          </div>
        ) : activePage === 'family_guest' ? (
          /* Family Guest View */
          <div className="relative z-10 bg-[#0f0f11]">
             <FamilyGuestView 
                onBack={() => setActivePage('discover')} 
             />
          </div>
        ) : (
           /* Live Room View */
           currentStream && <LiveRoom stream={currentStream} onClose={handleCloseLive} />
        )}

        {/* BottomNav shown only on main pages */}
        {activePage !== 'family' && activePage !== 'family_guest' && activePage !== 'live' && (
          <BottomNav 
            currentTab={activePage === 'profile' ? 'profile' : activePage === 'discover' ? 'discover' : 'home'} 
            onTabChange={(tab) => setActivePage(tab)} 
          />
        )}
        
      </div>
    </div>
  );
};

export default App;