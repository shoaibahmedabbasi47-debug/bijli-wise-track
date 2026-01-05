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
import { supabase } from "@/integrations/supabase/client";

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

  const checkAdminRole = async (userId: string): Promise<boolean> => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .single();
    return !!data;
  };

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

    if (error) {
      setLoading(false);
      toast({
        title: language === "ur" ? "لاگ ان ناکام" : "Login Failed",
        description: error.message === "Invalid login credentials" 
          ? (language === "ur" ? "غلط ای میل یا پاس ورڈ۔ دوبارہ کوشش کریں۔" : "Invalid email or password. Please try again.")
          : error.message,
        variant: "destructive",
      });
      return;
    }

    // Get the logged in user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const isAdmin = await checkAdminRole(user.id);
      
      if (userType === "admin") {
        if (isAdmin) {
          toast({
            title: language === "ur" ? "خوش آمدید ایڈمن" : "Welcome Admin",
            description: language === "ur" ? "ایڈمن ڈیش بورڈ میں خوش آمدید" : "Redirecting to admin dashboard...",
          });
          navigate("/admin");
        } else {
          toast({
            title: language === "ur" ? "رسائی رد" : "Access Denied",
            description: language === "ur" ? "آپ کے پاس ایڈمن رسائی نہیں ہے" : "You don't have admin access. Please login as customer.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
        }
      } else {
        toast({
          title: language === "ur" ? "خوش آمدید" : "Welcome Back",
          description: language === "ur" ? "ڈیش بورڈ پر جا رہے ہیں..." : "Redirecting to dashboard...",
        });
        navigate("/dashboard");
      }
    }
    
    setLoading(false);
  };


  return (
    <div className="min-h-screen gradient-bg-radial flex flex-col">
      {/* Header */}
      <header className="p-4 relative z-10">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-all duration-300 bg-card/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-card/30">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t("back")}</span>
          </Link>
          <LanguageToggle variant="pill" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl border border-border/30">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                <Zap className="w-9 h-9 md:w-11 md:h-11 text-primary-foreground" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">BijliTrack</h1>
              <p className="text-muted-foreground text-sm md:text-base mt-1">{t("accessAccount")}</p>
            </div>

            {/* User Type Toggle */}
            <div className="flex bg-muted/80 backdrop-blur-sm rounded-xl p-1.5 mb-6 border border-border/50 shadow-inner">
              <button
                onClick={() => setUserType("customer")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  userType === "customer"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                <User className="w-4 h-4" />
                {t("customer")}
              </button>
              <button
                onClick={() => setUserType("admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  userType === "admin"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                <Shield className="w-4 h-4" />
                {t("admin")}
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={language === "ur" ? "اپنا ای میل درج کریں" : "Enter your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl border-border/50 focus:border-primary/50 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={language === "ur" ? "پاس ورڈ درج کریں" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl border-border/50 focus:border-primary/50 transition-all duration-300"
                />
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                  {t("forgotPassword")}
                </Link>
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300" disabled={loading}>
                {loading ? t("loading") : t("login")}
              </Button>

            </form>

            {/* Sign Up Link - Only show for customers */}
            {userType === "customer" && (
              <p className="text-center text-sm text-muted-foreground mt-8">
                {t("dontHaveAccount")}{" "}
                <Link to="/signup" className="text-primary hover:underline font-semibold">
                  {t("signup")}
                </Link>
              </p>
            )}
            
            {/* Admin info */}
            {userType === "admin" && (
              <p className="text-center text-sm text-muted-foreground mt-8">
                {language === "ur" ? "صرف منتظمین کے لیے" : "Admin access only"}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
