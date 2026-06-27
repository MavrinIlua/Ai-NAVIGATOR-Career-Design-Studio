
import React, { useState } from 'react';
import { AppMode } from '../types';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onOpenTour: () => void;
  studentName: string;
  setStudentName: (name: string) => void;
  casesCount: number;
}

const Header: React.FC<HeaderProps> = ({ 
  mode, 
  setMode, 
  onOpenTour,
  studentName,
  setStudentName,
  casesCount
}) => {
  const [saveStatus, setSaveStatus] = useState(false);

  const getMasteryLevel = (count: number) => {
    if (count === 0) return { label: 'Новичок ИИ', color: 'bg-slate-50 text-slate-600 border-slate-100' };
    if (count <= 2) return { label: 'Адепт ИИ', color: 'bg-amber-50 text-amber-700 border-amber-200/50' };
    if (count <= 4) return { label: 'Специалист ИИ', color: 'bg-blue-50 text-blue-700 border-blue-200/50' };
    return { label: 'Магистр ИИ 🎓', color: 'bg-red-50 text-red-600 border-red-200/50' };
  };

  const level = getMasteryLevel(casesCount);

  const handleSaveProgress = () => {
    try {
      localStorage.setItem('student_name_v2', studentName);
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 2000);
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center py-4 lg:h-20 gap-4">
          
          {/* Logo & Info */}
          <div className="flex items-center space-x-3 self-start lg:self-auto">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 leading-none">AI NAVIGATOR</h1>
              <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Career & Design Studio</span>
            </div>
          </div>
          
          {/* Navigation & Cabinet */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto justify-end">
            
            {/* Mode Switcher */}
            <nav className="flex items-center space-x-1 bg-gray-50 p-1 rounded-xl border border-gray-100 w-full sm:w-auto justify-between sm:justify-start">
              {[
                { id: AppMode.IMAGE, label: 'Фото', shortcut: 'Alt+1' },
                { id: AppMode.VIDEO, label: 'Видео', shortcut: 'Alt+2' },
                { id: AppMode.EDIT, label: 'Правка', shortcut: 'Alt+3' },
                { id: AppMode.CAREER, label: 'Профессии', shortcut: 'Alt+4' },
                { id: AppMode.GALLERY, label: 'Галерея', shortcut: 'Alt+5' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id)}
                  title={`Переключить: ${item.shortcut}`}
                  className={`px-2 py-1.5 sm:px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center flex-1 sm:flex-initial ${
                    mode === item.id 
                      ? 'bg-white text-red-600 shadow-sm border border-gray-100' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Personal Cabinet Panel */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-1.5 rounded-xl w-full sm:w-auto">
              <div className="text-right px-2 hidden sm:block">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="bg-transparent border-b border-transparent hover:border-red-600/30 focus:border-red-600 font-black text-[11px] text-gray-900 text-right outline-none w-36 px-0.5 transition-colors uppercase tracking-tight"
                  title="Кликните, чтобы изменить имя студента"
                  placeholder="Имя студента"
                />
                <span className={`block text-[9px] font-black uppercase border border-dashed rounded px-1.5 py-0.2 text-center mt-0.5 ${level.color}`}>
                  {level.label} ({casesCount})
                </span>
              </div>
              
              <button
                onClick={handleSaveProgress}
                className={`p-2.5 rounded-lg font-black text-xs transition-all flex items-center justify-center ${
                  saveStatus 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-100 shadow-sm'
                }`}
                title="Сохранить прогресс в локальную память"
              >
                {saveStatus ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                )}
              </button>
            </div>

            {/* Tour Button */}
            <button
              onClick={onOpenTour}
              className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100/60 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0 self-stretch sm:self-auto justify-center"
              title="Интерактивный тур"
            >
              <span>🎓</span>
              <span className="sm:inline">О ТУРЕ</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
