import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts';
import { AI_CAREERS } from '../constants';
import { GeneratedMedia } from '../types';

interface SurveyResponse {
  id: string;
  studentName: string;
  uxRating: number;
  utilityRating: number;
  timerRating: number;
  feedback: string;
  timestamp: number;
}

interface ProductivityLog {
  id: string;
  careerId: string;
  careerTitle: string;
  realDurationSeconds: number;
  simulatedHoursSpent: number;
  completedAt: number;
  studentName: string;
}

interface ResearcherAnalyticsProps {
  items: GeneratedMedia[];
}

export const ResearcherAnalytics: React.FC<ResearcherAnalyticsProps> = ({ items }) => {
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [productivityLogs, setProductivityLogs] = useState<ProductivityLog[]>([]);

  const loadData = () => {
    try {
      const savedSurveys = localStorage.getItem('nav_survey_results');
      setSurveys(savedSurveys ? JSON.parse(savedSurveys) : []);

      const savedLogs = localStorage.getItem('nav_productivity_logs');
      setProductivityLogs(savedLogs ? JSON.parse(savedLogs) : []);
    } catch (e) {
      console.error("Error loading research data", e);
    }
  };

  useEffect(() => {
    loadData();
    // Set up local storage listener to stay up-to-date
    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [items]);

  // Calculations for charts
  // 1. Profession popularity frequency
  const careerFrequency = AI_CAREERS.map(c => {
    const simulationCountFromMedia = items.filter(item => item.careerId === c.id).length;
    const simulationCountFromLogs = productivityLogs.filter(log => log.careerId === c.id).length;
    return {
      name: c.title,
      id: c.id,
      count: Math.max(simulationCountFromMedia, simulationCountFromLogs)
    };
  });

  const hasFrequencies = careerFrequency.some(c => c.count > 0);

  // 2. Average scores from surveys
  const totalSurveys = surveys.length;
  const avgUX = totalSurveys ? (surveys.reduce((acc, s) => acc + s.uxRating, 0) / totalSurveys).toFixed(2) : '5.00';
  const avgUtility = totalSurveys ? (surveys.reduce((acc, s) => acc + s.utilityRating, 0) / totalSurveys).toFixed(2) : '5.00';
  const avgTimer = totalSurveys ? (surveys.reduce((acc, s) => acc + s.timerRating, 0) / totalSurveys).toFixed(2) : '5.00';

  const surveyChartData = [
    { name: 'Удобство UX/UI', score: parseFloat(avgUX), fullMark: 5 },
    { name: 'Полезность ВКР', score: parseFloat(avgUtility), fullMark: 5 },
    { name: 'Темп симуляции', score: parseFloat(avgTimer), fullMark: 5 },
  ];

  // 3. Export full empirical data
  const handleExportData = () => {
    const dataset = {
      researcherName: localStorage.getItem('student_name_v2') || 'Маврин Илья Борисович',
      exportedAt: new Date().toISOString(),
      totalSimulations: items.length,
      surveyResponsesCount: surveys.length,
      productivityLogsCount: productivityLogs.length,
      surveyResponses: surveys,
      productivityLogs: productivityLogs,
      careerFrequencies: careerFrequency
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataset, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aprobation_data_vkr_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const COLORS = ['#DC2626', '#EA580C', '#EAB308', '#16A34A', '#2563EB', '#7C3AED', '#DB2777'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Research summary card */}
      <div className="bg-gradient-to-r from-gray-900 to-slate-800 text-white p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Апробация в научно-исследовательском контексте</span>
          <h4 className="text-lg font-black uppercase tracking-tight">Панель исследователя: Эмпирический базис ВКР</h4>
          <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-xl">
            Здесь аккумулируются результаты тестирования приложения вашими однокурсниками и коллегами. Скачайте структурированный массив данных для математического анализа в практической главе диплома.
          </p>
        </div>
        <button
          onClick={handleExportData}
          className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-red-900/40 shrink-0 self-stretch md:self-auto justify-center"
        >
          📥 Экспорт данных ВКР (.json)
        </button>
      </div>

      {/* Main KPI blocks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Участников апробации:</span>
          <div className="text-3xl font-black text-gray-900 mt-1">{surveys.length}</div>
          <span className="text-[10px] text-gray-400 font-bold uppercase mt-2 block">Анкет обратной связи</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Средняя оценка UX/UI:</span>
          <div className="text-3xl font-black text-blue-600 mt-1">{avgUX} <span className="text-xs text-gray-400">/ 5</span></div>
          <span className="text-[10px] text-gray-400 font-bold uppercase mt-2 block">Интерфейс и навигация</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Полезность для ВКР:</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">{avgUtility} <span className="text-xs text-gray-400">/ 5</span></div>
          <span className="text-[10px] text-gray-400 font-bold uppercase mt-2 block">Теоретический потенциал</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Оценка таймера дня:</span>
          <div className="text-3xl font-black text-amber-500 mt-1">{avgTimer} <span className="text-xs text-gray-400">/ 5</span></div>
          <span className="text-[10px] text-gray-400 font-bold uppercase mt-2 block">Ощущение темпа работы</span>
        </div>
      </div>

      {/* Recharts visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Popularity chart */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">выборка профессий</span>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight mt-0.5">Частота выбора ИИ-профессий в симуляциях</h4>
          </div>
          
          <div className="h-64 w-full mt-4">
            {!hasFrequencies ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                <span>Нет данных для построения распределения.</span>
                <span className="text-[10px] mt-1 font-bold uppercase">Пройдите профессиональную пробу в любой роли!</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={careerFrequency} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#9CA3AF', fontSize: 9, fontWeight: 'bold' }} 
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 10)}...` : value}
                  />
                  <YAxis 
                    tick={{ fill: '#9CA3AF', fontSize: 10 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #F3F4F6', fontSize: '11px' }}
                    labelClassName="font-extrabold text-gray-900"
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {careerFrequency.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Survey feedback scoring chart */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Оценка критериев продукта</span>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight mt-0.5">Средние показатели апробации</h4>
          </div>

          <div className="h-64 w-full mt-4 flex items-center justify-center relative">
            {surveys.length === 0 ? (
              <div className="text-gray-400 text-xs text-center p-4">
                <span>Нет анкетных отзывов.</span><br/>
                <span className="text-[9px] mt-1 font-bold uppercase">Заполните анкету или залейте тестовые данные!</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={surveyChartData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 5]} tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#374151', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #F3F4F6', fontSize: '11px' }} />
                  <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                    {surveyChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Productivity and Student simulation logs */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div>
          <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Журнал продуктивности учащихся</span>
          <h4 className="text-base font-black text-gray-900 uppercase tracking-tight mt-0.5">Внутренний реестр цифровых следов (Тайм-трекинг)</h4>
        </div>

        {productivityLogs.length === 0 ? (
          <p className="text-xs text-gray-400 font-medium italic">Реестр пуст. Проведите профессиональную пробу с таймером, чтобы зафиксировать первые цифровые следы...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider font-black">
                  <th className="py-3">Студент</th>
                  <th className="py-3">ИИ-Профессия</th>
                  <th className="py-3">Астрономическое время</th>
                  <th className="py-3">Имитационных часов</th>
                  <th className="py-3">Статус сдачи</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                {productivityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-extrabold uppercase text-gray-900 text-[10px] tracking-tight">{log.studentName}</td>
                    <td className="py-3 text-red-600 font-bold uppercase text-[10px]">{log.careerTitle}</td>
                    <td className="py-3 font-mono">{Math.floor(log.realDurationSeconds / 60)}м {log.realDurationSeconds % 60}с</td>
                    <td className="py-3 font-mono text-amber-600 font-bold">{log.simulatedHoursSpent.toFixed(1)} ч</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 rounded-md text-[9px] font-black uppercase">
                        УСПЕШНО
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review feeds */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div>
          <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Анкетный фидбек</span>
          <h4 className="text-base font-black text-gray-900 uppercase tracking-tight mt-0.5">Лента отзывов участников апробации</h4>
        </div>

        {surveys.length === 0 ? (
          <p className="text-xs text-gray-400 font-medium italic">Отзывов пока нет. Заполните анкету во вкладке «Анкета апробации».</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {surveys.map((survey) => (
              <div key={survey.id} className="p-4 bg-gray-50 border border-gray-100/60 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{survey.studentName}</h5>
                    <span className="text-[9px] text-gray-400">{new Date(survey.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-1 text-[10px] font-black text-amber-600">
                    <span>⭐ {((survey.uxRating + survey.utilityRating + survey.timerRating) / 3).toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-600 font-medium italic leading-relaxed">
                  «{survey.feedback}»
                </p>
                <div className="flex gap-2 pt-2 border-t border-gray-100 text-[9px] font-black uppercase text-gray-400">
                  <span>UX: {survey.uxRating}</span>
                  <span>Полезность: {survey.utilityRating}</span>
                  <span>Таймер: {survey.timerRating}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
