import { useState, useEffect } from "react";
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  UserPlus,
  Receipt,
  Settings,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

interface RecentActivity {
  id: string;
  type: "bill_paid" | "new_user" | "ticket" | "bill_created";
  description: string;
  time: string;
}

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalUnits: 0,
    pendingBills: 0,
    paidBills: 0,
    openTickets: 0,
  });
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<{ month: string; amount: number; units: number }[]>([]);
  const [billStatusData, setBillStatusData] = useState<{ name: string; value: number }[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch profiles count
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch bills data
      const { data: bills } = await supabase.from("bills").select("*");

      // Fetch open tickets
      const { count: openTickets } = await supabase
        .from("support_tickets")
        .select("*", { count: "exact", head: true })
        .eq("status", "open");

      if (bills) {
        const totalRevenue = bills
          .filter((b) => b.paid)
          .reduce((sum, b) => sum + Number(b.total_amount), 0);
        const totalUnits = bills.reduce((sum, b) => sum + Number(b.total_units), 0);
        const pendingBills = bills.filter((b) => !b.paid).length;
        const paidBills = bills.filter((b) => b.paid).length;

        setStats({
          totalUsers: usersCount || 0,
          totalRevenue,
          totalUnits,
          pendingBills,
          paidBills,
          openTickets: openTickets || 0,
        });

        setBillStatusData([
          { name: language === "ur" ? "ادا شدہ" : "Paid", value: paidBills },
          { name: language === "ur" ? "زیر التوا" : "Pending", value: pendingBills },
        ]);

        // Group by month with units
        const monthlyMap: { [key: string]: { amount: number; units: number } } = {};
        bills.forEach((bill) => {
          const month = bill.bill_month;
          if (!monthlyMap[month]) {
            monthlyMap[month] = { amount: 0, units: 0 };
          }
          monthlyMap[month].amount += Number(bill.total_amount);
          monthlyMap[month].units += Number(bill.total_units);
        });

        const sortedMonths = Object.entries(monthlyMap)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .slice(-6)
          .map(([month, data]) => ({ month, ...data }));

        setMonthlyData(sortedMonths);

        // Create recent activities from bills
        const activities: RecentActivity[] = bills
          .slice(0, 5)
          .map((bill) => ({
            id: bill.id,
            type: bill.paid ? "bill_paid" as const : "bill_created" as const,
            description: bill.paid 
              ? `Bill for ${bill.bill_month} paid - Rs. ${Number(bill.total_amount).toLocaleString()}`
              : `Bill for ${bill.bill_month} created - Rs. ${Number(bill.total_amount).toLocaleString()}`,
            time: new Date(bill.created_at).toLocaleDateString(),
          }));
        setRecentActivities(activities);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const COLORS = ["hsl(142, 71%, 45%)", "hsl(0, 84%, 60%)"];

  const statCards = [
    {
      title: t("totalUsers"),
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      change: "+12%",
      changeUp: true,
    },
    {
      title: t("totalRevenue"),
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
      change: "+8%",
      changeUp: true,
    },
    {
      title: t("units"),
      value: `${stats.totalUnits.toLocaleString()} kWh`,
      icon: Zap,
      color: "from-yellow-500 to-yellow-600",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-500",
      change: "-3%",
      changeUp: false,
    },
    {
      title: t("pendingBills"),
      value: stats.pendingBills,
      icon: FileText,
      color: "from-red-500 to-red-600",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      change: stats.pendingBills > 5 ? "High" : "Normal",
      changeUp: false,
    },
  ];

  const quickActions = [
    { icon: UserPlus, label: language === "ur" ? "صارف شامل کریں" : "Add User", path: "/admin/users" },
    { icon: Receipt, label: language === "ur" ? "بل دیکھیں" : "View Bills", path: "/admin/bills" },
    { icon: FileText, label: language === "ur" ? "رپورٹس" : "Reports", path: "/admin/reports" },
    { icon: Settings, label: language === "ur" ? "ترتیبات" : "Settings", path: "/admin" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "bill_paid":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "new_user":
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case "ticket":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Receipt className="w-4 h-4 text-primary" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{language === "ur" ? "لوڈ ہو رہا ہے..." : "Loading dashboard..."}</p>
        </div>
      </div>
    );
  }

  const collectionRate = stats.paidBills + stats.pendingBills > 0 
    ? Math.round((stats.paidBills / (stats.paidBills + stats.pendingBills)) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/20">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("admin")} {t("dashboard")}</h1>
          <p className="text-muted-foreground mt-1">{language === "ur" ? "سسٹم کا جائزہ اور تجزیات" : "System overview and analytics"}</p>
        </div>
        <Button onClick={fetchStats} variant="outline" size="sm" className="w-fit gap-2 rounded-xl">
          <RefreshCw className="w-4 h-4" />
          {language === "ur" ? "تازہ کریں" : "Refresh"}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, index) => (
          <Card key={index} className="admin-stat-card group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2 font-medium">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    {stat.changeUp ? (
                      <div className="flex items-center gap-1 text-success bg-success/10 px-2 py-0.5 rounded-full">
                        <ArrowUpRight className="w-3 h-3" />
                        <span className="text-xs font-semibold">{stat.change}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                        <ArrowDownRight className="w-3 h-3" />
                        <span className="text-xs font-semibold">{stat.change}</span>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">{language === "ur" ? "اس ماہ" : "this month"}</span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${stat.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              {language === "ur" ? "فوری کاروائیاں" : "Quick Actions"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.path}>
                  <Button variant="outline" className="w-full h-auto py-5 flex flex-col items-center gap-3 hover:bg-primary/5 hover:border-primary/40 rounded-xl transition-all duration-300 group">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <action.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="lg:col-span-2 border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              {language === "ur" ? "سسٹم کی صحت" : "System Health"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-3 p-4 bg-muted/50 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">{language === "ur" ? "وصولی کی شرح" : "Collection Rate"}</span>
                  <span className="font-bold text-primary">{collectionRate}%</span>
                </div>
                <Progress value={collectionRate} className="h-2.5" />
                <p className="text-xs text-muted-foreground">
                  {stats.paidBills} {language === "ur" ? "میں سے" : "of"} {stats.paidBills + stats.pendingBills} {language === "ur" ? "بل ادا شدہ" : "bills paid"}
                </p>
              </div>
              <div className="space-y-3 p-4 bg-muted/50 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">{language === "ur" ? "کھلے ٹکٹ" : "Open Tickets"}</span>
                  <span className="font-bold text-warning">{stats.openTickets}</span>
                </div>
                <Progress value={stats.openTickets > 10 ? 100 : stats.openTickets * 10} className="h-2.5" />
                <p className="text-xs text-muted-foreground">
                  {stats.openTickets > 5 
                    ? (language === "ur" ? "توجہ درکار" : "Needs attention")
                    : (language === "ur" ? "نارمل" : "Normal")}
                </p>
              </div>
              <div className="space-y-3 p-4 bg-muted/50 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">{language === "ur" ? "فعال صارفین" : "Active Users"}</span>
                  <span className="font-bold text-info">{stats.totalUsers}</span>
                </div>
                <Progress value={Math.min(stats.totalUsers * 10, 100)} className="h-2.5" />
                <p className="text-xs text-muted-foreground">
                  {language === "ur" ? "کل رجسٹرڈ صارفین" : "Total registered users"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              {language === "ur" ? "ماہانہ آمدنی" : "Monthly Revenue"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, language === "ur" ? "آمدنی" : "Revenue"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              {language === "ur" ? "بل کی صورتحال" : "Bill Status Distribution"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={billStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {billStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-4">
              {billStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-sm font-medium text-foreground">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Units Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              {language === "ur" ? "حالیہ سرگرمی" : "Recent Activity"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-4 rounded-xl hover:bg-muted/50 transition-all duration-300 border border-transparent hover:border-border/50">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-medium truncate">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {language === "ur" ? "کوئی حالیہ سرگرمی نہیں" : "No recent activity"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Units Trend */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              {language === "ur" ? "یونٹس کا رجحان" : "Units Trend"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()} kWh`, language === "ur" ? "یونٹس" : "Units"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="units"
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;