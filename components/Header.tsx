import React from 'react';
import { Search, MessageSquareText } from 'lucide-react';

interface HeaderProps {
  visible?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ visible = true }) => {
  return (
    <header 
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/90 to-black/0 backdrop-blur-sm transition-all duration-300 ease-in-out ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <h1 className="text-2xl font-bold tracking-tight text-white shadow-black drop-shadow-md">Home</h1>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-white/10 transition">
          <Search className="w-6 h-6 text-white" />
        </button>
        <button className="relative p-2 rounded-full hover:bg-white/10 transition">
          <MessageSquareText className="w-6 h-6 text-white" />
          {/* Badge removed as requested */}
        </button>
      </div>
    </header>
  );
};