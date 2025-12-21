import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Zap, 
  TrendingUp, 
  Receipt, 
  AlertTriangle, 
  Lightbulb, 
  Calendar,
  Bell,
  AirVent,
  Tv,
  Refrigerator,
  Fan,
  WashingMachine,
  AlertCircle,
  Clock
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { format } from "date-fns";

interface UsageRecord {
  id: string;
  units_consumed: number;
  cost: number;
  recorded_date: string;
}

interface Bill {
  id: string;
  bill_month: string;
  total_amount: number;
  paid: boolean;
}

interface Profile {
  full_name: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [usageData, setUsageData] = useState<UsageRecord[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const [usageRes, billsRes, profileRes] = await Promise.all([
        supabase
          .from("usage_records")
          .select("*")
          .eq("user_id", user.id)
          .order("recorded_date", { ascending: true })
          .limit(30),
        supabase
          .from("bills")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", user.id)
          .single(),
      ]);

      if (usageRes.data) setUsageData(usageRes.data);
      if (billsRes.data) setBills(billsRes.data);
      if (profileRes.data) setProfile(profileRes.data);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const demoChartData = [
    { name: "Mon", units: 45 },
    { name: "Tue", units: 52 },
    { name: "Wed", units: 38 },
    { name: "Thu", units: 65 },
    { name: "Fri", units: 48 },
    { name: "Sat", units: 72 },
    { name: "Sun", units: 55 },
  ];

  const demoMonthlyData = [
    { month: "Jul", amount: 4500 },
    { month: "Aug", amount: 5200 },
    { month: "Sep", amount: 4800 },
    { month: "Oct", amount: 5500 },
    { month: "Nov", amount: 4200 },
    { month: "Dec", amount: 4800 },
  ];

  const applianceData = [
    { name: language === "ur" ? "اے سی" : "AC", value: 45, icon: AirVent, color: "hsl(var(--primary))" },
    { name: language === "ur" ? "فریج" : "Fridge", value: 20, icon: Refrigerator, color: "hsl(var(--accent))" },
    { name: language === "ur" ? "ٹی وی" : "TV", value: 15, icon: Tv, color: "hsl(var(--warning))" },
    { name: language === "ur" ? "واشنگ مشین" : "Washing", value: 12, icon: WashingMachine, color: "hsl(var(--info))" },
    { name: language === "ur" ? "پنکھے" : "Fans", value: 8, icon: Fan, color: "hsl(var(--success))" },
  ];

  const alerts = [
    { 
      type: "warning", 
      title: language === "ur" ? "زیادہ استعمال کا الرٹ" : "High Usage Alert",
      message: language === "ur" ? "آج کا استعمال اوسط سے 25% زیادہ ہے" : "Today's usage is 25% above average",
      icon: AlertTriangle,
      time: language === "ur" ? "2 گھنٹے پہلے" : "2 hours ago"
    },
    { 
      type: "danger", 
      title: language === "ur" ? "بل کی ادائیگی قریب" : "Bill Due Soon",
      message: language === "ur" ? "Rs. 13,000 کی ادائیگی 3 دن میں" : "Rs. 13,000 due in 3 days",
      icon: Receipt,
      time: language === "ur" ? "آج" : "Today"
    },
    { 
      type: "info", 
      title: language === "ur" ? "پیک اوقات فعال" : "Peak Hours Active",
      message: language === "ur" ? "5 بجے سے 10 بجے تک شرح زیادہ ہے" : "Higher rates from 5 PM - 10 PM",
      icon: Clock,
      time: language === "ur" ? "ابھی" : "Now"
    },
  ];

  const chartData = usageData.length > 0 
    ? usageData.map(d => ({ name: new Date(d.recorded_date).toLocaleDateString('en-US', { weekday: 'short' }), units: Number(d.units_consumed) }))
    : demoChartData;

  const monthlyData = bills.length > 0
    ? bills.map(b => ({ month: b.bill_month, amount: Number(b.total_amount) })).reverse()
    : demoMonthlyData;

  const totalUnits = usageData.reduce((sum, d) => sum + Number(d.units_consumed), 0) || 375;
  const avgDaily = (totalUnits / (usageData.length || 7)).toFixed(1);
  const unpaidBills = bills.filter(b => !b.paid).length || 1;
  const estimatedCost = (totalUnits * 25).toFixed(0);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');

  const welcomeMessage = language === 'ur' 
    ? `خوش آمدید، ${displayName}!`
    : `Welcome back, ${displayName}!`;

  const subtitleMessage = language === 'ur'
    ? 'آپ کی توانائی کا جائزہ یہاں ہے۔'
    : "Here's your energy overview.";

  const tips = language === 'ur' ? [
    { title: "LED پر جائیں", desc: "روشنی کے اخراجات میں 75% تک بچت" },
    { title: "آلات نکالیں", desc: "اسٹینڈبائی بجلی ماہانہ Rs. 500 خرچ کرتی ہے" },
    { title: "AC 24°C پر رکھیں", desc: "ہر ڈگری کم کرنے پر 6% لاگت بڑھتی ہے" },
  ] : [
    { title: "Switch to LED", desc: "Save up to 75% on lighting costs" },
    { title: "Unplug Devices", desc: "Standby power costs Rs. 500/month" },
    { title: "AC at 24°C", desc: "Each degree lower adds 6% cost" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header with Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 md:p-6 rounded-2xl border border-primary/20">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{welcomeMessage}</h1>
            <p className="text-muted-foreground mt-1">{subtitleMessage}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-xl border border-border">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* Alerts Section */}
        <Card className="border-warning/30 bg-gradient-to-r from-warning/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-warning" />
              {t("alerts")}
              <Badge variant="secondary" className="ml-2">{alerts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {alerts.map((alert, index) => {
                const Icon = alert.icon;
                return (
                  <div 
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${
                      alert.type === 'danger' ? 'bg-destructive/5 border-destructive/20' :
                      alert.type === 'warning' ? 'bg-warning/5 border-warning/20' :
                      'bg-info/5 border-info/20'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      alert.type === 'danger' ? 'bg-destructive/10' :
                      alert.type === 'warning' ? 'bg-warning/10' :
                      'bg-info/10'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        alert.type === 'danger' ? 'text-destructive' :
                        alert.type === 'warning' ? 'text-warning' :
                        'text-info'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-foreground text-sm">{alert.title}</p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{alert.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="hover:shadow-lg transition-shadow duration-300 border-primary/20 hover:border-primary/40">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-muted-foreground">{t("totalUnits")}</p>
                  <p className="text-xl md:text-3xl font-bold text-foreground">{totalUnits}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    {language === 'ur' ? 'اس ہفتے' : 'This week'}
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-accent/20 hover:border-accent/40">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-muted-foreground">{t("avgDailyUsage")}</p>
                  <p className="text-xl md:text-3xl font-bold text-foreground">{avgDaily}</p>
                  <p className="text-[10px] md:text-xs text-success">↓ 12% {language === 'ur' ? 'گزشتہ ہفتے سے' : 'from last week'}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-warning/20 hover:border-warning/40">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-muted-foreground">{t("estimatedCost")}</p>
                  <p className="text-xl md:text-3xl font-bold text-foreground">Rs. {estimatedCost}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    {language === 'ur' ? 'اس مہینے' : 'This month'}
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-warning/20 to-warning/10 rounded-xl flex items-center justify-center">
                  <Receipt className="w-5 h-5 md:w-6 md:h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-destructive/20 hover:border-destructive/40">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs md:text-sm text-muted-foreground">{t("unpaidBills")}</p>
                  <p className="text-xl md:text-3xl font-bold text-foreground">{unpaidBills}</p>
                  <p className="text-[10px] md:text-xs text-destructive">
                    {language === 'ur' ? 'کارروائی درکار' : 'Action needed'}
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-destructive/20 to-destructive/10 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Appliance Usage */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                {t("dailyUsageTrend")} (kWh)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Area type="monotone" dataKey="units" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUnits)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Appliance Usage */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <AirVent className="w-5 h-5 text-primary" />
                {t("applianceUsage")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {applianceData.map((appliance, index) => {
                  const Icon = appliance.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div 
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${appliance.color}20` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: appliance.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">{appliance.name}</span>
                          <span className="text-xs text-muted-foreground">{appliance.value}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${appliance.value}%`, backgroundColor: appliance.color }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Bills Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              {t("monthlyBills")} (Rs.)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning" />
              {t("energySavingTips")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
              {tips.map((tip, index) => (
                <div 
                  key={index}
                  className="p-4 bg-gradient-to-br from-secondary to-secondary/50 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm md:text-base">{tip.title}</p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">{tip.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
