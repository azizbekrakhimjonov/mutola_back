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
  "All",
  "Fiction",
  "Non-Fiction",
  "Science",
  "Technology",
  "Philosophy",
  "History",
  "Self-Help",
] as const;

export type Category = typeof categories[number];

export const books: Book[] = [
  {
    id: "1",
    title: "The Art of Thinking Clearly",
    author: "Rolf Dobelli",
    description: "A fascinating look at human psychology and the cognitive biases that affect our daily decisions. This book reveals the common thinking errors that lead us astray and shows how to recognize and avoid them.",
    coverUrl: "",
    category: "Self-Help",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 384,
    publishedYear: 2013,
  },
  {
    id: "2",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    description: "A landmark volume in science writing by one of the great minds of our time, Stephen Hawking's book explores such profound questions as: How did the universe begin—and what made its start possible?",
    coverUrl: "",
    category: "Science",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 256,
    publishedYear: 1988,
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    description: "A dystopian masterpiece that remains as relevant today as when it was first published. Winston Smith works for the Ministry of Truth in a world where Big Brother watches everything.",
    coverUrl: "",
    category: "Fiction",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 328,
    publishedYear: 1949,
  },
  {
    id: "4",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution that explores the ways in which biology and history have defined us.",
    coverUrl: "",
    category: "History",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 512,
    publishedYear: 2011,
  },
  {
    id: "5",
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A handbook of agile software craftsmanship that helps programmers learn what it means to write clean code. It introduces the disciplines, techniques, tools, and practices of writing clean code.",
    coverUrl: "",
    category: "Technology",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 464,
    publishedYear: 2008,
  },
  {
    id: "6",
    title: "Meditations",
    author: "Marcus Aurelius",
    description: "The private thoughts of the world's most powerful man giving advice to himself on how to make good on the responsibilities and obligations of his positions. A timeless guide to the philosophy of Stoicism.",
    coverUrl: "",
    category: "Philosophy",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 256,
    publishedYear: 180,
  },
  {
    id: "7",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover.",
    coverUrl: "",
    category: "Fiction",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 180,
    publishedYear: 1925,
  },
  {
    id: "8",
    title: "Atomic Habits",
    author: "James Clear",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits and break bad ones.",
    coverUrl: "",
    category: "Self-Help",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 320,
    publishedYear: 2018,
  },
  {
    id: "9",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    description: "A powerful primer on how and why some products satisfy customers while others only frustrate them. Essential reading for anyone who designs or builds products.",
    coverUrl: "",
    category: "Technology",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 368,
    publishedYear: 1988,
  },
  {
    id: "10",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    description: "The Nobel laureate explains the two systems that drive the way we think. System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical.",
    coverUrl: "",
    category: "Non-Fiction",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 499,
    publishedYear: 2011,
  },
  {
    id: "11",
    title: "The Origin of Species",
    author: "Charles Darwin",
    description: "Darwin's groundbreaking work on evolution by natural selection. This book laid the foundation for evolutionary biology and changed how we understand life on Earth.",
    coverUrl: "",
    category: "Science",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 502,
    publishedYear: 1859,
  },
  {
    id: "12",
    title: "Thus Spoke Zarathustra",
    author: "Friedrich Nietzsche",
    description: "A philosophical novel that follows the travels and speeches of Zarathustra, who comes down from the mountain to share his wisdom with the world. Explores the concepts of the Übermensch and eternal recurrence.",
    coverUrl: "",
    category: "Philosophy",
    pdfUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
    pages: 352,
    publishedYear: 1883,
  },
];
