import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "mutola.sqlite");

let db = null;

async function getDb() {
  if (db) return db;
  const SQL = await initSqlJs();
  if (fs.existsSync(dbPath)) {
    const buf = fs.readFileSync(dbPath);
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT NOT NULL,
      coverUrl TEXT NOT NULL,
      category TEXT NOT NULL,
      pdfUrl TEXT NOT NULL,
      pages INTEGER NOT NULL DEFAULT 0,
      publishedYear INTEGER NOT NULL
    )
  `);
  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

export async function getAllBooks() {
  const database = await getDb();
  const results = database.exec("SELECT * FROM books ORDER BY id");
  if (!results.length || !results[0].values?.length) return [];
  const { columns, values } = results[0];
  return values.map((row) => {
    const o = {};
    columns.forEach((c, i) => {
      o[c] = row[i];
    });
    return {
      id: o.id,
      title: o.title,
      author: o.author,
      description: o.description ?? "",
      coverUrl: o.coverUrl ?? "",
      category: o.category ?? "Badiiy",
      pdfUrl: o.pdfUrl ?? "",
      pages: o.pages ?? 0,
      publishedYear: o.publishedYear ?? 0,
    };
  });
}

export async function addBook(book) {
  const database = await getDb();
  database.run(
    `INSERT OR REPLACE INTO books (id, title, author, description, coverUrl, category, pdfUrl, pages, publishedYear)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      book.id,
      book.title,
      book.author,
      book.description ?? "",
      book.coverUrl ?? "",
      book.category ?? "Badiiy",
      book.pdfUrl ?? "",
      book.pages ?? 0,
      book.publishedYear ?? new Date().getFullYear(),
    ]
  );
  saveDb();
}

export async function deleteBook(id) {
  const database = await getDb();
  database.run("DELETE FROM books WHERE id = ?", [id]);
  saveDb();
}
