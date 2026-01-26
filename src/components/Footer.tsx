import { BookOpen, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-card/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-serif text-lg font-bold">Kitobxon</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Maxfiylik</a>
            <a href="#" className="hover:text-foreground transition-colors">Shartlar</a>
            <a href="#" className="hover:text-foreground transition-colors">Bog'lanish</a>
          </div>
          
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Kitob ixlosmandlari uchun <Heart className="h-4 w-4 text-primary fill-current" /> bilan yaratildi
          </p>
        </div>
      </div>
    </footer>
  );
};
