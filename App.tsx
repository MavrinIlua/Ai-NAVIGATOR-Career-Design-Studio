
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import CareerExplorer from './components/CareerExplorer';
import Gallery from './components/Gallery';
import { AppMode, GeneratedMedia } from './types';

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
        <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center space-y-8">
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
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      <Header mode={mode} setMode={setMode} />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-6 space-y-10">
            {mode === AppMode.IMAGE || mode === AppMode.VIDEO ? (
              <ImageGenerator mode={mode} onMediaGenerated={handleMediaResult} />
            ) : mode === AppMode.EDIT ? (
              <ImageEditor onImageEdited={handleMediaResult} />
            ) : mode === AppMode.CAREER ? (
              <CareerExplorer onMediaGenerated={handleMediaResult} />
            ) : (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Статистика</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <span className="text-gray-500 font-bold text-sm uppercase">Объекты</span>
                    <span className="text-2xl font-black text-red-600">{items.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <span className="text-gray-500 font-bold text-sm uppercase">Видео</span>
                    <span className="text-2xl font-black text-amber-500">{items.filter(i => i.type === 'video').length}</span>
                  </div>
                </div>
              </div>
            )}
            
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

          <div className="lg:col-span-6">
            {mode === AppMode.GALLERY ? (
              <Gallery items={items} onDelete={handleDelete} />
            ) : (
              <div className="sticky top-28 space-y-6">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 p-2">
                  <div className="aspect-video bg-gray-50 relative rounded-[2rem] overflow-hidden flex items-center justify-center border border-gray-50 shadow-inner">
                    {latestItem ? (
                      latestItem.type === 'video' ? (
                        latestItem.url ? (
                          <video src={latestItem.url} controls className="w-full h-full object-cover" autoPlay />
                        ) : (
                          <div className="text-center p-8 text-gray-400">Ссылка на видео истекла</div>
                        )
                      ) : (
                        <img src={latestItem.url} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-1000" />
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
              </div>
            )}
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
    </div>
  );
};

export default App;
