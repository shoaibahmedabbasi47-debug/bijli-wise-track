import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Lightbulb, 
  Fan, 
  Tv, 
  Refrigerator, 
  AirVent, 
  Plug,
  Brain,
  Sparkles,
  Loader2,
  ThumbsUp,
  Clock
} from "lucide-react";

const tips = [
  { icon: Lightbulb, title: "Switch to LED Bulbs", titleUr: "LED بلب لگائیں", description: "Replace incandescent bulbs with LED. Save up to 75% on lighting costs.", descriptionUr: "روشنی کے اخراجات میں 75% تک بچت کریں", savings: "Rs. 500" },
  { icon: AirVent, title: "AC Temperature", titleUr: "AC کا درجہ حرارت", description: "Set your AC to 24-26°C. Each degree lower increases consumption by 6%.", descriptionUr: "ہر ڈگری کم کرنے پر استعمال 6% بڑھ جاتا ہے", savings: "Rs. 1,200" },
  { icon: Fan, title: "Use Ceiling Fans", titleUr: "چھت کے پنکھے استعمال کریں", description: "Ceiling fans use 10x less electricity than AC. Use them when possible.", descriptionUr: "چھت کے پنکھے AC سے 10 گنا کم بجلی استعمال کرتے ہیں", savings: "Rs. 800" },
  { icon: Refrigerator, title: "Fridge Settings", titleUr: "فریج کی ترتیبات", description: "Keep your fridge at 3-4°C and freezer at -18°C for optimal efficiency.", descriptionUr: "بہترین کارکردگی کے لیے فریج 3-4°C پر رکھیں", savings: "Rs. 300" },
  { icon: Plug, title: "Unplug Devices", titleUr: "آلات نکال دیں", description: "Standby power can account for 10% of your bill. Unplug when not in use.", descriptionUr: "اسٹینڈبائی پاور آپ کے بل کا 10% ہو سکتی ہے", savings: "Rs. 400" },
  { icon: Tv, title: "Smart TV Usage", titleUr: "سمارٹ ٹی وی کا استعمال", description: "Turn off TVs completely instead of standby. Use power strips for easy control.", descriptionUr: "اسٹینڈبائی کے بجائے ٹی وی مکمل بند کریں", savings: "Rs. 200" },
];

const Tips = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateAISuggestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { 
          message: language === "ur" 
            ? "میرے بجلی کے استعمال کو کم کرنے کے لیے 5 مخصوص تجاویز دیں۔ ہر تجویز ایک نمبر کے ساتھ شروع ہو۔"
            : "Give me 5 specific, actionable tips to reduce my electricity bill based on typical Pakistani household usage patterns. Start each tip with a number.",
          type: "chat"
        }
      });

      if (error) throw error;

      const response = data.response || data.reply || "";
      const suggestions = response
        .split('\n')
        .filter((line: string) => line.trim().match(/^[\d][\.\)]/))
        .map((line: string) => line.replace(/^[\d][\.\)]\s*/, '').trim())
        .slice(0, 5);

      setAiSuggestions(suggestions.length > 0 ? suggestions : [response]);
      setHasGenerated(true);
    } catch (error) {
      console.error('AI Error:', error);
      toast({
        title: language === "ur" ? "خرابی" : "Error",
        description: language === "ur" ? "AI تجاویز حاصل نہیں ہو سکیں" : "Could not fetch AI suggestions",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const totalSavings = tips.reduce((sum, tip) => sum + parseInt(tip.savings.replace(/[^0-9]/g, '')), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("energySavingTips")}</h1>
          <p className="text-muted-foreground">
            {language === "ur" ? "اپنے بجلی کے بل کم کرنے کے لیے AI سے چلنے والی تجاویز" : "AI-powered recommendations to reduce your electricity bills"}
          </p>
        </div>

        {/* Potential Savings Card */}
        <Card className="gradient-bg border-0 overflow-hidden">
          <CardContent className="p-6 text-center relative">
            <Sparkles className="w-8 h-8 text-white/30 absolute top-4 right-4" />
            <p className="text-white/80 text-sm mb-1">{t("potentialSavings")}</p>
            <p className="text-4xl md:text-5xl font-bold text-white">Rs. {totalSavings.toLocaleString()}</p>
            <p className="text-white/70 text-sm mt-2">
              {language === "ur" ? "تمام تجاویز پر عمل کر کے ماہانہ" : "monthly by following all recommendations"}
            </p>
          </CardContent>
        </Card>

        {/* AI Powered Suggestions */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                {t("aiPoweredSuggestions")}
                <Badge variant="secondary" className="ml-2">AI</Badge>
              </CardTitle>
              <Button 
                onClick={generateAISuggestions} 
                disabled={loading}
                variant={hasGenerated ? "outline" : "default"}
                size="sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === "ur" ? "تیار ہو رہا ہے..." : "Generating..."}
                  </>
                ) : hasGenerated ? (
                  language === "ur" ? "نئی تجاویز" : "Regenerate"
                ) : (
                  language === "ur" ? "تجاویز حاصل کریں" : "Get Suggestions"
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!hasGenerated && !loading ? (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  {language === "ur" 
                    ? "اپنے استعمال کی بنیاد پر ذاتی AI تجاویز حاصل کرنے کے لیے بٹن دبائیں"
                    : "Click the button to get personalized AI suggestions based on your usage patterns"}
                </p>
              </div>
            ) : loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-10 h-10 text-primary mx-auto mb-3 animate-spin" />
                <p className="text-muted-foreground text-sm">
                  {language === "ur" ? "AI آپ کے لیے تجاویز تیار کر رہا ہے..." : "AI is generating personalized suggestions..."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{suggestion}</p>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {language === "ur" ? "آپ کے استعمال کے پیٹرن کی بنیاد پر" : "Based on typical Pakistani household patterns"}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Standard Tips Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1 group">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">
                          {language === "ur" ? tip.titleUr : tip.title}
                        </h3>
                        <Badge variant="secondary" className="bg-success/10 text-success border-0 ml-2 flex-shrink-0">
                          {tip.savings}{t("perMonth")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {language === "ur" ? tip.descriptionUr : tip.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tips;
