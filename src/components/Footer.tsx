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
            <span className="font-serif text-lg font-bold">PageTurn</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-primary fill-current" /> for book lovers
          </p>
        </div>
      </div>
    </footer>
  );
};
