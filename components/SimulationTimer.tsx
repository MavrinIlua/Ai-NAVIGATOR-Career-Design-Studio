import React, { useState, useEffect, useRef } from 'react';
import { AICareer } from '../types';

interface SimulationTimerProps {
  activeTrial: AICareer;
  onTimeSpentUpdate: (realSeconds: number, simulatedHours: number) => void;
  onWorkdayEnded: () => void;
}

export const SimulationTimer: React.FC<SimulationTimerProps> = ({ 
  activeTrial, 
  onTimeSpentUpdate,
  onWorkdayEnded 
}) => {
  const [simulatedHour, setSimulatedHour] = useState(9); // Start at 09:00
  const [simulatedMinute, setSimulatedMinute] = useState(0);
  const [realSeconds, setRealSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Time conversion: 1 real second = 10 simulated minutes
  // A 9-hour workday (09:00 - 18:00 = 540 minutes) takes 54 real seconds
  useEffect(() => {
    setSimulatedHour(9);
    setSimulatedMinute(0);
    setRealSeconds(0);
    setIsPaused(false);
  }, [activeTrial]);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setRealSeconds(prev => {
        const nextSeconds = prev + 1;
        
        // Calculate new simulated time
        setSimulatedMinute(min => {
          let nextMin = min + 10;
          if (nextMin >= 60) {
            setSimulatedHour(hr => {
              let nextHr = hr + 1;
              if (nextHr >= 18) {
                // Workday finished
                setIsPaused(true);
                if (timerRef.current) clearInterval(timerRef.current);
                onWorkdayEnded();
                return 18;
              }
              return nextHr;
            });
            return 0;
          }
          return nextMin;
        });

        // Report to parent
        const simHoursElapsed = (nextSeconds * 10) / 60;
        onTimeSpentUpdate(nextSeconds, simHoursElapsed);

        return nextSeconds;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeTrial]);

  // Determine current simulated task based on the hour
  const getCurrentTask = (hr: number) => {
    if (hr >= 9 && hr < 11) return { label: 'Утренний ИИ-стендап и планирование спринта', color: 'text-blue-600 bg-blue-50 border-blue-100' };
    if (hr >= 11 && hr < 13) return { label: 'Анализ датасета и промпт-дизайн сценария', color: 'text-amber-600 bg-amber-50 border-amber-100' };
    if (hr >= 13 && hr < 14) return { label: 'Обед и разгрузка нейросети разработчика', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
    if (hr >= 14 && hr < 17) return { label: 'Генеративный синтез, пробы и верификация', color: 'text-red-600 bg-red-50 border-red-100' };
    return { label: 'Ретроспектива, оценка качества и сдача спринта', color: 'text-purple-600 bg-purple-50 border-purple-100' };
  };

  const currentTask = getCurrentTask(simulatedHour);

  // Dynamic simulated cognitive load (varies with task)
  const getCognitiveLoad = (hr: number) => {
    if (hr >= 9 && hr < 11) return 45;
    if (hr >= 11 && hr < 13) return 75;
    if (hr >= 13 && hr < 14) return 15;
    if (hr >= 14 && hr < 17) return 90;
    return 60;
  };

  const load = getCognitiveLoad(simulatedHour);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3.5">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[9px] font-black text-red-600 uppercase tracking-widest block">Симулятор тайм-менеджмента</span>
          <h5 className="text-xs font-black text-gray-900 uppercase">Ритм рабочего дня эксперта</h5>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
            isPaused ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isPaused ? '▶ Старт' : '⏸ Пауза'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Clock */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center flex flex-col justify-center">
          <span className="text-[8px] font-black text-gray-400 uppercase">Имитационное время:</span>
          <span className="text-xl font-black text-gray-900 font-mono tracking-wider mt-0.5">
            {simulatedHour.toString().padStart(2, '0')}:{simulatedMinute.toString().padStart(2, '0')}
          </span>
          <span className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">Рабочий день</span>
        </div>

        {/* Real Elapsed Time */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center flex flex-col justify-center">
          <span className="text-[8px] font-black text-gray-400 uppercase">Астрономическое время:</span>
          <span className="text-xl font-black text-red-600 font-mono mt-0.5">
            {Math.floor(realSeconds / 60)}м {(realSeconds % 60).toString().padStart(2, '0')}с
          </span>
          <span className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">Время симуляции</span>
        </div>

        {/* Cognitive Load Indicator */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center flex flex-col justify-center">
          <span className="text-[8px] font-black text-gray-400 uppercase">Когнитивная нагрузка:</span>
          <span className="text-lg font-black text-gray-900 mt-0.5">{load}%</span>
          <div className="w-full bg-gray-200 h-1 rounded-full mt-1 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                load > 80 ? 'bg-red-600' : load > 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`} 
              style={{ width: `${load}%` }}
            />
          </div>
        </div>
      </div>

      {/* Simulated Current Task */}
      <div className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-tight flex items-center justify-between transition-colors ${currentTask.color}`}>
        <span>💼 Текущая задача: {currentTask.label}</span>
        {simulatedHour === 18 && (
          <span className="animate-ping w-2 h-2 rounded-full bg-red-600 shrink-0 ml-2" />
        )}
      </div>
    </div>
  );
};
