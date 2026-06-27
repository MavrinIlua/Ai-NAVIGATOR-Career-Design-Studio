import React, { useState } from 'react';
import { AI_CAREERS } from '../constants';
import { AICareer, GeneratedMedia } from '../types';
import { generateImage } from '../geminiService';
import { SuccessAnalytics } from './SuccessAnalytics';
import { AprobationSurvey } from './AprobationSurvey';
import { ResearcherAnalytics } from './ResearcherAnalytics';

interface CareerExplorerProps {
  onMediaGenerated: (media: GeneratedMedia) => void;
  activeTrial: AICareer | null;
  onStartTrial: (career: AICareer) => void;
  onLoadingStateChange?: (loading: boolean) => void;
  items: GeneratedMedia[];
  studentName?: string;
}

const CareerExplorer: React.FC<CareerExplorerProps> = ({ 
  onMediaGenerated, 
  activeTrial, 
  onStartTrial,
  onLoadingStateChange,
  items,
  studentName
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCareer, setSelectedCareer] = useState<AICareer | null>(AI_CAREERS[0] || null);
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'analytics' | 'researcher' | 'survey'>('catalog');

  const categories = ['All', ...new Set(AI_CAREERS.map(c => c.category))];
  const filteredCareers = selectedCategory === 'All' 
    ? AI_CAREERS 
    : AI_CAREERS.filter(c => c.category === selectedCategory);

  const handleGenerateAvatar = async (career: AICareer, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(career.id);
    if (onLoadingStateChange) onLoadingStateChange(true);
    try {
      const prompt = `A professional photorealistic portrait of a young person with Slavic appearance working as ${career.title}. 
      Environment: High-tech futuristic office in Moscow, digital screens with AI code and data visualizations. 
      Lighting: Soft cinematic lighting, red and white color palette accents. 
      Atmosphere: Professional, inspired, successful. 8k, highly detailed.`;
      
      const imageUrl = await generateImage(prompt, "16:9");
      
      // Safe UUID generation
      const id = typeof crypto.randomUUID === 'function' 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 11);

      const newMedia: GeneratedMedia = {
        id: id,
        url: imageUrl,
        type: 'image',
        prompt: `Портрет специалиста: ${career.title}`,
        aspectRatio: '16:9',
        timestamp: Date.now(),
        careerId: career.id,
        careerTitle: career.title,
        isTrial: false
      };
      onMediaGenerated(newMedia);
    } catch (error) {
      alert('Ошибка при визуализации портрета роли');
    } finally {
      setLoading(null);
      if (onLoadingStateChange) onLoadingStateChange(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Header */}
      <div className="bg-red-gradient p-8 rounded-[2.5rem] text-white shadow-xl shadow-red-100 relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <span className="text-[10px] font-black tracking-widest uppercase bg-white/20 text-white px-3 py-1 rounded-full">
            Навигатор профессий будущего
          </span>
          <h2 className="text-3xl font-black mt-3 mb-2 uppercase tracking-tight">ТВОЁ БУДУЩЕЕ В ИИ</h2>
          <p className="text-red-100 text-sm font-medium leading-relaxed">
            Изучи требования реальных работодателей, примерь на себя роли разработчиков, инженеров, этиков ИИ и сформируй цифровое портфолио в рамках профессиональных проб.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 blur-3xl rounded-full"></div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex flex-wrap border-b border-gray-100 pb-1 gap-1">
        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`px-4 py-3 border-b-2 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeSubTab === 'catalog'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <span>🎯</span> КАРТЫ ПРОФЕССИЙ
        </button>
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-4 py-3 border-b-2 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeSubTab === 'analytics'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <span>📊</span> АНАЛИТИКА УСПЕХА
        </button>
        <button
          onClick={() => setActiveSubTab('researcher')}
          className={`px-4 py-3 border-b-2 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeSubTab === 'researcher'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <span>🔍</span> АНАЛИТИКА ИССЛЕДОВАТЕЛЯ
        </button>
        <button
          onClick={() => setActiveSubTab('survey')}
          className={`px-4 py-3 border-b-2 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeSubTab === 'survey'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <span>📝</span> АНКЕТА АПРОБАЦИИ
        </button>
      </div>

      {activeSubTab === 'analytics' ? (
        <SuccessAnalytics items={items} />
      ) : activeSubTab === 'researcher' ? (
        <ResearcherAnalytics items={items} />
      ) : activeSubTab === 'survey' ? (
        <AprobationSurvey 
          currentStudentName={studentName || 'Маврин Илья Борисович'} 
          onSurveySubmitted={() => setActiveSubTab('researcher')} 
        />
      ) : (
        <>
          {/* Categories Filter */}
          <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-100">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat 
                    ? 'bg-red-600 text-white shadow-md shadow-red-100' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Careers List (Left Side) */}
            <div className="md:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCareers.map((career) => {
                const isSelected = selectedCareer?.id === career.id;
                const isCurrentTrial = activeTrial?.id === career.id;
                
                return (
                  <div 
                    key={career.id}
                    onClick={() => setSelectedCareer(career)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected 
                        ? 'bg-red-50/50 border-red-200 shadow-md shadow-red-50 ring-1 ring-red-400' 
                        : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className="relative z-10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-red-500 tracking-wider bg-red-50 px-2 py-0.5 rounded">
                          {career.category}
                        </span>
                        {isCurrentTrial && (
                          <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded animate-pulse">
                            Активная проба
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-extrabold text-gray-900 group-hover:text-red-600 transition-colors">
                        {career.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {career.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Career Detail & Professional Sandbox Quest (Right Side) */}
            <div className="md:col-span-7">
              {selectedCareer ? (
                <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm space-y-6">
                  
                  {/* Title & Description */}
                  <div className="border-b border-gray-50 pb-5">
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                      {selectedCareer.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed mt-2">
                      {selectedCareer.description}
                    </p>
                  </div>

                  {/* Dynamic Tasks List */}
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                      🎯 Основные задачи специалиста:
                    </h4>
                    <ul className="space-y-2">
                      {selectedCareer.tasks.map((task, i) => (
                        <li key={i} className="flex items-start text-xs text-gray-700 font-medium leading-relaxed">
                          <span className="text-red-500 mr-2 font-black">•</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Typical Day Schedule */}
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                      ⏰ Типичный рабочий день:
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50 space-y-2">
                      {selectedCareer.schedule.map((slot, i) => (
                        <p key={i} className="text-xs text-gray-600 font-medium font-mono">
                          {slot}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Sandbox Quest & Suggested Prompts */}
                  <div className="bg-gradient-to-br from-red-50/50 to-amber-50/30 border border-red-100/50 p-5 rounded-2xl space-y-4">
                    <div>
                      <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">
                        ПРОФЕССИОНАЛЬНАЯ ПРОБА (ПРАКТИКА)
                      </span>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight mt-1">
                        Проектирование Сценария / Симуляция
                      </h4>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed mt-2">
                        {selectedCareer.questDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-red-100/50 space-y-2">
                      <span className="text-[9px] font-black text-gray-400 uppercase">
                        Рекомендованные ИИ-промпты для старта:
                      </span>
                      {selectedCareer.suggestedPrompts.map((p, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 space-y-1">
                          <h5 className="text-[10px] font-black text-gray-900 uppercase">{p.title}</h5>
                          <p className="text-[10px] text-gray-500 italic leading-relaxed">
                            "{p.prompt}"
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Pro Tips */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black text-gray-400 uppercase">Лайфхаки по генерации:</span>
                      <ul className="space-y-1">
                        {selectedCareer.proTips.map((tip, i) => (
                          <li key={i} className="text-[10px] text-gray-500 leading-relaxed font-medium">
                            💡 {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-50">
                    <button
                      onClick={() => onStartTrial(selectedCareer)}
                      className="flex-grow py-4 px-6 bg-red-600 text-white rounded-xl font-black text-sm uppercase shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-[0.98] text-center"
                    >
                      🎯 Начать профессиональную пробу
                    </button>
                    
                     <button
                      onClick={(e) => handleGenerateAvatar(selectedCareer, e)}
                      disabled={loading !== null}
                      className={`py-4 px-6 rounded-xl font-extrabold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
                        loading === selectedCareer.id 
                          ? 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 text-gray-400 cursor-not-allowed animate-pulse shadow-sm' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {loading === selectedCareer.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          ВИЗУАЛИЗАЦИЯ...
                        </>
                      ) : (
                        '🖼️ Сгенерировать портрет роли'
                      )}
                    </button>
                  </div>

                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center text-gray-400">
                  Выбери профессию из списка, чтобы подробно изучить её и начать пробу.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CareerExplorer;
