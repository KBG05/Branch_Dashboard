
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, className }: StatsCardProps) {
  return (
    <div className={cn("enhanced-card p-6 bg-card flex flex-col", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-primary/10 rounded-md border-2 border-primary/20">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-semibold text-card-foreground">{value}</p>
      </div>
    </div>
  );
}

export default StatsCard;
