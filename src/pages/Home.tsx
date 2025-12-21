import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { 
  Zap, 
  TrendingDown, 
  Bell, 
  Brain,
  ArrowRight,
  BarChart3,
  PiggyBank,
} from "lucide-react";

const Home = () => {
  const { t, language } = useLanguage();

  const stats = [
    { value: "50K+", label: language === "ur" ? "فعال صارفین" : "Active Users" },
    { value: "35%", label: language === "ur" ? "اوسط بچت" : "Avg. Savings" },
    { value: "24/7", label: language === "ur" ? "نگرانی" : "Monitoring" },
    { value: "99.9%", label: language === "ur" ? "اپ ٹائم" : "Uptime" },
  ];

  const features = [
    {
      icon: Zap,
      title: t("realTimeTracking"),
      description: t("realTimeTrackingDesc"),
    },
    {
      icon: TrendingDown,
      title: t("costSavings"),
      description: t("costSavingsDesc"),
    },
    {
      icon: Bell,
      title: t("smartAlerts"),
      description: t("smartAlertsDesc"),
    },
    {
      icon: Brain,
      title: t("aiEnergyTips"),
      description: t("aiEnergyTipsDesc"),
    },
  ];

  const howItWorks = [
    {
      icon: Zap,
      title: t("realTimeTracking"),
      description: language === "ur" ? "ہر لمحہ استعمال کی نگرانی" : "Monitor usage every moment",
    },
    {
      icon: BarChart3,
      title: t("analysis"),
      description: t("analysisDesc"),
    },
    {
      icon: PiggyBank,
      title: t("savings"),
      description: t("savingsDesc"),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-2 md:gap-4">
              <LanguageToggle variant="pill" />
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">{t("login")}</Button>
              </Link>
              <Link to="/login">
                <Button size="sm">{t("getStarted")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-bg pt-24 md:pt-32 pb-20 md:pb-24 px-4 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 md:mb-8">
            <Zap className="w-4 h-4 text-white" />
            <span className="text-white/90 text-xs md:text-sm font-medium">{t("aiPowered")}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight px-2">
            {language === "ur" ? (
              <>اپنی بجلی کے استعمال کو<br />ریئل ٹائم میں ٹریک کریں</>
            ) : (
              <>Track Your Electricity<br />Usage in Real-Time</>
            )}
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-white/80 mb-8 md:mb-10 max-w-2xl mx-auto px-4">
            {t("heroSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-12 md:mb-16 px-4">
            <Link to="/login">
              <Button size="lg" variant="hero" className="w-full sm:w-auto">
                {t("getStarted")} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="heroOutline" className="w-full sm:w-auto">
              {t("learnMore")}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto px-2">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/70 text-xs md:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">{t("features")}</h2>
            <p className="text-muted-foreground text-base md:text-lg">{t("featuresSubtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">{t("howItWorks")}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg py-16 md:py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">{t("startSavingToday")}</h2>
          <p className="text-white/80 text-base md:text-lg mb-6 md:mb-8 max-w-xl mx-auto px-4">
            {t("ctaSubtitle")}
          </p>
          <Link to="/login">
            <Button size="lg" variant="hero">
              {t("getStarted")} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-6 md:py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-white font-bold">BijliTrack</span>
          </div>
          <p className="text-white/60 text-xs md:text-sm">© 2024 BijliTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
