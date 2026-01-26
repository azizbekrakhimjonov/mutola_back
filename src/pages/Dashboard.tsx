import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Book, categories } from "@/data/books";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { addBookToStorage, fileToBase64, getStoredBooks, removeBookFromStorage } from "@/lib/bookStorage";
import { Upload, X, FileText, Image as ImageIcon, Trash2, Plus } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({
    title: "",
    author: "",
    description: "",
    category: "Badiiy",
    pages: 0,
    publishedYear: new Date().getFullYear(),
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Kitoblarni yuklash
  useEffect(() => {
    const loadBooks = () => {
      const storedBooks = getStoredBooks();
      setBooks(storedBooks);
    };

    loadBooks();

    const handleStorageChange = () => {
      loadBooks();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("booksUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("booksUpdated", handleStorageChange);
    };
  }, []);

  const handleInputChange = (field: keyof Book, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Xatolik",
          description: "Faqat rasm fayllari qabul qilinadi",
          variant: "destructive",
        });
        return;
      }
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Xatolik",
          description: "Faqat PDF fayllari qabul qilinadi",
          variant: "destructive",
        });
        return;
      }
      setPdfFile(file);
    }
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview("");
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    if (pdfInputRef.current) {
      pdfInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validatsiya
      if (!formData.title || !formData.author || !formData.description) {
        toast({
          title: "Xatolik",
          description: "Barcha maydonlarni to'ldiring",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!coverFile) {
        toast({
          title: "Xatolik",
          description: "Kitob muqovasi rasmini yuklang",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (!pdfFile) {
        toast({
          title: "Xatolik",
          description: "PDF faylini yuklang",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Fayllarni base64 ga o'tkazish
      const coverBase64 = await fileToBase64(coverFile);
      const pdfBase64 = await fileToBase64(pdfFile);

      // Yangi kitob yaratish
      const newBook: Book = {
        id: Date.now().toString(),
        title: formData.title!,
        author: formData.author!,
        description: formData.description!,
        category: formData.category || "Badiiy",
        coverUrl: coverBase64,
        pdfUrl: pdfBase64,
        pages: formData.pages || 0,
        publishedYear: formData.publishedYear || new Date().getFullYear(),
      };

      // LocalStorage ga saqlash
      addBookToStorage(newBook);

      toast({
        title: "Muvaffaqiyatli!",
        description: "Kitob qo'shildi va home page ga qo'shildi",
      });

      // Formani tozalash
      setFormData({
        title: "",
        author: "",
        description: "",
        category: "Badiiy",
        pages: 0,
        publishedYear: new Date().getFullYear(),
      });
      setCoverFile(null);
      setPdfFile(null);
      setCoverPreview("");
      if (coverInputRef.current) coverInputRef.current.value = "";
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      setShowAddForm(false);
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Kitob qo'shishda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (bookId: string) => {
    setDeleteBookId(bookId);
  };

  const confirmDelete = () => {
    if (deleteBookId) {
      removeBookFromStorage(deleteBookId);
      toast({
        title: "Muvaffaqiyatli!",
        description: "Kitob o'chirildi",
      });
      setDeleteBookId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Kitoblar ro'yxati */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-serif">Kitoblar Ro'yxati</CardTitle>
                  <CardDescription>
                    Barcha qo'shilgan kitoblar ({books.length} ta)
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Yangi Kitob Qo'shish
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {books.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Hozircha kitoblar yo'q</p>
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Birinchi Kitobni Qo'shing
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {book.category} • {book.publishedYear}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(book.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {book.coverUrl?.startsWith('data:') && (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-48 object-cover rounded mt-2"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Yangi kitob qo'shish formasi */}
          {showAddForm && (
            <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Yangi Kitob Qo'shish</CardTitle>
              <CardDescription>
                Kitob ma'lumotlarini kiriting va PDF faylini yuklang
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Kitob nomi */}
                <div className="space-y-2">
                  <Label htmlFor="title">Kitob nomi *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Masalan: Aniq Fikrlash San'ati"
                    required
                  />
                </div>

                {/* Muallif */}
                <div className="space-y-2">
                  <Label htmlFor="author">Muallif *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                    placeholder="Masalan: Rolf Dobelli"
                    required
                  />
                </div>

                {/* Tavsif */}
                <div className="space-y-2">
                  <Label htmlFor="description">Tavsif *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Kitob haqida qisqacha ma'lumot..."
                    rows={4}
                    required
                  />
                </div>

                {/* Kategoriya va Yil */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategoriya *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Kategoriyani tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((cat) => cat !== "Barchasi")
                          .map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publishedYear">Nashr yili *</Label>
                    <Input
                      id="publishedYear"
                      type="number"
                      value={formData.publishedYear}
                      onChange={(e) =>
                        handleInputChange("publishedYear", parseInt(e.target.value) || 0)
                      }
                      min="1000"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>

                {/* Sahifalar soni */}
                <div className="space-y-2">
                  <Label htmlFor="pages">Sahifalar soni</Label>
                  <Input
                    id="pages"
                    type="number"
                    value={formData.pages}
                    onChange={(e) => handleInputChange("pages", parseInt(e.target.value) || 0)}
                    min="0"
                    placeholder="Masalan: 384"
                  />
                </div>

                {/* Muqova rasmi */}
                <div className="space-y-2">
                  <Label>Kitob muqovasi *</Label>
                  <div className="space-y-3">
                    {coverPreview ? (
                      <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                        <img
                          src={coverPreview}
                          alt="Muqova ko'rinishi"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={removeCover}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        onClick={() => coverInputRef.current?.click()}
                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                      >
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Muqova rasmini yuklash uchun bosing
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG yoki WEBP formatida
                        </p>
                      </div>
                    )}
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* PDF fayl */}
                <div className="space-y-2">
                  <Label>PDF fayl *</Label>
                  <div className="space-y-3">
                    {pdfFile ? (
                      <div className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">{pdfFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={removePdf}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        onClick={() => pdfInputRef.current?.click()}
                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                      >
                        <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          PDF faylini yuklash uchun bosing
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Faqat PDF formatida
                        </p>
                      </div>
                    )}
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setFormData({
                        title: "",
                        author: "",
                        description: "",
                        category: "Badiiy",
                        pages: 0,
                        publishedYear: new Date().getFullYear(),
                      });
                      setCoverFile(null);
                      setPdfFile(null);
                      setCoverPreview("");
                      if (coverInputRef.current) coverInputRef.current.value = "";
                      if (pdfInputRef.current) pdfInputRef.current.value = "";
                    }}
                    className="flex-1"
                  >
                    Bekor qilish
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Qo'shilyapti..." : "Kitobni Qo'shish"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          )}

          {/* Delete confirmation dialog */}
          <AlertDialog open={!!deleteBookId} onOpenChange={(open) => !open && setDeleteBookId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Kitobni o'chirish</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu kitobni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  O'chirish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;

