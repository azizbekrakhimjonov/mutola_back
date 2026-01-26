import { Book } from "@/data/books";
import { BookCard } from "./BookCard";

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  coverImages: Record<string, string>;
}

export const BookGrid = ({ books, onBookClick, coverImages }: BookGridProps) => {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-4xl">📚</span>
        </div>
        <h3 className="font-serif text-xl font-semibold mb-2">Kitoblar topilmadi</h3>
        <p className="text-muted-foreground">Qidiruv yoki filtr mezonlarini o'zgartirib ko'ring</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((book, index) => (
        <div
          key={book.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <BookCard 
            book={book} 
            onClick={() => onBookClick(book)}
            coverImage={coverImages[book.id] || (book.coverUrl?.startsWith('data:') ? book.coverUrl : undefined)}
          />
        </div>
      ))}
    </div>
  );
};
