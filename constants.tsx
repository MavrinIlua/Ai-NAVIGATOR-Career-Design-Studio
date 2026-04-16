
import { AICareer, AspectRatio } from './types';

export const ASPECT_RATIOS: { label: string; value: AspectRatio }[] = [
  { label: '16:9 (Презентация)', value: '16:9' },
  { label: '9:16 (Mobile)', value: '9:16' },
  { label: '1:1 (Квадрат)', value: '1:1' },
  { label: '4:3 (Классика)', value: '4:3' },
];

export const PRESET_EDIT_COMMANDS = [
  'Добавить футуристичную сетку на пол',
  'Сделать освещение более холодным',
  'Добавить неоновые акценты',
  'Сделать стиль более киберпанк',
  'Добавить эффект дымки',
];

export const AI_CAREERS: AICareer[] = [
  { id: 'ml-eng', title: 'ML-инженер', category: 'Базовые', description: 'Разработка алгоритмов машинного обучения.' },
  { id: 'ds', title: 'Data Scientist', category: 'Базовые', description: 'Анализ больших данных и поиск закономерностей.' },
  { id: 'ai-eng', title: 'AI Engineer', category: 'Базовые', description: 'Создание интеллектуальных систем и приложений.' },
  { id: 'nlp', title: 'NLP Engineer', category: 'Специализированные', description: 'Работа с текстовыми данными и языковыми моделями.' },
  { id: 'cv', title: 'ML Engineer (Computer Vision)', category: 'Специализированные', description: 'Компьютерное зрение и анализ видео.' },
  { id: 'agent', title: 'Разработчик AI-агентов', category: 'Новые (2025)', description: 'Создание автономных цифровых помощников.' },
  { id: 'prompt', title: 'Промпт-инженер', category: 'Новые (2025)', description: 'Мастер управления нейросетями через запросы.' },
  { id: 'creator', title: 'AI Creator', category: 'Новые (2025)', description: 'Визуализация миров с помощью ИИ.' },
  { id: 'ops', title: 'MLOps специалист', category: 'Инфраструктура', description: 'Внедрение и поддержка ML-моделей.' },
  { id: 'data-eng', title: 'Data Engineer', category: 'Инфраструктура', description: 'Построение архитектуры хранения данных.' },
  { id: 'hr-ai', title: 'AI-разработчик для HR', category: 'Прикладные', description: 'Интеллектуальный подбор талантов.' },
  { id: 'recsys', title: 'Data Scientist (RecSys)', category: 'Прикладные', description: 'Создание рекомендательных систем.' },
  { id: 'steward', title: 'Data Steward', category: 'Аналитические', description: 'Управление качеством и этикой данных.' },
  { id: 'intern', title: 'Стажёр-инженер ML', category: 'Аналитические', description: 'Первые шаги в мультимодальных системах.' },
];
