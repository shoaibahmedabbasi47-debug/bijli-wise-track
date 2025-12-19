import { Globe, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-card hover:bg-muted border-border/50 hover:border-primary/30 transition-all duration-200"
    >
      <Languages className="w-4 h-4 text-primary" />
      <span className="text-xs font-medium">
        {language === "en" ? "اردو" : "English"}
      </span>
      <Globe className="w-3 h-3 text-muted-foreground" />
    </Button>
  );
};

export default LanguageToggle;