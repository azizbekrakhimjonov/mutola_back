import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = "Kitoblarni sarlavha yoki muallif bo'yicha qidiring..." }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input pl-12 text-base md:text-lg py-3.5"
      />
    </div>
  );
};
