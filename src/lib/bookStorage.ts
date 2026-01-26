import { Book } from "@/data/books";

const STORAGE_KEY = "mutola_books";

// LocalStorage dan barcha kitoblarni olish
export const getStoredBooks = (): Book[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Kitoblarni o'qishda xatolik:", error);
  }
  return [];
};

// LocalStorage ga kitob qo'shish
export const addBookToStorage = (book: Book): void => {
  try {
    const books = getStoredBooks();
    books.push(book);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    // Custom event yuborish - boshqa oynalarni yangilash uchun
    window.dispatchEvent(new Event("booksUpdated"));
  } catch (error) {
    console.error("Kitob qo'shishda xatolik:", error);
  }
};

// LocalStorage dan kitobni o'chirish
export const removeBookFromStorage = (bookId: string): void => {
  try {
    const books = getStoredBooks();
    const filtered = books.filter((b) => b.id !== bookId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    // Custom event yuborish - boshqa oynalarni yangilash uchun
    window.dispatchEvent(new Event("booksUpdated"));
  } catch (error) {
    console.error("Kitobni o'chirishda xatolik:", error);
  }
};

// LocalStorage ni tozalash
export const clearStoredBooks = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Kitoblarni tozalashda xatolik:", error);
  }
};

// Faylni base64 ga o'tkazish
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Faylni o'qib bo'lmadi"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

