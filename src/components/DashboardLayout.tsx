import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BarChart3, 
  Receipt, 
  Lightbulb, 
  User, 
  HelpCircle,
  LogOut,
  Zap,
  Menu,
  X,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import LanguageToggle from "@/components/LanguageToggle";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  full_name: string | null;
}

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut, user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const navItems = [
    { path: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { path: "/usage", label: t("usage"), icon: BarChart3 },
    { path: "/bills", label: t("bills"), icon: Receipt },
    { path: "/tips", label: t("tips"), icon: Lightbulb },
    { path: "/profile", label: t("profile"), icon: User },
    { path: "/support", label: t("support"), icon: HelpCircle },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      const [profileRes, roleRes] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("user_id", user.id).single(),
        supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle()
      ]);
      
      if (profileRes.data) setProfile(profileRes.data);
      setIsAdmin(!!roleRes.data);
    };
    fetchData();
  }, [user]);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">BijliTrack</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle variant="modern" />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 shadow-xl lg:shadow-none",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-border/50">
          <Link to="/dashboard" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground block">BijliTrack</span>
              <span className="text-xs text-muted-foreground">Energy Dashboard</span>
            </div>
          </Link>
        </div>

        {/* Language Toggle in Sidebar - Desktop */}
        <div className="hidden lg:block px-4 py-3 border-b border-border/50">
          <LanguageToggle variant="modern" />
        </div>

        <nav className="px-4 py-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "nav-link",
                  isActive && "nav-link-active"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
          
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "nav-link mt-4 border-t border-border/50 pt-4",
                location.pathname.startsWith("/admin") && "nav-link-active"
              )}
            >
              <Shield className="w-5 h-5" />
              {t("admin")}
            </Link>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-muted/30">
          <div className="px-3 py-3 mb-3 bg-card rounded-xl border border-border/50">
            <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="nav-link w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
            {t("logout")}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};