import { Globe, Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  variant?: "default" | "minimal" | "pill" | "modern";
  className?: string;
}

const LanguageToggle = ({ variant = "default", className }: LanguageToggleProps) => {
  const { language, toggleLanguage } = useLanguage();

  if (variant === "minimal") {
    return (
      <button
        onClick={toggleLanguage}
        className={cn(
          "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 px-3 py-2 rounded-xl hover:bg-muted/50 active:scale-95",
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
      <div className={cn("flex items-center bg-muted/80 backdrop-blur-sm rounded-xl p-1 border border-border/50 shadow-sm", className)}>
        <button
          onClick={() => language === "ur" && toggleLanguage()}
          className={cn(
            "px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300",
            language === "en" 
              ? "bg-primary text-primary-foreground shadow-md" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          EN
        </button>
        <button
          onClick={() => language === "en" && toggleLanguage()}
          className={cn(
            "px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300",
            language === "ur" 
              ? "bg-primary text-primary-foreground shadow-md" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          اردو
        </button>
      </div>
    );
  }

  // Modern variant - enhanced design for dashboard
  if (variant === "modern") {
    return (
      <div className={cn(
        "inline-flex items-center gap-1 p-1 rounded-2xl bg-gradient-to-r from-muted/80 to-muted/60 backdrop-blur-md border border-border/40 shadow-lg",
        className
      )}>
        <button
          onClick={() => language === "ur" && toggleLanguage()}
          className={cn(
            "relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden",
            language === "en" 
              ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md transform scale-[1.02]" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Globe className={cn(
            "w-4 h-4 transition-transform duration-300",
            language === "en" && "animate-pulse"
          )} />
          <span>English</span>
          {language === "en" && (
            <span className="absolute inset-0 bg-gradient-to-r from-primary-foreground/10 to-transparent rounded-xl" />
          )}
        </button>
        <button
          onClick={() => language === "en" && toggleLanguage()}
          className={cn(
            "relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden",
            language === "ur" 
              ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md transform scale-[1.02]" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
          dir="rtl"
        >
          <Languages className={cn(
            "w-4 h-4 transition-transform duration-300",
            language === "ur" && "animate-pulse"
          )} />
          <span>اردو</span>
          {language === "ur" && (
            <span className="absolute inset-0 bg-gradient-to-r from-primary-foreground/10 to-transparent rounded-xl" />
          )}
        </button>
      </div>
    );
  }

  // Default variant
  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300",
        "bg-gradient-to-r from-muted/80 to-muted/60 backdrop-blur-md border border-border/40",
        "hover:border-primary/30 hover:shadow-md active:scale-95",
        "text-foreground",
        className
      )}
    >
      <Globe className="w-4 h-4 text-primary" />
      <span>{language === "en" ? "اردو" : "English"}</span>
    </button>
  );
};

export default LanguageToggle;
