import { Book } from "@/data/books";
import { X, BookOpen, Download, Calendar, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface BookDetailProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onRead: (book: Book) => void;
  coverImage?: string;
}

export const BookDetail = ({ book, isOpen, onClose, onRead, coverImage }: BookDetailProps) => {
  if (!book) return null;

  const handleDownload = () => {
    window.open(book.pdfUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogTitle className="sr-only">{book.title} Details</DialogTitle>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Cover Image */}
          <div className="md:w-2/5 p-6 md:p-8 flex justify-center bg-muted/30">
            {coverImage ? (
              <img
                src={coverImage}
                alt={`Cover of ${book.title}`}
                className="w-48 md:w-full max-w-xs rounded-lg shadow-book"
              />
            ) : (
              <div className="w-48 md:w-full max-w-xs aspect-[2/3] rounded-lg shadow-book bg-gradient-to-br from-primary/20 via-accent/10 to-secondary flex items-center justify-center">
                <BookOpen className="h-20 w-20 text-primary/40" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-3/5 p-6 md:p-8 flex flex-col">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              {book.category}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2 text-balance">
              {book.title}
            </h2>
            <p className="text-lg text-muted-foreground mt-1">
              by {book.author}
            </p>

            <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{book.pages} pages</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{book.publishedYear}</span>
              </div>
            </div>

            <div className="mt-6 flex-1">
              <h3 className="font-semibold mb-2">About this book</h3>
              <p className="text-muted-foreground leading-relaxed">
                {book.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => onRead(book)}
                className="btn-primary flex-1"
              >
                <BookOpen className="h-5 w-5" />
                Read Online
              </button>
              <button
                onClick={handleDownload}
                className="btn-secondary flex-1"
              >
                <Download className="h-5 w-5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
