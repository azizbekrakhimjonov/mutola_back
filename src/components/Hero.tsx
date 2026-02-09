import { SearchBar } from "./SearchBar";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const Hero = ({ searchQuery, onSearchChange }: HeroProps) => {
  return (
    <section className="relative py-8 md:py-12 overflow-hidden">
      {/* Orqa fon namunasi */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-balance leading-snug tracking-tight">
            <span className="text-foreground block animate-hero-line" style={{ animationDelay: "0.1s" }}>Raqamli Kutubxonangiz,</span>
            <span className="animate-hero-line-shine animate-hero-shine mt-1 block tracking-tight font-bold" style={{ animationDelay: "0.3s" }}>Istalgan Vaqt, Istalgan Joyda</span>
          </h1>
          
          <div className="mt-6 flex justify-center animate-fade-in" style={{ animationDelay: "100ms" }}>
            <SearchBar 
              value={searchQuery} 
              onChange={onSearchChange} 
            />
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center gap-6 text-base md:text-lg text-foreground/85 font-medium animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-2">
              <span className="text-3xl">📚</span>
              <span>1000+ Kitoblar</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">📖</span>
              <span>Onlayn o'qish</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">⬇️</span>
              <span>Bepul yuklab olish</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
