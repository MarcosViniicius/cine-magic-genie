import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-16 w-16",
  xl: "h-32 w-32",
};

export function Loading({ size = "md", className, text }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 border-primary",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}

export function LoadingSpinner({ size = "md", className }: Omit<LoadingProps, "text">) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-b-2 border-primary",
        sizeClasses[size],
        className
      )}
    />
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading size="xl" text="Carregando..." />
    </div>
  );
} 