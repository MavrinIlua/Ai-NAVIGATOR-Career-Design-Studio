import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import CareerExplorer from './components/CareerExplorer';
import Gallery from './components/Gallery';
import { OnboardingTour } from './components/OnboardingTour';
import { AppMode, GeneratedMedia, AICareer } from './types';

// Fix: Use AIStudio interface and remove readonly to match environment expectations
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.IMAGE);
  const [activeTrial, setActiveTrial] = useState<AICareer | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Student Name state for Личный кабинет
  const [studentName, setStudentName] = useState<string>(() => {
    try {
      return localStorage.getItem('student_name_v2') || 'Маврин Илья Борисович';
    } catch (e) {
      return 'Маврин Илья Борисович';
    }
  });

  const [isTourOpen, setIsTourOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nav_has_seen_tour_v2') !== 'true';
    } catch (e) {
      return true;
    }
  });
  
  // Default to true during initial check to avoid flicker, then update based on hasSelectedApiKey
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  
  const [items, setItems] = useState<GeneratedMedia[]>(() => {
    try {
      const saved = localStorage.getItem('nav_items_v3');
      const parsed: GeneratedMedia[] = saved ? JSON.parse(saved) : [];
      // Object URLs for videos don't persist across reloads
      return parsed.map(item => {
        if (item.type === 'video' && item.url.startsWith('blob:')) {
          return { ...item, url: '' }; // Mark as expired
        }
        return item;
      });
    } catch (e) {
      console.error("Failed to load gallery items", e);
      return [];
    }
  });
  const [latestItem, setLatestItem] = useState<GeneratedMedia | null>(null);

  // Sync Student Name with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('student_name_v2', studentName);
    } catch (e) {}
  }, [studentName]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.altKey || e.ctrlKey;
      if (isModifier && ['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        
        switch (e.key) {
          case '1':
            setMode(AppMode.IMAGE);
            break;
          case '2':
            setMode(AppMode.VIDEO);
            break;
          case '3':
            setMode(AppMode.EDIT);
            break;
          case '4':
            setMode(AppMode.CAREER);
            break;
          case '5':
            setMode(AppMode.GALLERY);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // Fallback for CORS
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        }
      } catch (e) {
        console.warn("AI Studio API check failed", e);
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('nav_items_v3', JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save items to localStorage", e);
    }
  }, [items]);

  const handleMediaResult = (newMedia: GeneratedMedia) => {
    setItems(prev => [newMedia, ...prev]);
    setLatestItem(newMedia);
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (latestItem?.id === id) setLatestItem(null);
  };

  const handleUpdateComment = (id: string, comment: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, comment } : item));
    if (latestItem?.id === id) setLatestItem(prev => prev ? { ...prev, comment } : null);
  };

  const handleOpenKeySelection = async () => {
    try {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        // Fix: Assume the key selection was successful after triggering openSelectKey() to handle race condition
        await window.aistudio.openSelectKey();
        setHasApiKey(true);
      }
    } catch (e) {
      console.error("Failed to open key selection", e);
    }
  };

  // Fix: Mandatory key selection screen before accessing the main app as per rules for Veo/Pro models
  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center space-y-8 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/></svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">AI NAVIGATOR</h1>
            <p className="text-gray-500 font-medium leading-relaxed">
              Для работы со студией (особенно с видео и Pro моделями) необходимо выбрать API-ключ из платного проекта Google Cloud.
            </p>
            <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                Документация по биллингу:<br/>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">ai.google.dev/gemini-api/docs/billing</a>
              </p>
            </div>
          </div>
          <button 
            onClick={handleOpenKeySelection}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-[0.98]"
          >
            ВЫБРАТЬ API-КЛЮЧ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans selection:bg-red-200 selection:text-red-900">
      <Header 
        mode={mode} 
        setMode={setMode} 
        onOpenTour={() => setIsTourOpen(true)} 
        studentName={studentName}
        setStudentName={setStudentName}
        casesCount={items.length}
      />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Panel: Generators and Explorer */}
          <div className="lg:col-span-6 space-y-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="space-y-10"
              >
                {mode === AppMode.IMAGE || mode === AppMode.VIDEO ? (
                  <ImageGenerator 
                    mode={mode} 
                    onMediaGenerated={handleMediaResult} 
                    activeTrial={activeTrial}
                    onResetTrial={() => setActiveTrial(null)}
                    onLoadingStateChange={setIsGenerating}
                  />
                ) : mode === AppMode.EDIT ? (
                  <ImageEditor 
                    onImageEdited={handleMediaResult} 
                    onLoadingStateChange={setIsGenerating}
                  />
                ) : mode === AppMode.CAREER ? (
                  <CareerExplorer 
                    onMediaGenerated={handleMediaResult} 
                    activeTrial={activeTrial}
                    onStartTrial={(career) => {
                      setActiveTrial(career);
                      setMode(AppMode.IMAGE);
                    }}
                    onLoadingStateChange={setIsGenerating}
                    items={items}
                    studentName={studentName}
                  />
                ) : (
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Статистика Портфолио</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-gray-500 font-bold text-sm uppercase">Всего сгенерировано</span>
                        <span className="text-2xl font-black text-red-600">{items.length}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-gray-500 font-bold text-sm uppercase">Видеоролики</span>
                        <span className="text-2xl font-black text-amber-500">{items.filter(i => i.type === 'video').length}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-gray-500 font-bold text-sm uppercase">Заметки / Рефлексия</span>
                        <span className="text-2xl font-black text-emerald-600">{items.filter(i => i.comment).length}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            
            {(mode !== AppMode.GALLERY && mode !== AppMode.CAREER) && (
              <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                 <div className="relative z-10">
                   <h3 className="text-2xl font-black mb-2 italic">СОВЕТЫ ДИЗАЙНЕРАМ</h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                     Если генерация выдает ошибку доступа, убедитесь, что ваш API-ключ активен и поддерживает выбранную модель в вашем регионе.
                   </p>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
              </div>
            )}
          </div>

          {/* Right Panel: Preview and Gallery */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode === AppMode.GALLERY ? 'gallery' : 'preview'}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="h-full"
              >
                {mode === AppMode.GALLERY ? (
                  <Gallery 
                    items={items} 
                    onDelete={handleDelete} 
                    onUpdateComment={handleUpdateComment} 
                  />
                ) : (
                  <div className="sticky top-28 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 p-2">
                      <div className="aspect-video bg-gray-50 relative rounded-[2rem] overflow-hidden flex items-center justify-center border border-gray-50 shadow-inner">
                        {isGenerating ? (
                          <div className="w-full h-full bg-gray-100/50 flex flex-col items-center justify-center p-6 space-y-4 animate-pulse">
                            <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 shadow-lg shadow-red-100">
                              <svg className="animate-spin h-8 w-8 text-red-600" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </div>
                            <div className="space-y-2 text-center w-full max-w-xs">
                              <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
                              <div className="h-3 bg-gray-200 rounded-full w-1/2 mx-auto"></div>
                            </div>
                            <p className="text-xs text-red-600 font-black uppercase tracking-widest animate-bounce">
                              {mode === AppMode.VIDEO ? 'СИНТЕЗ ВИДЕОКАДРОВ...' : 'ОБУЧЕНИЕ НЕЙРОСЕТИ И РЕНДЕРИНГ...'}
                            </p>
                          </div>
                        ) : latestItem ? (
                          latestItem.type === 'video' ? (
                            latestItem.url ? (
                              <video src={latestItem.url} controls className="w-full h-full object-cover animate-in fade-in duration-500" autoPlay />
                            ) : (
                              <div className="text-center p-8 text-gray-400 font-bold uppercase tracking-wider text-xs">Ссылка на видео истекла</div>
                            )
                          ) : (
                            <img src={latestItem.url} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-500" />
                          )
                        ) : (
                          <div className="text-center p-12">
                            <div className="w-24 h-24 bg-white shadow-xl rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 italic">ПРЕВЬЮ</h3>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto font-medium">
                              Здесь появится ваш результат. Если возникает ошибка "Region not supported", попробуйте Pro модель.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {latestItem && !isGenerating && (
                      <div className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-xl shadow-gray-100/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-3 duration-300">
                        <div className="text-left space-y-1 w-full sm:w-auto">
                          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block">Сгенерированный файл:</span>
                          <p className="text-xs text-gray-700 font-extrabold truncate max-w-[280px]">
                            {latestItem.careerTitle ? `Кейс: ${latestItem.careerTitle}` : `Свободный промпт: ${latestItem.prompt}`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDownload(
                            latestItem.url, 
                            `ai-navigator-${latestItem.careerId || 'media'}-${Date.now()}.${latestItem.type === 'video' ? 'mp4' : 'png'}`
                          )}
                          className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                          СКАЧАТЬ ФАЙЛ
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} AI Career Navigator Studio | Moscow State University
          </p>
        </div>
      </footer>

      <OnboardingTour 
        isOpen={isTourOpen} 
        onClose={() => {
          setIsTourOpen(false);
          try {
            localStorage.setItem('nav_has_seen_tour_v2', 'true');
          } catch (e) {}
        }} 
        onSelectMode={(targetMode) => {
          setMode(targetMode);
          setIsTourOpen(false);
        }}
      />
    </div>
  );
};

export default App;
