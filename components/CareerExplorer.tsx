
import React, { useState } from 'react';
import { AI_CAREERS } from '../constants';
import { AICareer, GeneratedMedia } from '../types';
import { generateImage } from '../geminiService';

interface CareerExplorerProps {
  onMediaGenerated: (media: GeneratedMedia) => void;
}

const CareerExplorer: React.FC<CareerExplorerProps> = ({ onMediaGenerated }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...new Set(AI_CAREERS.map(c => c.category))];
  const filteredCareers = selectedCategory === 'All' 
    ? AI_CAREERS 
    : AI_CAREERS.filter(c => c.category === selectedCategory);

  const handleCareerSelect = async (career: AICareer) => {
    setLoading(career.id);
    try {
      const prompt = `A professional photorealistic portrait of a young person with Slavic appearance working as ${career.title}. 
      Environment: High-tech futuristic office in Moscow, digital screens with AI code and data visualizations. 
      Lighting: Soft cinematic lighting, red and white color palette accents. 
      Atmosphere: Professional, inspired, successful. 8k, highly detailed.`;
      
      const imageUrl = await generateImage(prompt, "16:9");
      
      const newMedia: GeneratedMedia = {
        id: crypto.randomUUID(),
        url: imageUrl,
        type: 'image',
        prompt: `Визуализация будущего: ${career.title}`,
        aspectRatio: '16:9',
        timestamp: Date.now(),
      };
      onMediaGenerated(newMedia);
    } catch (error) {
      alert('Ошибка визуализации карьеры');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-gradient p-8 rounded-3xl text-white shadow-xl shadow-red-100">
        <h2 className="text-3xl font-black mb-2">ТВОЁ БУДУЩЕЕ В ИИ</h2>
        <p className="text-red-100 font-medium">Выбери профессию и посмотри, как ты будешь выглядеть через несколько лет. Мы подготовили более 20 направлений.</p>
        
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat ? 'bg-white text-red-600' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredCareers.map((career) => (
          <div 
            key={career.id}
            onClick={() => !loading && handleCareerSelect(career)}
            className={`group p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden ${loading === career.id ? 'ring-2 ring-red-500' : ''}`}
          >
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase text-red-500 tracking-wider bg-red-50 px-2 py-0.5 rounded">{career.category}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-2">{career.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{career.description}</p>
            </div>
            
            {loading === career.id && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <span className="text-[10px] font-bold text-red-600 uppercase">Генерация пути...</span>
                </div>
              </div>
            )}
            
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerExplorer;
