export type PickOption = { key: string; emoji: string; label?: string };

export type Round =
  | {
      type: "pick";
      prompt: string;
      display?: string;
      options: PickOption[];
      answerKey: string;
    }
  | {
      type: "order";
      prompt: string;
      steps: string[];
    };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

const colors = [
  { label: "أحمر", emoji: "🔴" },
  { label: "أزرق", emoji: "🔵" },
  { label: "أخضر", emoji: "🟢" },
  { label: "أصفر", emoji: "🟡" },
  { label: "برتقالي", emoji: "🟠" },
  { label: "بنفسجي", emoji: "🟣" },
  { label: "بني", emoji: "🟤" },
  { label: "أسود", emoji: "⚫" },
];

const shapes = [
  { label: "دائرة", emoji: "⚪" },
  { label: "مربع", emoji: "🟦" },
  { label: "مثلث", emoji: "🔺" },
  { label: "نجمة", emoji: "⭐" },
  { label: "قلب", emoji: "❤️" },
  { label: "معيّن", emoji: "🔶" },
];

const letters = [
  { letter: "أ", word: "أرنب", emoji: "🐰" },
  { letter: "ب", word: "بطة", emoji: "🦆" },
  { letter: "ت", word: "تفاح", emoji: "🍎" },
  { letter: "ج", word: "جمل", emoji: "🐫" },
  { letter: "د", word: "دجاجة", emoji: "🐔" },
  { letter: "س", word: "سمكة", emoji: "🐟" },
  { letter: "ف", word: "فيل", emoji: "🐘" },
  { letter: "ق", word: "قمر", emoji: "🌙" },
  { letter: "ك", word: "كتاب", emoji: "📚" },
  { letter: "م", word: "موز", emoji: "🍌" },
];

const words = [
  { label: "ماء", emoji: "💧" },
  { label: "خبز", emoji: "🍞" },
  { label: "حليب", emoji: "🥛" },
  { label: "كرة", emoji: "⚽" },
  { label: "سيارة", emoji: "🚗" },
  { label: "بيت", emoji: "🏠" },
  { label: "قط", emoji: "🐱" },
  { label: "شمس", emoji: "☀️" },
  { label: "زهرة", emoji: "🌸" },
  { label: "حذاء", emoji: "👟" },
];

const animals = [
  { label: "قطة", emoji: "🐱", sound: "مياو" },
  { label: "كلب", emoji: "🐶", sound: "هَوْ هَوْ" },
  { label: "بقرة", emoji: "🐄", sound: "مُووو" },
  { label: "خروف", emoji: "🐑", sound: "ماع" },
  { label: "أسد", emoji: "🦁", sound: "زئير" },
  { label: "ديك", emoji: "🐓", sound: "كوكو" },
  { label: "حصان", emoji: "🐴", sound: "صهيل" },
  { label: "فيل", emoji: "🐘", sound: "بوق" },
];

const matchPool = ["🍎", "🐶", "🚗", "⭐", "🌸", "🐟", "🎈", "🍌", "🐱", "🚀"];

const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠"];

const countEmojis = ["🍎", "⭐", "🎈", "🐥", "🍓", "🧸"];

const emotions = [
  { label: "سعيد", emoji: "😊" },
  { label: "حزين", emoji: "😢" },
  { label: "غاضب", emoji: "😠" },
  { label: "خائف", emoji: "😨" },
  { label: "متعب", emoji: "😴" },
  { label: "متفاجئ", emoji: "😲" },
];

function pickFromPairs(
  pool: { label: string; emoji: string }[],
  rounds: number,
  promptFor: (item: { label: string; emoji: string }) => string,
): Round[] {
  return sample(pool, Math.min(rounds, pool.length)).map((target) => {
    const distractors = sample(
      pool.filter((p) => p.label !== target.label),
      2,
    );
    return {
      type: "pick" as const,
      prompt: promptFor(target),
      options: shuffle([target, ...distractors]).map((o) => ({
        key: o.label,
        emoji: o.emoji,
      })),
      answerKey: target.label,
    };
  });
}

