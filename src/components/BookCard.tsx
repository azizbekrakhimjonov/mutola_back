import { Book } from "@/data/books";
import { BookOpen } from "lucide-react";

interface BookCardProps {
  book: Book;
  onClick: () => void;
  coverImage?: string;
}

export const BookCard = ({ book, onClick, coverImage }: BookCardProps) => {
  return (
    <article
      onClick={onClick}
      className="book-card cursor-pointer group"
    >
      <div className="relative overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={`${book.title} muqovasi`}
            className="book-cover"
          />
        ) : (
          <div className="book-cover bg-gradient-to-br from-primary/20 via-accent/10 to-secondary flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4">
        <span className="text-xs font-medium text-primary uppercase tracking-wider">
          {book.category}
        </span>
        <h3 className="font-serif text-lg font-semibold mt-1 line-clamp-2 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {book.author}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {book.pages} sahifa • {book.publishedYear}-yil
        </p>
      </div>
    </article>
  );
};
