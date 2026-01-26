import { SearchBar } from "./SearchBar";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const Hero = ({ searchQuery, onSearchChange }: HeroProps) => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-balance animate-fade-in">
            Your Digital Library,{" "}
            <span className="text-primary">Anytime, Anywhere</span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "100ms" }}>
            Discover thousands of books at your fingertips. Read online or download for offline access. 
            Your next great read is just a click away.
          </p>
          
          <div className="mt-10 flex justify-center animate-fade-in" style={{ animationDelay: "200ms" }}>
            <SearchBar 
              value={searchQuery} 
              onChange={onSearchChange} 
            />
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span>1000+ Books</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <span>Read Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⬇️</span>
              <span>Free Downloads</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
