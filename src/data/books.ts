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
