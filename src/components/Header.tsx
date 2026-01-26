import { BookOpen } from "lucide-react";
export const Header = () => {
  return <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground group-hover:scale-105 transition-transform">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="font-serif text-xl font-bold">Mutola.uz</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Ko'rish
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Kategoriyalar
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Biz haqimizda
            </a>
          </nav>
        </div>
      </div>
    </header>;
};