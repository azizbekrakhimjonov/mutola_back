export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  category: string;
  pdfUrl: string;
  pages: number;
  publishedYear: number;
}

export const categories = [
  "Barchasi",
  "Badiiy",
  "Ilmiy-ommabop",
  "Fan",
  "Texnologiya",
  "Falsafa",
  "Tarix",
  "O'z-o'zini rivojlantirish",
] as const;

export type Category = typeof categories[number];

export const books: Book[] = [
  {
    id: "1",
    title: "Aniq Fikrlash San'ati",
    author: "Rolf Dobelli",
    description: "Inson psixologiyasi va kundalik qarorlarimizga ta'sir qiluvchi kognitiv xatolar haqida qiziqarli kitob. Ushbu kitob bizni yo'ldan ozdiruvchi umumiy fikrlash xatolarini ochib beradi va ularni qanday tanib olish va oldini olishni ko'rsatadi.",
    coverUrl: "",
    category: "O'z-o'zini rivojlantirish",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 384,
    publishedYear: 2013,
  },
  {
    id: "2",
    title: "Vaqtning Qisqacha Tarixi",
    author: "Stiven Xoking",
    description: "Zamonamizning buyuk aql egalaridan biri Stiven Xokingning ilmiy yozuv sohasidagi muhim asari. Koinot qanday boshlangan va uning boshlanishini nima imkon qilgan kabi chuqur savollarni o'rganadi.",
    coverUrl: "",
    category: "Fan",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 256,
    publishedYear: 1988,
  },
  {
    id: "3",
    title: "1984",
    author: "Jorj Oruell",
    description: "Birinchi marta nashr etilganidek bugun ham dolzarb bo'lib qolgan distopik asar. Uinston Smit Katta Aka hamma narsani kuzatib turgan dunyoda Haqiqat Vazirligida ishlaydi.",
    coverUrl: "",
    category: "Badiiy",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 328,
    publishedYear: 1949,
  },
  {
    id: "4",
    title: "Sapiens: Insoniyatning Qisqacha Tarixi",
    author: "Yuval Noy Xarari",
    description: "Taniqli tarixchidan insoniyat yaratilishi va evolyutsiyasining asosiy rivoyati. Biologiya va tarix bizni qanday belgilganini o'rganadi.",
    coverUrl: "",
    category: "Tarix",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 512,
    publishedYear: 2011,
  },
  {
    id: "5",
    title: "Toza Kod",
    author: "Robert S. Martin",
    description: "Dasturchilar uchun toza kod yozish nimani anglatishini o'rgatuvchi agile dasturiy ta'minot hunarmandchiligi qo'llanmasi. Toza kod yozish intizomi, texnikasi, vositalari va amaliyotlarini taqdim etadi.",
    coverUrl: "",
    category: "Texnologiya",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 464,
    publishedYear: 2008,
  },
  {
    id: "6",
    title: "Meditatsiyalar",
    author: "Mark Avreliy",
    description: "Dunyodagi eng kuchli odamning o'z lavozimi mas'uliyati va majburiyatlarini qanday bajarish haqida o'ziga bergan maslahatlari. Stoik falsafaga abadiy qo'llanma.",
    coverUrl: "",
    category: "Falsafa",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 256,
    publishedYear: 180,
  },
  {
    id: "7",
    title: "Buyuk Getsbi",
    author: "F. Skott Fitsjerald",
    description: "Long Aylendda Jazz davri fonida, roman hikoyachi Nik Karreveyning sirli millioner Jey Getsbi bilan munosabatlarini va Getsbining sobiq sevgilisi bilan qayta uchrashish ishtiyoqini tasvirlaydi.",
    coverUrl: "",
    category: "Badiiy",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 180,
    publishedYear: 1925,
  },
  {
    id: "8",
    title: "Atom Odatlar",
    author: "Jeyms Klir",
    description: "Maqsadlaringiz qanday bo'lishidan qat'i nazar, Atom Odatlar har kuni yaxshilanish uchun tasdiqlangan tizimni taklif qiladi. Jeyms Klir yaxshi odatlarni shakllantirish va yomonlarini yo'q qilishni o'rgatuvchi amaliy strategiyalarni ochib beradi.",
    coverUrl: "",
    category: "O'z-o'zini rivojlantirish",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 320,
    publishedYear: 2018,
  },
  {
    id: "9",
    title: "Kundalik Narsalar Dizayni",
    author: "Don Norman",
    description: "Ba'zi mahsulotlar mijozlarni qondirsa, boshqalari faqat asabiylashtirishini tushuntiruvchi kuchli primer. Mahsulot loyihalash yoki yaratuvchi har bir kishi uchun zarur o'qish.",
    coverUrl: "",
    category: "Texnologiya",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 368,
    publishedYear: 1988,
  },
  {
    id: "10",
    title: "Tez va Sekin Fikrlash",
    author: "Daniel Kaneman",
    description: "Nobel mukofoti sovrindori fikrlash usulimizni boshqaruvchi ikki tizimni tushuntiradi. 1-tizim tez, intuitiv va hissiy; 2-tizim sekinroq, ko'proq mulohazali va mantiqiy.",
    coverUrl: "",
    category: "Ilmiy-ommabop",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 499,
    publishedYear: 2011,
  },
  {
    id: "11",
    title: "Turlarning Kelib Chiqishi",
    author: "Charlz Darvin",
    description: "Darvinning tabiiy tanlanish orqali evolyutsiya haqidagi kashshof asari. Bu kitob evolyutsion biologiya uchun asos yaratdi va Yerdagi hayotni tushunishimizni o'zgartirdi.",
    coverUrl: "",
    category: "Fan",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 502,
    publishedYear: 1859,
  },
  {
    id: "12",
    title: "Zaratustra Shunday Dedi",
    author: "Fridrix Nitsshe",
    description: "O'z donishmandligini dunyo bilan bo'lishish uchun tog'dan tushgan Zaratustraning sayohatlari va nutqlarini kuzatuvchi falsafiy roman. Uber-mensh va abadiy qaytish tushunchalarini o'rganadi.",
    coverUrl: "",
    category: "Falsafa",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 352,
    publishedYear: 1883,
  },
];
