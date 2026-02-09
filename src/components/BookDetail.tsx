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
    if (!book.pdfUrl) return;
    if (book.pdfUrl.startsWith("data:")) {
      const link = document.createElement("a");
      link.href = book.pdfUrl;
      link.download = `${book.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(book.pdfUrl, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogTitle className="sr-only">{book.title} tafsilotlari</DialogTitle>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Muqova rasmi */}
          <div className="md:w-2/5 p-6 md:p-8 flex justify-center bg-muted/30">
            {(coverImage || book.coverUrl) ? (
              <img
                src={coverImage || book.coverUrl || ""}
                alt={`${book.title} muqovasi`}
                className="w-48 md:w-full max-w-xs rounded-lg shadow-book"
              />
            ) : (
              <div className="w-48 md:w-full max-w-xs aspect-[2/3] rounded-lg shadow-book bg-gradient-to-br from-primary/20 via-accent/10 to-secondary flex items-center justify-center">
                <BookOpen className="h-20 w-20 text-primary/40" />
              </div>
            )}
          </div>

          {/* Tafsilotlar */}
          <div className="md:w-3/5 p-6 md:p-8 flex flex-col">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              {book.category}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2 text-balance">
              {book.title}
            </h2>
            <p className="text-lg text-foreground/90 mt-1 font-medium">
              Muallif: {book.author}
            </p>

            <div className="flex flex-wrap gap-4 mt-6 text-sm text-foreground/80">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{book.pages} sahifa</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{book.publishedYear}-yil</span>
              </div>
            </div>

            <div className="mt-6 flex-1">
              <h3 className="font-semibold mb-2 text-foreground">Kitob haqida</h3>
              <p className="text-foreground/85 leading-relaxed text-[15px]">
                {book.description?.trim() || "Tavsif kiritilmagan."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              {book.pdfUrl && (
                <button
                  onClick={() => book.pdfUrl && window.open(book.pdfUrl, "_blank", "noopener")}
                  className="btn-primary flex-1"
                >
                  <BookOpen className="h-5 w-5" />
                  Onlayn o'qish
                </button>
              )}
              {book.pdfUrl && (
                <button
                  onClick={handleDownload}
                  className="btn-secondary flex-1"
                >
                  <Download className="h-5 w-5" />
                  PDF yuklab olish
                </button>
              )}
              {!book.pdfUrl && (
                <div className="w-full text-center py-4 text-muted-foreground">
                  <p>Bu kitob uchun elektron versiya mavjud emas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
