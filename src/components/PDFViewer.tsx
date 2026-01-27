import { Book } from "@/data/books";
import { X, Download, ArrowLeft, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Document, Page, pdfjs } from "react-pdf";

// PDF.js worker'ni sozlash
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

interface PDFViewerProps {
  book: Book;
  onClose: () => void;
}

export const PDFViewer = ({ book, onClose }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pdfData, setPdfData] = useState<string | Uint8Array>("");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [useIframe, setUseIframe] = useState<boolean>(false);

  const isDataPdf = !!book.pdfUrl && String(book.pdfUrl).startsWith("data:");

  // Base64 PDF → Blob URL (iframe da barqaror ishlaydi)
  useEffect(() => {
    if (isDataPdf && book.pdfUrl) {
      try {
        const dataUrl = String(book.pdfUrl);
        const base64 = dataUrl.split(",")[1];
        if (!base64) {
          setError("PDF ma'lumoti noto'g'ri");
          setLoading(false);
          return;
        }
        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setUseIframe(true);
        setLoading(false);
        setError("");
        return () => URL.revokeObjectURL(url);
      } catch (e) {
        console.error("PDF Blob yaratishda xatolik:", e);
        setBlobUrl(null);
        setPdfData(book.pdfUrl);
        setUseIframe(true);
        setLoading(false);
        setError("");
      }
      return;
    }
    if (book.pdfUrl && (String(book.pdfUrl).startsWith("http://") || String(book.pdfUrl).startsWith("https://"))) {
      setPdfData(book.pdfUrl);
      setUseIframe(false);
      setLoading(false);
      setError("");
      return;
    }
    setLoading(false);
    setError(book.pdfUrl ? "PDF yuklashda xatolik" : "PDF mavjud emas");
  }, [book.pdfUrl, isDataPdf]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error("PDF yuklashda xatolik:", err);
    const url = book.pdfUrl;
    if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) {
      setUseIframe(true);
      setError("");
    } else {
      setError("PDF yuklashda xatolik yuz berdi");
    }
    setLoading(false);
  };

  const handleDownload = () => {
    const url = blobUrl || book.pdfUrl;
    if (!url) return;
    if (String(book.pdfUrl).startsWith("data:") || blobUrl) {
      const link = document.createElement("a");
      link.href = url;
      link.download = `${book.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(url, "_blank");
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPageNumber(1);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Sarlavha va boshqaruv */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-serif font-semibold text-lg line-clamp-1">
              {book.title}
            </h1>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Sahifa navigatsiyasi */}
          {numPages > 0 && (
            <div className="hidden md:flex items-center gap-2 border-r pr-2 mr-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[5rem] text-center">
                {pageNumber} / {numPages}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Zoom va boshqaruv tugmalari */}
          <div className="hidden md:flex items-center gap-1 border-r pr-2 mr-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRotate}
              className="h-8 w-8"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs"
            >
              Reset
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="hidden sm:flex"
          >
            <Download className="h-4 w-4 mr-2" />
            Yuklab olish
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* PDF Kontent */}
      <div className="flex-1 flex flex-col min-h-0 bg-muted/50 overflow-auto">
        <div className="flex-1 flex flex-col items-stretch justify-start p-4 min-h-0">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">PDF yuklanmoqda...</p>
            </div>
          )}

          {error && !String(book.pdfUrl || "").startsWith("data:") && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Qayta urinish
              </Button>
            </div>
          )}

          {!loading && !error && useIframe && (blobUrl || (typeof pdfData === "string" && pdfData)) && (
            <div className="w-full flex-1 flex flex-col gap-3" style={{ minHeight: "75vh" }}>
              <Button
                variant="default"
                size="sm"
                className="self-start shrink-0"
                onClick={() => {
                  const u = blobUrl || (typeof pdfData === "string" ? (pdfData.startsWith("http") ? `${pdfData}#toolbar=1&navpanes=1` : pdfData) : "");
                  u && window.open(u, "_blank", "noopener");
                }}
              >
                Yangi oynada ochish
              </Button>
              <div className="flex-1 w-full rounded-lg overflow-hidden border bg-white" style={{ height: "75vh", minHeight: 400 }}>
                <embed
                  src={
                    blobUrl ||
                    (typeof pdfData === "string" ? (pdfData.startsWith("http") ? `${pdfData}#toolbar=1&navpanes=1` : pdfData) : "")
                  }
                  type="application/pdf"
                  className="w-full h-full"
                  style={{ width: "100%", height: "100%", minHeight: 400 }}
                  title={`${book.title} — PDF`}
                />
              </div>
            </div>
          )}

          {!loading && !error && pdfData && !useIframe && (
            <div className="flex flex-col items-center">
              <Document
                file={
                  typeof pdfData === "string" && (pdfData.startsWith("http://") || pdfData.startsWith("https://"))
                    ? { url: pdfData }
                    : pdfData
                }
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">PDF yuklanmoqda...</p>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={zoom}
                  rotate={rotation}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="shadow-lg"
                />
              </Document>
            </div>
          )}
        </div>
      </div>

      {/* Mobile uchun kontrollari */}
      <div className="md:hidden flex items-center justify-center gap-2 p-2 border-t bg-card flex-wrap">
        {numPages > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[4rem] text-center">
              {pageNumber} / {numPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRotate}
            className="h-8 w-8"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownload}
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
