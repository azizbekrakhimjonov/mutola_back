import { categories, type Category } from "@/data/books";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected: Category;
  onSelect: (category: Category) => void;
}

export const CategoryFilter = ({ selected, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            "category-chip",
            selected === category && "category-chip-active"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
