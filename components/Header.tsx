
import React from 'react';
import { AppMode } from '../types';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ mode, setMode }) => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 leading-none">AI NAVIGATOR</h1>
              <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Career & Design Studio</span>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
            {[
              { id: AppMode.IMAGE, label: 'Фото' },
              { id: AppMode.VIDEO, label: 'Видео' },
              { id: AppMode.EDIT, label: 'Правка' },
              { id: AppMode.CAREER, label: 'Профессии' },
              { id: AppMode.GALLERY, label: 'Галерея' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  mode === item.id 
                    ? 'bg-white text-red-600 shadow-sm border border-gray-100' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
