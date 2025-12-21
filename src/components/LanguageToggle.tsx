import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  variant?: "default" | "minimal" | "pill";
  className?: string;
}

const LanguageToggle = ({ variant = "default", className }: LanguageToggleProps) => {
  const { language, toggleLanguage } = useLanguage();

  if (variant === "minimal") {
    return (
      <button
        onClick={toggleLanguage}
        className={cn(
          "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/50",
          className
        )}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {language === "en" ? "اردو" : "EN"}
        </span>
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <div className={cn("flex items-center bg-muted rounded-full p-1", className)}>
        <button
          onClick={() => language === "ur" && toggleLanguage()}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
            language === "en" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          EN
        </button>
        <button
          onClick={() => language === "en" && toggleLanguage()}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
            language === "ur" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          اردو
        </button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        "flex items-center gap-2 bg-card hover:bg-muted border-border/50 hover:border-primary/30 transition-all duration-200",
        className
      )}
    >
      <Globe className="w-4 h-4 text-primary" />
      <span className="text-xs font-medium">
        {language === "en" ? "اردو" : "English"}
      </span>
    </Button>
  );
};

export default LanguageToggle;
