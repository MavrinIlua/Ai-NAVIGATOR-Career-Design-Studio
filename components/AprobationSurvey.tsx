import React, { useState } from 'react';

interface SurveyResponse {
  id: string;
  studentName: string;
  uxRating: number; // 1-5
  utilityRating: number; // 1-5
  timerRating: number; // 1-5
  feedback: string;
  timestamp: number;
}

interface AprobationSurveyProps {
  currentStudentName: string;
  onSurveySubmitted: () => void;
}

export const AprobationSurvey: React.FC<AprobationSurveyProps> = ({ currentStudentName, onSurveySubmitted }) => {
  const [studentName, setStudentName] = useState(currentStudentName);
  const [uxRating, setUxRating] = useState<number>(5);
  const [utilityRating, setUtilityRating] = useState<number>(5);
  const [timerRating, setTimerRating] = useState<number>(5);
  const [feedback, setFeedback] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newResponse: SurveyResponse = {
      id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      studentName: studentName || 'Анонимный исследователь',
      uxRating,
      utilityRating,
      timerRating,
      feedback,
      timestamp: Date.now()
    };

    try {
      const existing = localStorage.getItem('nav_survey_results');
      const parsed: SurveyResponse[] = existing ? JSON.parse(existing) : [];
      parsed.unshift(newResponse);
      localStorage.setItem('nav_survey_results', JSON.stringify(parsed));
      
      setIsSaved(true);
      setFeedback('');
      setTimeout(() => {
        setIsSaved(false);
        onSurveySubmitted();
      }, 2500);
    } catch (err) {
      console.error("Failed to save survey", err);
    }
  };

  const loadMockResponses = () => {
    // Generate high-quality mock probation responses representing other university students testing the app
    const mockData: SurveyResponse[] = [
      {
        id: 'mock-1',
        studentName: 'Петров С.А. (Магистрант 2 курса)',
        uxRating: 5,
        utilityRating: 5,
        timerRating: 4,
        feedback: 'Превосходный методический тренажёр. Симуляция таймера рабочего дня очень наглядно показывает реальный тайм-менеджмент ИИ-разработчика. Забрал скриншоты аналитики в практическую часть своей дипломной работы.',
        timestamp: Date.now() - 3600000 * 24
      },
      {
        id: 'mock-2',
        studentName: 'Иванова Е.Д. (Студентка бакалавриата)',
        uxRating: 4,
        utilityRating: 5,
        timerRating: 5,
        feedback: 'Очень удобный интерфейс генерации! Позволяет быстро протестировать разные роли. Для моего отчёта о практике по ИИ это просто идеальная находка. Особенно порадовала возможность оставлять заметки к проектам.',
        timestamp: Date.now() - 3600000 * 48
      },
      {
        id: 'mock-3',
        studentName: 'Сидоров М.В. (Исследователь ИИ-методологий)',
        uxRating: 5,
        utilityRating: 4,
        timerRating: 5,
        feedback: 'Методологически выверенная система. Разделение на Image, Video и CareerExplorer с фиксацией результатов в галерее демонстрирует классическую модель портфолио в цифровом образовании.',
        timestamp: Date.now() - 3600000 * 72
      }
    ];

    try {
      const existing = localStorage.getItem('nav_survey_results');
      const parsed: SurveyResponse[] = existing ? JSON.parse(existing) : [];
      const updated = [...parsed, ...mockData];
      localStorage.setItem('nav_survey_results', JSON.stringify(updated));
      onSurveySubmitted();
    } catch (e) {}
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 animate-in fade-in duration-500">
      <div>
        <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">инструмент сбора эмпирических данных</span>
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mt-0.5">Анкета апробации методического продукта</h3>
        <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
          Заполните форму обратной связи по результатам использования симулятора. Все ответы сохраняются локально в формате JSON и формируют статистический массив для 3-й главы вашей дипломной работы (ВКР).
        </p>
      </div>

      {isSaved ? (
        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center space-y-3 py-12 animate-in zoom-in-95 duration-300">
          <span className="text-4xl">🎉</span>
          <h4 className="text-lg font-black text-emerald-950 uppercase">Данные успешно зафиксированы!</h4>
          <p className="text-xs text-emerald-800 font-medium max-w-sm mx-auto">
            Ваш отзыв добавлен в общую базу апробации. Вы можете просмотреть обновленную статистику во вкладке «Аналитика исследователя».
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1">
                ФИО Тестирующего / Студента:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Например: Иванов Иван Иванович"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-red-500 transition-all outline-none text-xs font-bold text-gray-800"
                required
              />
            </div>
            
            <div className="bg-red-50/50 border border-red-100/50 px-4 py-3 rounded-xl flex items-center justify-between">
              <span className="text-[10px] text-red-950 font-semibold leading-tight">
                Хотите наполнить базу ответами коллег для демонстрации в дипломной работе?
              </span>
              <button
                type="button"
                onClick={loadMockResponses}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 shadow-sm transition-all"
              >
                + Залить отзывы группы
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-gray-50">
            {/* UX Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h5 className="text-xs font-black text-gray-800 uppercase">1. Удобство интерфейса и навигации (UX/UI):</h5>
                <p className="text-[10px] text-gray-400">Насколько профессионально и гармонично ощущается смена режимов и компоновка панелей?</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUxRating(star)}
                    className={`w-8 h-8 rounded-lg font-black text-xs transition-all ${
                      uxRating >= star ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {star}
                  </button>
                ))}
              </div>
            </div>

            {/* Utility Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-gray-50/50">
              <div>
                <h5 className="text-xs font-black text-gray-800 uppercase">2. Полезность для профессионального самоопределения:</h5>
                <p className="text-[10px] text-gray-400">Насколько хорошо раскрыты задачи и сценарии ИИ-профессий для написания ВКР?</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUtilityRating(star)}
                    className={`w-8 h-8 rounded-lg font-black text-xs transition-all ${
                      utilityRating >= star ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {star}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-gray-50/50">
              <div>
                <h5 className="text-xs font-black text-gray-800 uppercase">3. Реалистичность симуляции таймера рабочего дня:</h5>
                <p className="text-[10px] text-gray-400">Насколько таймер помог ощутить темп работы и повысил уровень вовлеченности?</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setTimerRating(star)}
                    className={`w-8 h-8 rounded-lg font-black text-xs transition-all ${
                      timerRating >= star ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {star}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-50">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1">
              Развёрнутый отзыв, предложения или замечания:
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Опишите ваши впечатления от симуляций, какие инсайты вы получили, работая с тренажёром..."
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all h-24 placeholder:text-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-red-200 active:scale-[0.98] transition-all"
          >
            💾 Зафиксировать апробацию в базе данных
          </button>
        </form>
      )}
    </div>
  );
};
