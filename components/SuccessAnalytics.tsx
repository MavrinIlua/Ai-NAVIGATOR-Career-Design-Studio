import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { AI_CAREERS } from '../constants';
import { GeneratedMedia } from '../types';

interface SuccessAnalyticsProps {
  items: GeneratedMedia[];
}

export const SuccessAnalytics: React.FC<SuccessAnalyticsProps> = ({ items }) => {
  // 1. Calculate General Stats
  const exploredCareerIds = new Set(items.filter(i => i.careerId).map(i => i.careerId));
  const exploredCount = exploredCareerIds.size;
  const totalCareersCount = AI_CAREERS.length;
  const completedTrialsCount = items.filter(i => i.isTrial).length;
  const totalMediaGenerated = items.length;
  
  // Simulated learning time: 15 mins per media, 45 mins per trial
  const simulatedTimeMinutes = (items.length * 15) + (items.filter(i => i.isTrial).length * 30);
  const hours = Math.floor(simulatedTimeMinutes / 60);
  const mins = simulatedTimeMinutes % 60;

  // 2. Dynamic Categories Stats for BarChart
  const categoryCountMap = AI_CAREERS.reduce((acc, career) => {
    const mediaCount = items.filter(item => item.careerId === career.id).length;
    acc[career.category] = (acc[career.category] || 0) + mediaCount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryCountMap).map(([name, count]) => ({
    name,
    count
  }));

  // 3. Status/Skills Distribution for PieChart
  const skillTypes = {
    'Системный анализ': items.filter(i => i.careerId === 'ds' || i.careerId === 'ml-eng').length * 25 + 10,
    'Промпт-дизайн': items.filter(i => i.careerId === 'prompt' || i.type === 'image').length * 20 + 15,
    'Креативное мышление': items.filter(i => i.careerId === 'ai-artist' || i.careerId === 'avatar-designer').length * 30 + 10,
    'Этика ИИ': items.filter(i => i.careerId === 'ai-ethicist').length * 40 + 5,
  };

  const pieData = Object.entries(skillTypes).map(([name, value]) => ({
    name,
    value: Math.min(100, value) // Cap at 100%
  }));

  // 4. Generate recommendations based on student's progress
  const getRecommendations = () => {
    const recs = [];
    
    if (exploredCount === 0) {
      recs.push({
        title: 'Первый карьерный шаг',
        text: 'Перейдите во вкладку «Профессии» и откройте карточку «ML-инженер» или «Data Scientist». Это базовые роли, формирующие фундамент ИИ-сферы.',
        badge: 'СТАРТ'
      });
    } else {
      recs.push({
        title: 'Погружение в промпт-инжиниринг',
        text: 'Пройдите профессиональную пробу в роли Промпт-инженера. Научитесь структурировать Few-Shot и Chain-of-Thought запросы для точного управления моделями.',
        badge: 'СИСТЕМНЫЙ НАВЫК'
      });
    }

    if (items.filter(i => i.type === 'video').length === 0) {
      recs.push({
        title: 'Освоение видеосинтеза',
        text: 'Попробуйте сгенерировать короткий видеоклип во вкладке «Видео». Мультимодальный синтез — одно из ключевых направлений развития ИИ в 2026 году.',
        badge: 'МУЛЬТИМЕДИА'
      });
    }

    const ethicistExplored = items.some(i => i.careerId === 'ai-ethicist');
    if (!ethicistExplored) {
      recs.push({
        title: 'Этика и безопасность ИИ',
        text: 'Изучите профиль «Этик ИИ». Понимание вопросов конфиденциальности данных и борьбы с галлюцинациями моделей критически важно для руководителя ИИ-проектов.',
        badge: 'БЕЗОПАСНОСТЬ'
      });
    }

    recs.push({
      title: 'Формирование портфолио для ВКР',
      text: 'Сохраните не менее 3-4 успешных кейсов в галерее. Эти результаты станут отличным эмпирическим подтверждением апробации вашего ВКР.',
      badge: 'АКАДЕМИЧЕСКИЙ'
    });

    return recs;
  };

  const recommendations = getRecommendations();

  const COLORS = ['#DC2626', '#F59E0B', '#10B981', '#3B82F6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Изучено профессий:</span>
          <div>
            <div className="text-3xl font-black text-gray-900 flex items-baseline">
              {exploredCount}
              <span className="text-xs text-gray-400 font-bold ml-1">/ {totalCareersCount}</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-red-600 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${(exploredCount / totalCareersCount) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Выполнено кейсов:</span>
          <div>
            <div className="text-3xl font-black text-amber-500 flex items-baseline">
              {completedTrialsCount}
              <span className="text-xs text-gray-400 font-bold ml-1">успешно</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-2">Цифровой след для отчёта практики</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Всего генераций:</span>
          <div>
            <div className="text-3xl font-black text-red-600">
              {totalMediaGenerated} <span className="text-xs text-gray-400 font-bold">файлов</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-2">База данных результатов</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Время в симуляции:</span>
          <div>
            <div className="text-3xl font-black text-gray-900">
              {hours}ч {mins}м
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-2">Общая ИИ-активность</p>
          </div>
        </div>
      </div>

      {/* Recharts Graphics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Bar Chart - Left */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">активность по категориям</span>
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight mt-0.5">Исследование секторов ИИ</h4>
            </div>
          </div>
          <div className="h-64 w-full">
            {chartData.length === 0 || chartData.every(d => d.count === 0) ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                <span>Нет данных для построения графика.</span>
                <span className="text-[10px] mt-1 font-bold uppercase">Сделайте первую пробу в любой профессии!</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#9CA3AF', fontSize: 10 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #F3F4F6', fontSize: '12px' }}
                    labelClassName="font-extrabold text-gray-900"
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pie Chart - Right */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div>
            <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">карта компетенций</span>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight mt-0.5">Профиль ИИ-навыков</h4>
          </div>
          <div className="h-44 w-full relative mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #F3F4F6', fontSize: '11px' }}
                  formatter={(value) => [`${value}%`, 'Освоено']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black text-gray-400 uppercase">Оценка</span>
              <span className="text-lg font-black text-gray-800">VKR-READY</span>
            </div>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-gray-50">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[10px] text-gray-600 font-extrabold truncate uppercase tracking-tight">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations & Master Thesis advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommendations list */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div>
            <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Индивидуальная траектория</span>
            <h4 className="text-base font-black text-gray-900 uppercase tracking-tight mt-0.5">Рекомендации по развитию</h4>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                <span className="text-lg mt-0.5">🚀</span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-black text-gray-900 uppercase">{rec.title}</h5>
                    <span className="text-[8px] font-black text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.2 rounded">
                      {rec.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{rec.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Master thesis integration block */}
        <div className="bg-gradient-to-br from-red-50 to-amber-50 border border-red-100/50 p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Интеграция в дипломную работу</span>
            </div>
            <h4 className="text-base font-black text-gray-900 uppercase tracking-tight">
              Научное обоснование методического продукта
            </h4>
            <p className="text-xs text-red-900 font-medium leading-relaxed">
              Компонент «Аналитика успеха» выступает в качестве <strong>инструмента формирующего оценивания</strong> и мониторинга образовательных результатов студентов. В вашей ВКР этот блок описывается как автоматизированная подсистема рефлексии и трассировки цифрового следа обучающегося.
            </p>
            <div className="bg-white/80 p-3.5 rounded-xl border border-red-200/50 space-y-1 mt-2">
              <span className="text-[9px] font-black text-gray-400 uppercase">Что вписать в главу 3 диплома:</span>
              <p className="text-[10px] text-gray-700 italic font-medium leading-relaxed">
                «Для сбора эмпирических данных внедрен дашборд на основе библиотеки Recharts. Он позволяет преподавателю контролировать траекторию пробы, а студенту — визуализировать приращение профессиональных ИИ-компетенций в реальном времени».
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
