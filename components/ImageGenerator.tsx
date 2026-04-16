
import React, { useState } from 'react';
import { generateImage, generateVideo } from '../geminiService';
import { ASPECT_RATIOS } from '../constants';
import { GeneratedMedia, AspectRatio, AppMode } from '../types';

interface ImageGeneratorProps {
  mode: AppMode;
  onMediaGenerated: (media: GeneratedMedia) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ mode, onMediaGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Photorealistic, cinematic lighting, 8k');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [usePro, setUsePro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const fullPrompt = `${prompt}. Style: ${style}. High quality, detailed.`;
      let mediaUrl = '';
      
      if (mode === AppMode.VIDEO) {
        mediaUrl = await generateVideo(fullPrompt, aspectRatio === '9:16' ? '9:16' : '16:9');
      } else {
        mediaUrl = await generateImage(fullPrompt, aspectRatio, usePro);
      }

      // Safe UUID generation
      const id = typeof crypto.randomUUID === 'function' 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 11);

      const newMedia: GeneratedMedia = {
        id: id,
        url: mediaUrl,
        type: mode === AppMode.VIDEO ? 'video' : 'image',
        prompt: prompt,
        aspectRatio: aspectRatio,
        timestamp: Date.now(),
      };
      onMediaGenerated(newMedia);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(message);
      // Fix: Reset key selection state and prompt user to select a key again via openSelectKey() if Requested entity was not found
      if (message.includes("Requested entity was not found")) {
        window.aistudio.openSelectKey();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-xl ${mode === AppMode.VIDEO ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                {mode === AppMode.VIDEO ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                )}
             </div>
             <div>
               <h2 className="text-xl font-bold text-gray-900">{mode === AppMode.VIDEO ? 'Генерация Видео' : 'Генерация Изображения'}</h2>
               <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Создайте контент в любом стиле</p>
             </div>
          </div>

          {mode === AppMode.IMAGE && (
            <label className="flex items-center gap-2 cursor-pointer group">
              <span className={`text-[10px] font-bold uppercase transition-colors ${usePro ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}>Pro Model</span>
              <div 
                onClick={() => setUsePro(!usePro)}
                className={`w-10 h-5 rounded-full relative transition-all border ${usePro ? 'bg-red-600 border-red-600' : 'bg-gray-100 border-gray-200'}`}
              >
                <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all ${usePro ? 'left-5.5' : 'left-1'}`} />
              </div>
            </label>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Что изобразить?</label>
            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Например: Робот-повар в уютном кафе на Марсе..."
              className="w-full h-24 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Желаемый стиль</label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="Например: Киберпанк, Неоновое освещение, 3D рендер..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Формат (Aspect Ratio)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.value}
                  onClick={() => setAspectRatio(ar.value)}
                  className={`py-2 px-1 text-[10px] sm:text-xs font-bold rounded-lg border transition-all ${
                    aspectRatio === ar.value 
                      ? 'bg-red-600 border-red-600 text-white shadow-md' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-red-200'
                  }`}
                >
                  {ar.label}
                </button>
              ))}
            </div>
            {mode === AppMode.VIDEO && (aspectRatio !== '16:9' && aspectRatio !== '9:16') && (
              <p className="text-[10px] text-amber-600 font-bold mt-1">Видео поддерживает только 16:9 и 9:16</p>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <svg className="text-red-500 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <p className="text-xs text-red-800 font-medium leading-relaxed">{error}</p>
          </div>
        )}

        <button
          onClick={handleAction}
          disabled={loading || !prompt.trim()}
          className={`mt-6 w-full py-4 rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            loading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : mode === AppMode.VIDEO ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {mode === AppMode.VIDEO ? 'Создаем видео...' : 'Генерируем...'}
            </>
          ) : (
            <>
              {mode === AppMode.VIDEO ? 'СОЗДАТЬ ВИДЕО' : 'СОЗДАТЬ ФОТО'}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageGenerator;
