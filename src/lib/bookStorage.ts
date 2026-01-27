import { Book } from "@/data/books";

const API_BASE = ""; // prod va dev (Vite proxy) da /api same-origin

// ---------- IndexedDB (backend yo‘q bo‘lganda fallback) ----------
const DB_NAME = "mutola_db";
const STORE_NAME = "books";
const DB_VERSION = 1;
const LEGACY_KEY = "mutola_books";
const MIGRATED_KEY = "mutola_idb_migrated";

const openDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });

const migrateFromLocalStorage = async (): Promise<void> => {
  try {
    if (localStorage.getItem(MIGRATED_KEY)) return;
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) {
      localStorage.setItem(MIGRATED_KEY, "1");
      return;
    }
    const books = JSON.parse(raw) as Book[];
    if (!Array.isArray(books) || books.length === 0) {
      localStorage.removeItem(LEGACY_KEY);
      localStorage.setItem(MIGRATED_KEY, "1");
      return;
    }
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    for (const book of books) {
      if (book?.id) store.put(book);
    }
    await new Promise<void>((res, rej) => {
      tx.oncomplete = () => {
        db.close();
        localStorage.removeItem(LEGACY_KEY);
        localStorage.setItem(MIGRATED_KEY, "1");
        res();
      };
      tx.onerror = () => {
        db.close();
        rej(tx.error);
      };
    });
  } catch {
    try {
      localStorage.setItem(MIGRATED_KEY, "1");
    } catch {
      /* ignore */
    }
  }
};

async function getBooksFromIDB(): Promise<Book[]> {
  await migrateFromLocalStorage();
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      db.close();
      resolve((req.result ?? []) as Book[]);
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

async function addBookToIDB(book: Book): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.add(book);
    req.onsuccess = () => {
      db.close();
      resolve();
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

async function removeBookFromIDB(bookId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(bookId);
    req.onsuccess = () => {
      db.close();
      resolve();
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

function emitBooksUpdated(): void {
  window.dispatchEvent(new Event("booksUpdated"));
}

// ---------- Asosiy API: avval backend, bo‘lmasa IndexedDB ----------

/** Barchaga ko‘rinadigan kitoblar — serverdan, yo‘q bo‘lsa brauzerdan */
export async function getStoredBooks(): Promise<Book[]> {
  try {
    const r = await fetch(`${API_BASE}/api/books`);
    if (r.ok) {
      const data = await r.json();
      return Array.isArray(data) ? data : [];
    }
  } catch {
    /* backend yo‘q yoki xato → IndexedDB */
  }
  return getBooksFromIDB();
}

/** Kitob qo‘shish — serverga yoziladi, barcha foydalanuvchilar ko‘radi */
export async function addBookToStorage(book: Book): Promise<void> {
  try {
    const r = await fetch(`${API_BASE}/api/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    if (r.ok || r.status === 201) {
      emitBooksUpdated();
      return;
    }
  } catch {
    /* fallback */
  }
  await addBookToIDB(book);
  emitBooksUpdated();
}

/** Kitobni o‘chirish */
export async function removeBookFromStorage(bookId: string): Promise<void> {
  try {
    const r = await fetch(`${API_BASE}/api/books/${encodeURIComponent(bookId)}`, {
      method: "DELETE",
    });
    if (r.ok || r.status === 204) {
      emitBooksUpdated();
      return;
    }
  } catch {
    /* fallback */
  }
  await removeBookFromIDB(bookId);
  emitBooksUpdated();
}

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Faylni o'qib bo'lmadi"));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
