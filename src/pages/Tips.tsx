import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Clock,
  Zap,
  Sun,
  Snowflake,
  Droplets,
  Target,
  TrendingDown,
  Calculator,
  CheckCircle2,
  Flame
} from "lucide-react";

const tips = [
  { icon: Lightbulb, title: "Switch to LED Bulbs", titleUr: "LED بلب لگائیں", description: "Replace incandescent bulbs with LED. Save up to 75% on lighting costs.", descriptionUr: "روشنی کے اخراجات میں 75% تک بچت کریں", savings: "Rs. 500", category: "lighting" },
  { icon: AirVent, title: "AC Temperature", titleUr: "AC کا درجہ حرارت", description: "Set your AC to 24-26°C. Each degree lower increases consumption by 6%.", descriptionUr: "ہر ڈگری کم کرنے پر استعمال 6% بڑھ جاتا ہے", savings: "Rs. 1,200", category: "cooling" },
  { icon: Fan, title: "Use Ceiling Fans", titleUr: "چھت کے پنکھے استعمال کریں", description: "Ceiling fans use 10x less electricity than AC. Use them when possible.", descriptionUr: "چھت کے پنکھے AC سے 10 گنا کم بجلی استعمال کرتے ہیں", savings: "Rs. 800", category: "cooling" },
  { icon: Refrigerator, title: "Fridge Settings", titleUr: "فریج کی ترتیبات", description: "Keep your fridge at 3-4°C and freezer at -18°C for optimal efficiency.", descriptionUr: "بہترین کارکردگی کے لیے فریج 3-4°C پر رکھیں", savings: "Rs. 300", category: "appliance" },
  { icon: Plug, title: "Unplug Devices", titleUr: "آلات نکال دیں", description: "Standby power can account for 10% of your bill. Unplug when not in use.", descriptionUr: "اسٹینڈبائی پاور آپ کے بل کا 10% ہو سکتی ہے", savings: "Rs. 400", category: "general" },
  { icon: Tv, title: "Smart TV Usage", titleUr: "سمارٹ ٹی وی کا استعمال", description: "Turn off TVs completely instead of standby. Use power strips for easy control.", descriptionUr: "اسٹینڈبائی کے بجائے ٹی وی مکمل بند کریں", savings: "Rs. 200", category: "appliance" },
];

const quickWins = [
  { icon: Lightbulb, title: "Turn off lights", titleUr: "لائٹس بند کریں", time: "1 sec", impact: 85 },
  { icon: Plug, title: "Unplug chargers", titleUr: "چارجر نکالیں", time: "5 sec", impact: 60 },
  { icon: AirVent, title: "Raise AC temp 2°", titleUr: "AC کا درجہ 2° بڑھائیں", time: "10 sec", impact: 90 },
  { icon: Fan, title: "Use fan instead", titleUr: "پنکھا استعمال کریں", time: "5 sec", impact: 95 },
];

const seasonalTips = {
  summer: [
    { icon: Sun, tip: "Use curtains to block direct sunlight", tipUr: "براہ راست دھوپ روکنے کے لیے پردے استعمال کریں" },
    { icon: AirVent, tip: "Clean AC filters monthly for efficiency", tipUr: "کارکردگی کے لیے ماہانہ AC فلٹرز صاف کریں" },
    { icon: Droplets, tip: "Use evaporative coolers in dry areas", tipUr: "خشک علاقوں میں ٹھنڈک کے لیے کولر استعمال کریں" },
  ],
  winter: [
    { icon: Snowflake, tip: "Use sunlight for natural heating", tipUr: "قدرتی حرارت کے لیے دھوپ استعمال کریں" },
    { icon: Flame, tip: "Seal gaps around doors and windows", tipUr: "دروازوں اور کھڑکیوں کے گرد خلا بند کریں" },
    { icon: Lightbulb, tip: "Layer clothing before turning on heaters", tipUr: "ہیٹر چلانے سے پہلے کپڑوں کی تہیں پہنیں" },
  ]
};

