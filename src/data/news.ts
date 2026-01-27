export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl?: string;
}

export const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "Mutola.uz — elektron kitoblar platformasi yangilandi",
    summary:
      "Barcha kitoblar endi bitta joyda: badiiy, ilmiy-ommabop, fan va boshqa kategoriyalar. Dashboard orqali yangi kitoblar qo'shishingiz mumkin.",
    date: "2025-01-27",
  },
  {
    id: "2",
    title: "Onlayn o'qish imkoniyati kengaytirildi",
    summary:
      "Kitoblarni brauzer ichida to'g'ridan-to'g'ri o'qishingiz, sahifalarni almashtirish, zoom va PDF yuklab olish endi qulayroq.",
    date: "2025-01-25",
  },
  {
    id: "3",
    title: "Yangi kategoriyalar qo'shildi",
    summary:
      "O'z-o'zini rivojlantirish, texnologiya, falsafa va tarix bo'yicha kitoblarni topish endi osonroq.",
    date: "2025-01-20",
  },
];
