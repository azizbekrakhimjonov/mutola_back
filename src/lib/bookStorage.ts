import { Book } from "@/data/books";

const API_BASE = "";

/** Barchaga ko‘rinadigan kitoblar — serverdan (Django API), cache yo‘q */
export async function getStoredBooks(): Promise<Book[]> {
  const r = await fetch(`${API_BASE}/api/books/`, { cache: "no-store" });
  if (!r.ok) {
    throw new Error("Kitoblarni yuklashda xatolik");
  }
  const data = await r.json();
  return Array.isArray(data) ? data : [];
}

/** Kitob qo‘shish — serverga yoziladi, barcha foydalanuvchilar ko‘radi */
export async function addBookToStorage(params: {
  title: string;
  author: string;
  description: string;
  category: string;
  pages: number;
  publishedYear: number;
  coverFile: File;
  pdfFile: File;
}): Promise<Book> {
  const form = new FormData();
  form.append("title", params.title);
  form.append("author", params.author);
  form.append("description", params.description);
  form.append("category", params.category);
  form.append("pages", String(params.pages));
  form.append("publishedYear", String(params.publishedYear));
  form.append("cover", params.coverFile);
  form.append("pdf", params.pdfFile);

  const r = await fetch(`${API_BASE}/api/books/`, {
    method: "POST",
    body: form,
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(
      (err as { detail?: string })?.detail ||
        Object.values(err as Record<string, string[]>).flat().join(" ") ||
        "Kitob qo'shishda xatolik"
    );
  }
  window.dispatchEvent(new Event("booksUpdated"));
  return r.json();
}

/** Kitobni o‘chirish */
export async function removeBookFromStorage(bookId: string): Promise<void> {
  const r = await fetch(`${API_BASE}/api/books/${encodeURIComponent(bookId)}/`, {
    method: "DELETE",
  });
  if (!r.ok && r.status !== 204) {
    throw new Error("Kitobni o'chirishda xatolik");
  }
  window.dispatchEvent(new Event("booksUpdated"));
}