const Tips = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentBill, setCurrentBill] = useState<string>("5000");
  
  const currentMonth = new Date().getMonth();
  const isSummer = currentMonth >= 3 && currentMonth <= 8;
  const currentSeason = isSummer ? "summer" : "winter";

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

  const filteredTips = selectedCategory === "all" 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  const totalSavings = tips.reduce((sum, tip) => sum + parseInt(tip.savings.replace(/[^0-9]/g, '')), 0);
  const estimatedSavings = Math.round(parseInt(currentBill) * 0.25);

  const categories = [
    { id: "all", label: language === "ur" ? "سب" : "All" },
    { id: "cooling", label: language === "ur" ? "ٹھنڈک" : "Cooling" },
    { id: "lighting", label: language === "ur" ? "روشنی" : "Lighting" },
    { id: "appliance", label: language === "ur" ? "آلات" : "Appliances" },
    { id: "general", label: language === "ur" ? "عمومی" : "General" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("energySavingTips")}</h1>
          <p className="text-muted-foreground">
            {language === "ur" ? "اپنے بجلی کے بل کم کرنے کے لیے AI سے چلنے والی تجاویز" : "AI-powered recommendations to reduce your electricity bills"}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="gradient-bg border-0 overflow-hidden">
            <CardContent className="p-6 text-center relative">
              <Sparkles className="w-6 h-6 text-white/30 absolute top-4 right-4" />
              <p className="text-white/80 text-sm mb-1">{t("potentialSavings")}</p>
              <p className="text-3xl font-bold text-white">Rs. {totalSavings.toLocaleString()}</p>
              <p className="text-white/70 text-xs mt-1">{language === "ur" ? "ماہانہ" : "per month"}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="p-6 text-center relative">
              <Target className="w-6 h-6 text-success/50 absolute top-4 right-4" />
              <p className="text-muted-foreground text-sm mb-1">{language === "ur" ? "فوری بچت" : "Quick Wins"}</p>
              <p className="text-3xl font-bold text-success">{quickWins.length}</p>
              <p className="text-muted-foreground text-xs mt-1">{language === "ur" ? "فوری اقدامات" : "instant actions"}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 text-center relative">
              <TrendingDown className="w-6 h-6 text-primary/50 absolute top-4 right-4" />
              <p className="text-muted-foreground text-sm mb-1">{language === "ur" ? "موسمی تجاویز" : "Seasonal Tips"}</p>
              <p className="text-3xl font-bold text-primary">{isSummer ? "☀️" : "❄️"}</p>
              <p className="text-muted-foreground text-xs mt-1">{isSummer ? (language === "ur" ? "گرمی" : "Summer") : (language === "ur" ? "سردی" : "Winter")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Savings Calculator */}
        <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              {language === "ur" ? "بچت کیلکولیٹر" : "Savings Calculator"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <label className="text-sm text-muted-foreground mb-2 block">
                  {language === "ur" ? "آپ کا موجودہ بل (Rs)" : "Your current bill (Rs)"}
                </label>
                <input
                  type="number"
                  value={currentBill}
                  onChange={(e) => setCurrentBill(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="5000"
                />
              </div>
              <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                <span>=</span>
              </div>
              <div className="flex-1 w-full text-center md:text-left">
                <p className="text-sm text-muted-foreground mb-1">
                  {language === "ur" ? "تخمینی بچت (25%)" : "Estimated savings (25%)"}
                </p>
                <p className="text-3xl font-bold text-success">Rs. {estimatedSavings.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Wins */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              {language === "ur" ? "فوری بچت" : "Quick Wins"} 
              <Badge variant="secondary" className="bg-warning/10 text-warning">{language === "ur" ? "آج ہی شروع کریں" : "Start Today"}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickWins.map((win, index) => {
                const Icon = win.icon;
                return (
                  <div key={index} className="p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{language === "ur" ? win.titleUr : win.title}</p>
                        <p className="text-xs text-muted-foreground">{win.time}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{language === "ur" ? "اثر" : "Impact"}</span>
                        <span className="font-medium text-primary">{win.impact}%</span>
                      </div>
                      <Progress value={win.impact} className="h-1.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Tips */}
        <Card className={`border-0 ${isSummer ? "bg-gradient-to-br from-orange-500/10 to-yellow-500/5" : "bg-gradient-to-br from-blue-500/10 to-cyan-500/5"}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {isSummer ? <Sun className="w-5 h-5 text-orange-500" /> : <Snowflake className="w-5 h-5 text-blue-500" />}
              {language === "ur" ? `${isSummer ? "گرمی" : "سردی"} کی تجاویز` : `${isSummer ? "Summer" : "Winter"} Tips`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {seasonalTips[currentSeason].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-background/50 backdrop-blur-sm">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSummer ? "bg-orange-500/20" : "bg-blue-500/20"}`}>
                      <Icon className={`w-5 h-5 ${isSummer ? "text-orange-500" : "text-blue-500"}`} />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{language === "ur" ? item.tipUr : item.tip}</p>
                  </div>
                );
              })}
            </div>
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
                      <CheckCircle2 className="w-4 h-4 text-primary" />
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

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="rounded-full"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Standard Tips Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredTips.map((tip, index) => {
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