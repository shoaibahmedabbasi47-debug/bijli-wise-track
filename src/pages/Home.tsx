import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogoWhite, Logo } from "@/components/Logo";
import { 
  Zap, 
  TrendingDown, 
  Bell, 
  Brain,
  ArrowRight,
  BarChart3,
  PiggyBank,
  Globe
} from "lucide-react";

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "35%", label: "Avg. Savings" },
  { value: "24/7", label: "Monitoring" },
  { value: "99.9%", label: "Uptime" },
];

const features = [
  {
    icon: Zap,
    title: "Real-Time Tracking",
    description: "Monitor your electricity usage as it happens",
  },
  {
    icon: TrendingDown,
    title: "Cost Savings",
    description: "Identify wasteful habits and reduce your bills",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified when usage exceeds thresholds",
  },
  {
    icon: Brain,
    title: "AI Energy Tips",
    description: "Personalized suggestions to optimize usage",
  },
];

const howItWorks = [
  {
    icon: Zap,
    title: "Real-Time Tracking",
    description: "Monitor usage every moment",
  },
  {
    icon: BarChart3,
    title: "Analysis",
    description: "Detailed reports and charts",
  },
  {
    icon: PiggyBank,
    title: "Savings",
    description: "Save money and conserve energy",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="w-4 h-4" />
                <span className="text-sm">اردو</span>
              </button>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-bg pt-32 pb-24 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
            <Zap className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-medium">AI-Powered Energy Tracking</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Track Your Electricity<br />Usage in Real-Time
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Monitor daily consumption, reduce costs, and save energy with AI-powered insights
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/login">
              <Button size="lg" variant="hero" className="w-full sm:w-auto">
                Get Started <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="heroOutline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Features</h2>
            <p className="text-muted-foreground text-lg">Take complete control of your electricity consumption</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Saving Today</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of Pakistani households saving on their electricity bills every month
          </p>
          <Link to="/login">
            <Button size="lg" variant="hero">
              Get Started <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-white font-bold">BijliTrack</span>
          </div>
          <p className="text-white/60 text-sm">© 2024 BijliTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
