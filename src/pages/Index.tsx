import { useState, useMemo } from "react";
import { books, type Category, type Book } from "@/data/books";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { BookGrid } from "@/components/BookGrid";
import { BookDetail } from "@/components/BookDetail";
import { PDFViewer } from "@/components/PDFViewer";
import { Footer } from "@/components/Footer";

// Import cover images
import cover1 from "@/assets/cover-1.jpg";
import cover2 from "@/assets/cover-2.jpg";
import cover3 from "@/assets/cover-3.jpg";
import cover4 from "@/assets/cover-4.jpg";
import cover5 from "@/assets/cover-5.jpg";
import cover6 from "@/assets/cover-6.jpg";
import cover7 from "@/assets/cover-7.jpg";
import cover8 from "@/assets/cover-8.jpg";
import cover9 from "@/assets/cover-9.jpg";
import cover10 from "@/assets/cover-10.jpg";
import cover11 from "@/assets/cover-11.jpg";
import cover12 from "@/assets/cover-12.jpg";

const coverImages: Record<string, string> = {
  "1": cover1,
  "2": cover2,
  "3": cover3,
  "4": cover4,
  "5": cover5,
  "6": cover6,
  "7": cover7,
  "8": cover8,
  "9": cover9,
  "10": cover10,
  "11": cover11,
  "12": cover12,
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [readingBook, setReadingBook] = useState<Book | null>(null);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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
              {selectedCategory === "All" ? "All Books" : selectedCategory}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} found
            </span>
          </div>

          <BookGrid
            books={filteredBooks}
            onBookClick={handleBookClick}
            coverImages={coverImages}
          />
        </section>
      </main>

      <Footer />

      <BookDetail
        book={selectedBook}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onRead={handleReadBook}
        coverImage={selectedBook ? coverImages[selectedBook.id] : undefined}
      />
    </div>
  );
};

export default Index;
