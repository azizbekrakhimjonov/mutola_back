export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl?: string | null;
}

const API_BASE = "";

/** API dan yangiliklar ro'yxati */
export async function getNewsList(): Promise<NewsItem[]> {
  const r = await fetch(`${API_BASE}/api/news/`, { cache: "no-store" });
  if (!r.ok) {
    return [];
  }
  const data = await r.json();
  return Array.isArray(data) ? data : [];
}

/** Yangilik qo'shish */
export async function addNews(params: {
  title: string;
  summary: string;
  date?: string;
  imageFile?: File;
}): Promise<NewsItem> {
  const form = new FormData();
  form.append("title", params.title);
  form.append("summary", params.summary);
  form.append("date", params.date || new Date().toISOString().slice(0, 10));
  if (params.imageFile) {
    form.append("image", params.imageFile);
  }

  const r = await fetch(`${API_BASE}/api/news/`, {
    method: "POST",
    body: form,
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(
      (err as { detail?: string })?.detail ||
        "Yangilik qo'shishda xatolik"
    );
  }
  window.dispatchEvent(new Event("newsUpdated"));
  return r.json();
}

/** Yangilikni o'chirish */
export async function removeNews(newsId: string): Promise<void> {
  const r = await fetch(`${API_BASE}/api/news/${encodeURIComponent(newsId)}/`, {
    method: "DELETE",
  });
  if (!r.ok && r.status !== 204) {
    throw new Error("Yangilikni o'chirishda xatolik");
  }
  window.dispatchEvent(new Event("newsUpdated"));
}
