import React, { useState } from 'react';

interface TourStep {
  title: string;
  badge: string;
  description: string;
  actionDesc: string;
  icon: string;
  expertContext: string;
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: any) => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose, onSelectMode }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps: TourStep[] = [
    {
      title: 'Карта ИИ-профессий будущего',
      badge: 'ШАГ 1: НАВИГАЦИЯ',
      description: 'Изучите каталог передовых специальностей: от AI-художника до Промпт-инженера. Каждый профиль содержит подробные требования к навыкам, описание типичного рабочего дня и реальные кейсы, которые приходится решать эксперту.',
      actionDesc: 'Перейдите в раздел "Профессии", выберите интересующую вас специальность и нажмите кнопку старта пробы.',
      icon: '🔍',
      expertContext: 'Имитирует этап карьерного проектирования: студент примеряет на себя роли из реального сектора ИИ-экономики.'
    },
    {
      title: 'Генерация профессионального портрета',
      badge: 'ШАГ 2: ВИЗУАЛИЗАЦИЯ',
      description: 'Каждому ИИ-эксперту важно визуализировать свое рабочее окружение. Наше приложение мгновенно задействует нейросеть Imagen 3, чтобы сгенерировать ваш детальный фотопортрет в футуристическом контексте выбранной профессии.',
      actionDesc: 'Нажмите "Сгенерировать портрет роли" в карточке профессии для создания визуального аватара.',
      icon: '🖼️',
      expertContext: 'Демонстрирует работу с генеративным ИИ (Text-to-Image) для создания качественных брендированных визуалов.'
    },
    {
      title: 'Интерактивная профпроба (Кейсы)',
      badge: 'ШАГ 3: ПОГРУЖЕНИЕ',
      description: 'Главная фишка — симуляция реального рабочего дня. Приложение выдает уникальный проблемный кейс (например, спроектировать интерфейс умного дома или создать афишу). Вам предстоит выступить в роли эксперта и решить задачу.',
      actionDesc: 'В режиме пробы промпт автоматически обогащается профессиональными терминами, направляя генерацию.',
      icon: '🏆',
      expertContext: 'Имитирует проектную работу: студент решает практическую задачу по ТЗ, используя генеративную систему.'
    },
    {
      title: 'Экспорт результатов и Галерея кейсов',
      badge: 'ШАГ 4: РЕЗУЛЬТАТ',
      description: 'Все созданные вами работы (изображения, видеоролики, исправленные концепты) сохраняются в облачную базу данных. Вы можете мгновенно скачать готовые медиафайлы на устройство или открыть общую галерею работ студентов.',
      actionDesc: 'Используйте кнопку "Скачать файл" под превью или перейдите во вкладку "Галерея" для просмотра чужих кейсов.',
      icon: '💾',
      expertContext: 'Портфолио-ориентированное обучение: формирование цифрового следа и коллекции выполненных кейсов.'
    }
  ];

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" id="onboarding-tour-overlay">
      <div 
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
        id="onboarding-tour-modal"
      >
        {/* Header */}
        <div className="p-6 pb-0 flex justify-between items-center">
          <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black tracking-widest uppercase border border-red-100/50">
            {step.badge}
          </span>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            title="Закрыть"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-3xl shadow-lg shadow-red-100 text-white">
              {step.icon}
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-tight uppercase tracking-tight">
                {step.title}
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Шаг {currentStep + 1} из {steps.length}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              {step.description}
            </p>
            <div className="pt-2 border-t border-gray-200/50 flex items-start gap-2">
              <span className="text-xs">💡</span>
              <p className="text-[11px] text-gray-500 font-bold italic">
                {step.actionDesc}
              </p>
            </div>
          </div>

          {/* Expert simulation section */}
          <div className="bg-red-50/50 border border-red-100/40 p-4 rounded-xl">
            <span className="text-[9px] font-black text-red-600 uppercase tracking-widest block mb-1">🎓 Как это работает в дипломной методике:</span>
            <p className="text-[10px] text-red-700 font-medium leading-relaxed">
              {step.expertContext}
            </p>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            onClick={prev}
            disabled={currentStep === 0}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              currentStep === 0 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Назад
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <span 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? 'w-5 bg-red-600' : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md shadow-red-200 transition-all"
          >
            {currentStep === steps.length - 1 ? 'Начать работу' : 'Далее'}
          </button>
        </div>
      </div>
    </div>
  );
};
