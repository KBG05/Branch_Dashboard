
import { cn } from "@/lib/utils";

type CategoryType = "academic" | "internship" | "competition" | "extracurricular";

interface CategoryBadgeProps {
  category: CategoryType;
  className?: string;
}

const categoryStyles = {
  academic: "bg-category-academic text-category-academic-text",
  internship: "bg-category-internship text-category-internship-text",
  competition: "bg-category-competition text-category-competition-text",
  extracurricular: "bg-category-extracurricular text-category-extracurricular-text",
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        categoryStyles[category],
        className
      )}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  );
}

export default CategoryBadge;
