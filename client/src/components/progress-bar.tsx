import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "green" | "blue" | "orange";
}

export default function ProgressBar({ 
  progress, 
  className, 
  showLabel = false, 
  size = "md",
  color = "primary"
}: ProgressBarProps) {
  const sizeClasses = {
    sm: "h-1",
    md: "h-2", 
    lg: "h-3"
  };

  const colorClasses = {
    primary: "bg-primary",
    green: "bg-green-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500"
  };

  const backgroundClasses = {
    primary: "bg-primary/20",
    green: "bg-green-100", 
    blue: "bg-blue-100",
    orange: "bg-orange-100"
  };

  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">Progress</span>
          <span className="text-gray-500">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={cn(
        "w-full rounded-full overflow-hidden",
        sizeClasses[size],
        backgroundClasses[color]
      )}>
        <div 
          className={cn(
            "rounded-full transition-all duration-500 ease-out",
            sizeClasses[size],
            colorClasses[color]
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
