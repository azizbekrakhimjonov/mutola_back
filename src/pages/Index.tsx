import { useState, useMemo, useEffect } from "react";
import { type Category, type Book } from "@/data/books";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { BookGrid } from "@/components/BookGrid";
import { BookDetail } from "@/components/BookDetail";
import { PDFViewer } from "@/components/PDFViewer";
import { NewsSection } from "@/components/NewsSection";
import { Footer } from "@/components/Footer";
import { getStoredBooks } from "@/lib/bookStorage";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("Barchasi");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [storedOnly, setStoredOnly] = useState<Book[]>([]);

  // Serverdan (Django API) barcha kitoblar — Dashboard da qo'shilganlar ham shu yerda
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const list = await getStoredBooks();
        setStoredOnly(list);
      } catch {
        setStoredOnly([]);
      }
    };
    loadBooks();
    const handleBooksUpdated = () => void loadBooks();
    window.addEventListener("booksUpdated", handleBooksUpdated);
    return () => window.removeEventListener("booksUpdated", handleBooksUpdated);
  }, []);

  const filteredBooks = useMemo(() => {
    return storedOnly.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "Barchasi" || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, storedOnly]);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedBook(null), 200);
  };

  const handleReadBook = (book: Book) => {
    setReadingBook(book);
    setIsDetailOpen(false);
  };

  const handleCloseReader = () => {
    setReadingBook(null);
  };

  if (readingBook) {
    return <PDFViewer book={readingBook} onClose={handleCloseReader} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />

        <section className="container mx-auto px-4 py-12">
          <div className="mb-10">
            <CategoryFilter
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold">
              {selectedCategory === "Barchasi" ? "Barcha Kitoblar" : selectedCategory}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredBooks.length} ta kitob topildi
            </span>
          </div>

          <BookGrid
            books={filteredBooks}
            onBookClick={handleBookClick}
            coverImages={{}}
          />
        </section>

        <NewsSection />
      </main>

      <Footer />

      <BookDetail
        book={selectedBook}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onRead={handleReadBook}
        coverImage={selectedBook?.coverUrl}
      />
    </div>
  );
};

export default Index;
