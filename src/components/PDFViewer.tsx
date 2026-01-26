import { Book } from "@/data/books";
import { X, Download, ArrowLeft } from "lucide-react";

interface PDFViewerProps {
  book: Book;
  onClose: () => void;
}

export const PDFViewer = ({ book, onClose }: PDFViewerProps) => {
  const handleDownload = () => {
    window.open(book.pdfUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-serif font-semibold text-lg line-clamp-1">
              {book.title}
            </h1>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="btn-secondary py-2 px-4"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* PDF Content */}
      <div className="flex-1 bg-muted/50">
        <iframe
          src={`${book.pdfUrl}#toolbar=0&navpanes=0`}
          className="w-full h-full"
          title={`Reading ${book.title}`}
        />
      </div>
    </div>
  );
};
