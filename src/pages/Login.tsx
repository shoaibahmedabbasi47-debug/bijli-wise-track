import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import LanguageToggle from "@/components/LanguageToggle";
import { Zap, ArrowLeft, User, Shield } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"customer" | "admin">("customer");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast({
        title: t("error"),
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast({
        title: language === "ur" ? "لاگ ان ناکام" : "Login Failed",
        description: error.message === "Invalid login credentials" 
          ? (language === "ur" ? "غلط ای میل یا پاس ورڈ۔ دوبارہ کوشش کریں۔" : "Invalid email or password. Please try again.")
          : error.message,
        variant: "destructive",
      });
    } else {
      navigate("/dashboard");
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    const { error } = await signIn("demo@bijlitrack.com", "demo123456");
    setLoading(false);

    if (error) {
      toast({
        title: language === "ur" ? "ڈیمو لاگ ان ناکام" : "Demo Login Failed",
        description: language === "ur" 
          ? "ڈیمو اسناد سیٹ نہیں ہیں۔ براہ کرم نیا اکاؤنٹ بنائیں۔"
          : "Demo credentials not set up. Please sign up for a new account.",
        variant: "destructive",
      });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen gradient-bg-radial flex flex-col">
      {/* Header */}
      <header className="p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t("back")}</span>
          </Link>
          <LanguageToggle variant="pill" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-2xl p-6 md:p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-6 md:mb-8">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">BijliTrack</h1>
              <p className="text-muted-foreground text-sm md:text-base">{t("accessAccount")}</p>
            </div>

            {/* User Type Toggle */}
            <div className="flex bg-muted rounded-lg p-1 mb-6">
              <button
                onClick={() => setUserType("customer")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  userType === "customer"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="w-4 h-4" />
                {t("customer")}
              </button>
              <button
                onClick={() => setUserType("admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  userType === "admin"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shield className="w-4 h-4" />
                {t("admin")}
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={language === "ur" ? "اپنا ای میل درج کریں" : "Enter your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={language === "ur" ? "پاس ورڈ درج کریں" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  {t("forgotPassword")}
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("loading") : t("login")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                {t("useDemoCredentials")}
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              {t("dontHaveAccount")}{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                {t("signup")}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
