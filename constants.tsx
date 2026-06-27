
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
  {
    id: 'ml-eng',
    title: 'ML-инженер',
    category: 'Базовые',
    description: 'Специалист, который проектирует, обучает и внедряет сложные нейросети и математические модели.',
    tasks: [
      'Архитектурное проектирование моделей машинного обучения',
      'Подготовка и фильтрация тренировочных наборов данных',
      'Обучение и тонкая настройка сверточных и трансформерных сетей',
      'Оптимизация производительности моделей для интеграции в продакшн'
    ],
    schedule: [
      '10:00 — Стендап команды, синхронизация по текущим задачам',
      '11:00 — Анализ графиков сходимости функции потерь обученной ночью модели',
      '14:00 — Проектирование архитектуры новой глубокой сети на PyTorch',
      '17:00 — Написание тестов для проверки скорости отклика модели'
    ],
    questDescription: 'Ваша задача в роли ML-инженера — визуализировать футуристичный центр обработки данных, где в реальном времени идет процесс распределенного обучения глобальной языковой модели.',
    suggestedPrompts: [
      {
        title: 'Учебный суперкомпьютерный дата-центр',
        prompt: 'Futuristic quantum supercomputer datacenter inside a massive mountain cave, glowing red and white fiber-optic pipelines, server racks with liquid cooling vapor, holographic screens showing neural network graphs and real-time loss functions, cybernetic cyber-tech environment',
        style: 'Photorealistic, cinematic lighting, ultra-detailed, 8k'
      },
      {
        title: 'Голограмма структуры ИИ',
        prompt: 'SLavic female machine learning engineer interacting with a three-dimensional glowing neural network hologram in a clean minimalist lab, soft red neon accents, reflection of data matrices in the glass, advanced futuristic computing',
        style: 'Cinematic render, sci-fi concept art, highly detailed'
      }
    ],
    proTips: [
      'Укажите ключевые слова, связанные с архитектурой систем (quantum, supercomputer, server racks, liquid cooling).',
      'Добавьте визуальные элементы данных (holographic neural network graphs, loss functions).'
    ]
  },
  {
    id: 'ds',
    title: 'Data Scientist',
    category: 'Базовые',
    description: 'Исследователь данных, который находит скрытые зависимости в терабайтах информации и строит прогнозы.',
    tasks: [
      'Статистический и исследовательский анализ терабайтных логов',
      'Проектирование прогностических моделей бизнес-поведения',
      'Поиск корреляций и аномалий в разрозненных источниках информации',
      'Визуализация аналитических выводов для принятия управленческих решений'
    ],
    schedule: [
      '09:30 — Кофе и чтение свежих исследовательских статей с arXiv',
      '11:00 — Сбор данных из распределенного хранилища Hadoop через SQL-запросы',
      '14:00 — Построение корреляционных матриц и запуск Jupiter Notebook для очистки данных',
      '16:30 — Презентация гипотезы об изменении пользовательского спроса руководителю продукта'
    ],
    questDescription: 'В роли исследователя данных создайте наглядный концепт аналитического терминала будущего, который превращает хаотичные потоки Big Data в объемные трехмерные созвездия графиков.',
    suggestedPrompts: [
      {
        title: 'Космический терминал данных',
        prompt: 'Abstract three-dimensional data visualization as a nebula of glowing cyber stars and colorful connected vectors, a student in glass augmented reality glasses looking at the dataset hologram, dark background with binary code streams',
        style: 'Neon bioluminescent style, futuristic, ultra-precision'
      }
    ],
    proTips: [
      'Используйте метафоры физического мира для визуализации данных (nebula, solar system of data, connected vectors).',
      'Обязательно добавьте глубокий контрастный фон для выделения светящихся элементов.'
    ]
  },
  {
    id: 'prompt',
    title: 'Промпт-инженер',
    category: 'Новые (2025)',
    description: 'Эксперт по коммуникации с большими языковыми и диффузионными моделями, создающий идеальные промпты.',
    tasks: [
      'Проектирование и оптимизация сложных системных инструкций',
      'Разработка мета-промптов для адаптивного диалога нейросети',
      'Тестирование моделей на уязвимости (jailbreak) и устойчивость',
      'Синхронизация контекстных окон ИИ под конкретные прикладные сценарии'
    ],
    schedule: [
      '10:30 — Согласование с методистами требований к ответам учебного ИИ-ассистента',
      '11:30 — Тонкая калибровка температуры и параметров топ-р системного запроса',
      '13:30 — Сбор базы эталонных ответов модели и ручное исправление неточностей',
      '16:00 — Массовое A/B тестирование промптов на устойчивость к провокациям'
    ],
    questDescription: 'Освойте профессию промпт-инженера на практике. Ваша задача — сгенерировать сложную визуальную метафору процесса взаимодействия человека и ИИ: "Цифровой мост между мыслью человека и кремниевым чипом".',
    suggestedPrompts: [
      {
        title: 'Диалог Разумов',
        prompt: 'Mind connection visual metaphor, side-view profile silhouette of a human head filled with warm golden organic neural fibers facing a computer circuit board head glowing with sharp red and white data pathways, spark of creation at the touch point',
        style: 'Minimalist editorial graphic design, sharp focus, 8k'
      }
    ],
    proTips: [
      'Промпт-инженер мыслит точными контрастами. Укажите разделение цветов (warm golden vs sharp red and white).',
      'Задайте лаконичный стиль (minimalist editorial design) для получения аккуратной и дорогой картинки.'
    ]
  },
  {
    id: 'cv',
    title: 'ML Engineer (Computer Vision)',
    category: 'Специализированные',
    description: 'Инженер, обучающий роботов, дроны и умные камеры распознавать объекты в окружающем мире.',
    tasks: [
      'Разработка алгоритмов распознавания лиц и детекции объектов на лету',
      'Обучение сегментирующих моделей (U-Net, Mask R-CNN) для анализа сцен',
      'Оптимизация нейросетей для микроконтроллеров и умных устройств',
      'Интеграция компьютерного зрения в системы автопилотирования БПЛА'
    ],
    schedule: [
      '10:00 — Сборка отладочного стенда с камерой высокого разрешения',
      '12:00 — Запуск процесса дообучения модели YOLO на датасете дорожной разметки Москвы',
      '14:30 — Написание скрипта для отрисовки ограничивающих рамок (bounding boxes) поверх видеопотока',
      '17:00 — Тестирование работы детектора в условиях слабой освещенности'
    ],
    questDescription: 'Попробуйте себя в роли инженера компьютерного зрения для беспилотников. Сгенерируйте кадр с камеры БПЛА, летящего над городом, с наложением интерфейса разметки ИИ (рамки детекции объектов).',
    suggestedPrompts: [
      {
        title: 'Взгляд ИИ на город',
        prompt: 'Aerial drone view over Moscow city streets, advanced computer vision interface overlay, colorful semi-transparent bounding boxes around cars and pedestrians, digital segmentation heatmaps on roads, tech futuristic HUD overlay',
        style: 'Photorealistic, technical blueprint render, 8k'
      }
    ],
    proTips: [
      'Примените технические термины интерфейса в промпте (bounding boxes, computer vision interface overlay, HUD overlay).',
      'Это покажет умение инженера визуализировать то, как именно нейросеть «видит» физический мир.'
    ]
  },
  {
    id: 'agent',
    title: 'Разработчик AI-агентов',
    category: 'Новые (2025)',
    description: 'Создатель автономных интеллектуальных агентов, способных решать задачи без прямого контроля человека.',
    tasks: [
      'Разработка цепочек вызовов моделей (LangChain/Semantic Kernel)',
      'Проектирование алгоритмов принятия решений и логирования шагов',
      'Создание протоколов взаимодействия автономных ИИ-агентов друг с другом',
      'Интеграция агентов с внешними базами данных и сервисами планирования'
    ],
    schedule: [
      '09:30 — Разбор системных логов автономного агента за ночь',
      '11:00 — Реализация функции вызова внешнего API калькулятора агентом',
      '13:30 — Тестирование сценария, когда два ИИ-агента спорят о решении учебной математической задачи',
      '16:00 — Оптимизация расхода токенов в рекурсивном цикле размышления агента (ReAct)'
    ],
    questDescription: 'В роли разработчика ИИ-агентов создайте образ "виртуального офиса", где группа маленьких голографических роботов-ассистентов слаженно выполняют программирование учебной игры.',
    suggestedPrompts: [
      {
        title: 'Фабрика ИИ-агентов',
        prompt: 'A micro holographic desk display showing tiny glowing cute glass robots working together on a futuristic digital circuit playground, red and gold color scheme, isometric view, intricate mechanical details, fantasy tech',
        style: '3D render, Octane render style, highly detailed'
      }
    ],
    proTips: [
      'Используйте масштабные ориентиры (micro display, tiny robots) для создания глубины и фокусного расстояния.',
      'Это подчеркнет концепцию "маленьких автономных модулей", работающих как единый организм.'
    ]
  },
  {
    id: 'creator',
    title: 'AI Creator',
    category: 'Новые (2025)',
    description: 'Профессионал, создающий визуальные и видеоматериалы для игр, кино и рекламы с помощью генеративных систем.',
    tasks: [
      'Генерация концепт-артов и мудбордов для медиапроектов',
      'Создание анимированных видеороликов и переходов с помощью ИИ',
      'Редактирование и локальная дорисовка сгенерированного медиаконтента',
      'Стилизация физических съемок под заданную художественную эстетику'
    ],
    schedule: [
      '11:00 — Чтение сценария новой рекламной кампании для вуза',
      '12:00 — Быстрая генерация 20 вариантов визуального концепта',
      '15:00 — Тонкое ИИ-редактирование выбранных кадров (добавление деталей, корректировка света)',
      '17:30 — Сборка финального промо-ролика из сгенерированных фрагментов'
    ],
    questDescription: 'Погрузитесь в творческую профессию AI Creator. Ваша задача — создать кинематографичный постер о путешествиях будущего: "Летающий экологичный поезд в Альпах".',
    suggestedPrompts: [
      {
        title: 'Транспорт будущего',
        prompt: 'Cinematic wide shot of a futuristic sleek solar-powered levitating train flying over green majestic Swiss Alps canyons, waterfalls below, red design stripes on the vehicle, organic modern architecture station in distance',
        style: 'Photorealistic, cinematic atmospheric lighting, masterpiece, 8k'
      }
    ],
    proTips: [
      'Для творческой работы очень важен масштаб и атмосфера. Укажите тип кадра (cinematic wide shot, atmospheric lighting).',
      'Используйте яркие цветовые акценты (red design stripes) для выразительности.'
    ]
  },
  {
    id: 'steward',
    title: 'Data Steward',
    category: 'Аналитические',
    description: 'Специалист по управлению качеством, безопасностью, этикой и разметкой учебных баз данных.',
    tasks: [
      'Аудит обучающих баз данных на отсутствие токсичности и предвзятости',
      'Разработка правил разметки и классификации сложного контента',
      'Контроль соответствия использования ИИ законам о персональных данных',
      'Консультирование инженеров по вопросам этичного применения нейросетей'
    ],
    schedule: [
      '10:00 — Изучение отчетов автоматических сканеров этической уязвимости моделей',
      '11:30 — Составление правил очистки данных от личной информации граждан перед обучением',
      '14:00 — Проведение семинара для команды по новым правилам регулирования ИИ',
      '16:30 — Анализ спорного случая предвзятости классификатора резюме'
    ],
    questDescription: 'В роли ИИ-этика и хранителя данных сгенерируйте концептуальное изображение "Защитного цифрового щита над планетой данных". Это символ вашей работы по защите конфиденциальности.',
    suggestedPrompts: [
      {
        title: 'Этичный щит данных',
        prompt: 'A giant semi-transparent geometric digital shield of gold and red energy domes hovering over a complex cybernetic city made of glowing glass data monoliths, key lock holograms floating around, network security concept',
        style: 'Futuristic architectural visualization, highly detailed'
      }
    ],
    proTips: [
      'Используйте защитные символы в промпте (shield, energy dome, key lock holograms).',
      'Это поможет передать абстрактную идею безопасности и этичности данных.'
    ]
  }
];
