import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { getAllBooks, addBook, deleteBook } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "100mb" }));

// API
app.get("/api/books", async (req, res) => {
  try {
    const books = await getAllBooks();
    res.json(books);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Kitoblarni olishda xatolik" });
  }
});

app.post("/api/books", async (req, res) => {
  try {
    const book = req.body;
    if (!book?.id || !book?.title || !book?.author) {
      return res.status(400).json({ error: "id, title, author kerak" });
    }
    await addBook(book);
    res.status(201).json(book);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Kitob qo'shishda xatolik" });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    await deleteBook(req.params.id);
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Kitobni o'chirishda xatolik" });
  }
});

// Production: dist ni static berish (SERVE_STATIC=0 bo‘lsa faqat API — Nginx static beradi)
const serveStatic = process.env.SERVE_STATIC !== "0";
if (serveStatic) {
  const distPath = path.join(__dirname, "..", "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} da ishlayapti`);
  console.log(`API: GET/POST/DELETE /api/books`);
});
