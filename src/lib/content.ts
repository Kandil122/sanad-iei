export type GameCategory =
  | "الأساسيات"
  | "اللغة والنطق"
  | "المهارات الحياتية"
  | "الرياضيات"
  | "المهارات الاجتماعية";

export type Game = {
  id: string;
  title: string;
  category: GameCategory;
  emoji: string;
  description: string;
  minutes: number;
  playable?: boolean;
};

export const categories: GameCategory[] = [
  "الأساسيات",
  "اللغة والنطق",
  "المهارات الحياتية",
  "الرياضيات",
  "المهارات الاجتماعية",
];

export const games: Game[] = [
  {
    id: "matching",
    title: "طابِق الصور",
    category: "الأساسيات",
    emoji: "🧩",
    description: "يختار الطفل الصورة المطابقة للنموذج لتقوية التمييز البصري.",
    minutes: 4,
    playable: true,
  },
  {
    id: "colors",
    title: "عالم الألوان",
    category: "الأساسيات",
    emoji: "🎨",
    description: "تعرّف على الألوان الأساسية وسمّها مع تعزيز صوتي.",
    minutes: 3,
    playable: true,
  },
  {
    id: "shapes",
    title: "الأشكال الهندسية",
    category: "الأساسيات",
    emoji: "🔷",
    description: "مربع، دائرة، مثلث… مطابقة الأشكال وتسميتها.",
    minutes: 3,
    playable: true,
  },
  {
    id: "letters",
    title: "حروفي العربية",
    category: "اللغة والنطق",
    emoji: "🔤",
    description: "من الألف إلى الياء مع صوت الحرف وكلمة تبدأ به.",
    minutes: 5,
    playable: true,
  },
  {
    id: "first-words",
    title: "كلماتي الأولى",
    category: "اللغة والنطق",
    emoji: "🗣️",
    description: "بطاقات كلمات يومية بالصوت والصورة لتحفيز النطق.",
    minutes: 4,
    playable: true,
  },
  {
    id: "animal-sounds",
    title: "أصوات الحيوانات",
    category: "اللغة والنطق",
    emoji: "🐘",
    description: "اربط الحيوان بصوته لتنمية الانتباه السمعي.",
    minutes: 3,
    playable: true,
  },
  {
    id: "brush-teeth",
    title: "أنظف أسناني",
    category: "المهارات الحياتية",
    emoji: "🪥",
    description: "خطوات تنظيف الأسنان بالترتيب كسلسلة روتين يومي.",
    minutes: 4,
    playable: true,
  },
  {
    id: "dressing",
    title: "ألبس ملابسي",
    category: "المهارات الحياتية",
    emoji: "👕",
    description: "ترتيب خطوات اللبس واختيار الملابس المناسبة للطقس.",
    minutes: 4,
    playable: true,
  },
  {
    id: "counting",
    title: "عُدّ معي",
    category: "الرياضيات",
    emoji: "🔢",
    description: "العد من ١ إلى ١٠ مع أشياء محسوسة.",
    minutes: 3,
    playable: true,
  },
  {
    id: "more-less",
    title: "أكثر أم أقل",
    category: "الرياضيات",
    emoji: "⚖️",
    description: "مقارنة الكميات بصريًا لبناء الحس العددي.",
    minutes: 3,
    playable: true,
  },
  {
    id: "emotions",
    title: "مشاعري",
    category: "المهارات الاجتماعية",
    emoji: "😊",
    description: "التعرّف على تعبيرات الوجه وتسمية المشاعر.",
    minutes: 4,
    playable: true,
  },
  {
    id: "turn-taking",
    title: "دوري ودورك",
    category: "المهارات الاجتماعية",
    emoji: "🤝",
    description: "لعبة تبادل الأدوار لتعليم الانتظار والمشاركة.",
    minutes: 5,
    playable: true,
  },
];

export const aacBoard = [
  {
    group: "أريد",
    color: "bg-sun",
    items: [
      { label: "ماء", emoji: "💧" },
      { label: "طعام", emoji: "🍎" },
      { label: "ألعب", emoji: "🧸" },
      { label: "أنام", emoji: "🛏️" },
      { label: "الحمّام", emoji: "🚻" },
      { label: "أخرج", emoji: "🚪" },
    ],
  },
  {
    group: "أشعر",
    color: "bg-sea",
    items: [
      { label: "سعيد", emoji: "😊" },
      { label: "حزين", emoji: "😢" },
      { label: "متعب", emoji: "😴" },
      { label: "خائف", emoji: "😨" },
      { label: "غاضب", emoji: "😠" },
      { label: "أتألم", emoji: "🤕" },
    ],
  },
  {
    group: "أشخاص",
    color: "bg-sun",
    items: [
      { label: "ماما", emoji: "👩" },
      { label: "بابا", emoji: "👨" },
      { label: "أنا", emoji: "🙋" },
      { label: "المعلمة", emoji: "👩‍🏫" },
      { label: "صديقي", emoji: "🧑‍🤝‍🧑" },
      { label: "أخي", emoji: "👦" },
    ],
  },
  {
    group: "كلمات مهمة",
    color: "bg-sea",
    items: [
      { label: "نعم", emoji: "✅" },
      { label: "لا", emoji: "❌" },
      { label: "من فضلك", emoji: "🙏" },
      { label: "شكرًا", emoji: "💛" },
      { label: "المزيد", emoji: "➕" },
      { label: "انتهيت", emoji: "🏁" },
    ],
  },
];