export function buildRounds(gameId: string): Round[] {
  switch (gameId) {
    case "matching":
      return sample(matchPool, 6).map((target) => {
        const distractors = sample(
          matchPool.filter((e) => e !== target),
          2,
        );
        return {
          type: "pick" as const,
          prompt: "اختر الصورة المشابهة",
          display: target,
          options: shuffle([target, ...distractors]).map((e) => ({ key: e, emoji: e })),
          answerKey: target,
        };
      });

    case "colors":
      return pickFromPairs(colors, 6, (t) => `أين اللون ${t.label}؟`);

    case "shapes":
      return pickFromPairs(shapes, 6, (t) => `اختر شكل ${t.label}`);

    case "emotions":
      return pickFromPairs(emotions, 6, (t) => `أين الوجه ${t.label}؟`);

    case "first-words":
      return pickFromPairs(words, 6, (t) => `أين ${t.label}؟`);

    case "letters":
      return sample(letters, 6).map((target) => {
        const distractors = sample(
          letters.filter((l) => l.letter !== target.letter),
          2,
        );
        return {
          type: "pick" as const,
          prompt: `أي صورة تبدأ بحرف ${target.letter}؟`,
          display: target.letter,
          options: shuffle([target, ...distractors]).map((l) => ({
            key: l.word,
            emoji: l.emoji,
            label: l.word,
          })),
          answerKey: target.word,
        };
      });

    case "animal-sounds":
      return sample(animals, 6).map((target) => {
        const distractors = sample(
          animals.filter((a) => a.label !== target.label),
          2,
        );
        return {
          type: "pick" as const,
          prompt: `من يقول: ${target.sound}؟`,
          options: shuffle([target, ...distractors]).map((a) => ({
            key: a.label,
            emoji: a.emoji,
            label: a.label,
          })),
          answerKey: target.label,
        };
      });

    case "counting":
      return sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 6).map((n) => {
        const emoji = sample(countEmojis, 1)[0]!;
        const wrong = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((x) => x !== n)).slice(0, 2);
        return {
          type: "pick" as const,
          prompt: "كم عددها؟",
          display: emoji.repeat(n),
          options: shuffle([n, ...wrong]).map((x) => ({
            key: String(x),
            emoji: arabicNumerals[x]!,
          })),
          answerKey: String(n),
        };
      });

    case "more-less":
      return Array.from({ length: 6 }).map(() => {
        const emoji = sample(countEmojis, 1)[0]!;
        const a = 1 + Math.floor(Math.random() * 5);
        let b = 1 + Math.floor(Math.random() * 6);
        while (b === a) b = 1 + Math.floor(Math.random() * 6);
        const askMore = Math.random() > 0.5;
        const answer = askMore ? (a > b ? "a" : "b") : a < b ? "a" : "b";
        return {
          type: "pick" as const,
          prompt: askMore ? "أي مجموعة أكثر؟" : "أي مجموعة أقل؟",
          options: shuffle([
            { key: "a", emoji: emoji.repeat(a) },
            { key: "b", emoji: emoji.repeat(b) },
          ]),
          answerKey: answer,
        };
      });

    case "brush-teeth":
      return [
        {
          type: "order",
          prompt: "رتّب خطوات تنظيف الأسنان بالترتيب الصحيح",
          steps: [
            "أفتح الصنبور 🚰",
            "أضع المعجون على الفرشاة 🪥",
            "أفرّش أسناني جيدًا ✨",
            "أتمضمض بالماء 🥤",
            "أنظّف الفرشاة وأرتّبها 🧼",
          ],
        },
      ];

    case "dressing":
      return [
        {
          type: "order",
          prompt: "رتّب خطوات اللبس بالترتيب الصحيح",
          steps: [
            "أختار ملابسي 🧺",
            "ألبس القميص 👕",
            "ألبس البنطال 👖",
            "ألبس الجرابات 🧦",
            "ألبس الحذاء 👟",
          ],
        },
      ];

    case "turn-taking":
      return [
        {
          type: "order",
          prompt: "رتّب خطوات تبادل الأدوار",
          steps: [
            "ننتظر دورنا بهدوء 🧍",
            "نأخذ اللعبة عندما يحين دورنا 🧸",
            "نلعب لوقت قصير ⏳",
            "نعطي اللعبة لصديقنا 🤝",
            "نقول: دورك الآن! 😊",
          ],
        },
      ];

    default:
      return buildRounds("matching");
  }
}
