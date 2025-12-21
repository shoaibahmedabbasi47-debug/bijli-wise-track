import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import LanguageToggle from "@/components/LanguageToggle";
import { Zap, ArrowLeft } from "lucide-react";
import { z } from "zod";

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = signupSchema.safeParse({ fullName, email, password, confirmPassword });
    if (!validation.success) {
      toast({
        title: t("error"),
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);

    if (error) {
      let message = error.message;
      if (message.includes("already registered")) {
        message = language === "ur" 
          ? "یہ ای میل پہلے سے رجسٹرڈ ہے۔ براہ کرم لاگ ان کریں۔"
          : "This email is already registered. Please login instead.";
      }
      toast({
        title: language === "ur" ? "سائن اپ ناکام" : "Sign Up Failed",
        description: message,
        variant: "destructive",
      });
    } else {
      toast({
        title: language === "ur" ? "اکاؤنٹ بن گیا!" : "Account Created!",
        description: language === "ur" 
          ? "BijliTrack میں خوش آمدید۔ ڈیش بورڈ پر جا رہے ہیں..."
          : "Welcome to BijliTrack. Redirecting to dashboard...",
      });
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
              <h1 className="text-xl md:text-2xl font-bold text-foreground">{t("createAccount")}</h1>
              <p className="text-muted-foreground text-sm md:text-base text-center">{t("startTracking")}</p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t("fullName")}</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder={language === "ur" ? "اپنا پورا نام درج کریں" : "Enter your full name"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

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
                  placeholder={language === "ur" ? "پاس ورڈ بنائیں" : "Create a password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={language === "ur" ? "پاس ورڈ کی تصدیق کریں" : "Confirm your password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("loading") : t("signup")}
              </Button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              {t("alreadyHaveAccount")}{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                {t("login")}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
