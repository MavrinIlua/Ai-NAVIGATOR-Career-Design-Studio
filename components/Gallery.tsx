import React, { useState } from 'react';
import { GeneratedMedia } from '../types';

interface GalleryProps {
  items: GeneratedMedia[];
  onDelete: (id: string) => void;
  onUpdateComment?: (id: string, comment: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ items, onDelete, onUpdateComment }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState<string>('');

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Галерея пуста</h3>
        <p className="text-gray-500 max-w-sm mx-auto mt-2">Начни создавать своё будущее через генерацию контента.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {items.map((item) => {
        const ar = item.aspectRatio || "16:9";
        const type = item.type || "image";
        const isExpired = type === 'video' && !item.url;
        
        return (
          <div 
            key={item.id} 
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
          >
            <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: ar.replace(':', '/') }}>
              {isExpired ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gray-50">
                  <svg className="text-gray-300 mb-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/><line x1="2" y1="18" x2="22" y2="6"/></svg>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Видео удалено из памяти</span>
                </div>
              ) : type === 'video' ? (
                <video 
                  src={item.url} 
                  controls 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={item.url} 
                  alt={item.prompt} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              )}
              
              <div className="absolute top-2 left-2 z-10 flex gap-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white shadow-sm ${type === 'video' ? 'bg-amber-500' : 'bg-red-600'}`}>
                  {type}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-black/50 text-white backdrop-blur-md">
                  {ar}
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="flex justify-between items-center">
                  {!isExpired && (
                    <a 
                      href={item.url} 
                      download={`ai-nav-${item.id}.${type === 'video' ? 'mp4' : 'png'}`}
                      className="p-3 bg-white text-gray-900 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-xl"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    </a>
                  )}
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="p-3 bg-white/20 text-white rounded-xl hover:bg-red-600 transition-all backdrop-blur-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                  {item.careerTitle && (
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      item.isTrial 
                        ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                        : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {item.isTrial ? '🏆 КЕЙС' : '👤 ПРОФИЛЬ'}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-700 font-medium leading-relaxed mb-3">
                  "{item.prompt}"
                </p>

                {item.careerTitle && (
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Профессия:</span>
                    <span className="text-[10px] text-gray-900 font-black uppercase tracking-tight">
                      {item.careerTitle}
                    </span>
                  </div>
                )}
              </div>

              {/* Reflection Comments / Notes block */}
              <div className="mt-2 pt-3 border-t border-gray-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider flex items-center gap-1">
                    📝 Рефлексия (Заметки):
                  </span>
                  {editingId !== item.id && (
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setTempComment(item.comment || '');
                      }}
                      className="text-[9px] font-black text-red-600 hover:text-red-700 uppercase tracking-widest transition-colors"
                    >
                      {item.comment ? 'Изм.' : '+ Добавить'}
                    </button>
                  )}
                </div>

                {editingId === item.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={tempComment}
                      onChange={(e) => setTempComment(e.target.value)}
                      placeholder="Почему выбран этот путь? Какие ИИ-инструменты помогли? Что нового удалось узнать в симуляции?"
                      className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-700 focus:bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none h-20 placeholder:text-gray-400"
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 text-[9px] font-black uppercase text-gray-400 hover:text-gray-600"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={() => {
                          if (onUpdateComment) onUpdateComment(item.id, tempComment);
                          setEditingId(null);
                        }}
                        className="px-2.5 py-1 bg-red-600 text-white rounded text-[9px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-sm"
                      >
                        Сохранить
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50/70 p-2.5 rounded-xl border border-gray-100/50 min-h-[36px] flex items-center">
                    {item.comment ? (
                      <p className="text-[11px] text-gray-600 font-medium italic leading-relaxed">
                        «{item.comment}»
                      </p>
                    ) : (
                      <p className="text-[10px] text-gray-400 font-medium italic leading-relaxed">
                        Напишите свои выводы по кейсу для дипломной работы...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Gallery;
