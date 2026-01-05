import { useState, useEffect } from "react";
import { 
  Users, 
  Zap, 
  Activity,
  AlertTriangle,
  Building2,
  Home,
  Factory,
  User,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Settings,
  RefreshCw,
  Download,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  Bell,
  MapPin,
  Gauge
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
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
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

interface TopConsumer {
  id: string;
  name: string;
  location: string;
  type: "Residential" | "Commercial" | "Industrial";
  usage: number;
  trend: "up" | "down" | "stable";
  change: string;
}

interface Alert {
  id: string;
  message: string;
  time: string;
  type: "warning" | "info" | "success" | "error";
  priority: "high" | "medium" | "low";
}

interface RecentActivity {
  id: string;
  action: string;
  user: string;
  time: string;
  status: "completed" | "pending" | "failed";
}

const AdminDashboard = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalUsage: 0,
    activeConnections: 0,
    systemAlerts: 0,
    revenue: 0,
    efficiency: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [monthlyData, setMonthlyData] = useState<{ month: string; units: number; revenue: number }[]>([]);
  const [userDistribution, setUserDistribution] = useState<{ name: string; value: number; color: string }[]>([]);
  const [topConsumers, setTopConsumers] = useState<TopConsumer[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [hourlyUsage, setHourlyUsage] = useState<{ hour: string; usage: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch profiles count
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch bills data for usage
      const { data: bills } = await supabase.from("bills").select("*");

      // Fetch open tickets for alerts
      const { count: openTickets } = await supabase
        .from("support_tickets")
        .select("*", { count: "exact", head: true })
        .eq("status", "open");

      if (bills) {
        const totalUnits = bills.reduce((sum, b) => sum + Number(b.total_units), 0);
        const totalRevenue = bills.reduce((sum, b) => sum + Number(b.total_amount), 0);

        setStats({
          totalUsers: usersCount || 1250,
          totalUsage: totalUnits || 458000,
          activeConnections: usersCount || 1180,
          systemAlerts: openTickets || 7,
          revenue: totalRevenue || 2850000,
          efficiency: 94.5,
        });

        // Group by month for chart
        const monthlyMap: { [key: string]: { units: number; revenue: number } } = {};
        bills.forEach((bill) => {
          const month = bill.bill_month;
          if (!monthlyMap[month]) {
            monthlyMap[month] = { units: 0, revenue: 0 };
          }
          monthlyMap[month].units += Number(bill.total_units);
          monthlyMap[month].revenue += Number(bill.total_amount);
        });

        const sortedMonths = Object.entries(monthlyMap)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .slice(-6)
          .map(([month, data]) => ({ month, units: data.units, revenue: data.revenue }));

        setMonthlyData(sortedMonths.length > 0 ? sortedMonths : sampleMonthlyData);
      }

      // Set user distribution
      setUserDistribution([
        { name: language === "ur" ? "رہائشی" : "Residential", value: 65, color: "hsl(var(--success))" },
        { name: language === "ur" ? "تجارتی" : "Commercial", value: 25, color: "hsl(var(--info))" },
        { name: language === "ur" ? "صنعتی" : "Industrial", value: 10, color: "hsl(var(--warning))" },
      ]);

      // Set sample data
      setTopConsumers(sampleTopConsumers);
      setRecentAlerts(sampleAlerts);
      setRecentActivity(sampleActivity);
      setHourlyUsage(sampleHourlyUsage);

    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Sample data
  const sampleMonthlyData = [
    { month: "Aug", units: 42000, revenue: 1050000 },
    { month: "Sep", units: 48000, revenue: 1200000 },
    { month: "Oct", units: 52000, revenue: 1300000 },
    { month: "Nov", units: 58000, revenue: 1450000 },
    { month: "Dec", units: 55000, revenue: 1375000 },
    { month: "Jan", units: 68000, revenue: 1700000 },
  ];

  const sampleTopConsumers: TopConsumer[] = [
    { id: "1", name: "Ahmed Khan", location: "Lahore", type: "Residential", usage: 450, trend: "up", change: "+12%" },
    { id: "2", name: "XYZ Industries", location: "Karachi", type: "Industrial", usage: 12500, trend: "down", change: "-5%" },
    { id: "3", name: "ABC Mall", location: "Islamabad", type: "Commercial", usage: 8900, trend: "up", change: "+8%" },
    { id: "4", name: "Sara Ahmed", location: "Faisalabad", type: "Residential", usage: 380, trend: "stable", change: "0%" },
    { id: "5", name: "Tech Hub Plaza", location: "Rawalpindi", type: "Commercial", usage: 5600, trend: "up", change: "+15%" },
  ];

  const sampleAlerts: Alert[] = [
    { id: "1", message: language === "ur" ? "سیکٹر 5 میں غیر معمولی اضافہ - فوری توجہ درکار" : "Unusual spike in Sector 5 - Immediate attention required", time: language === "ur" ? "10 منٹ پہلے" : "10 min ago", type: "error", priority: "high" },
    { id: "2", message: language === "ur" ? "نیا صارف رجسٹریشن میں اضافہ" : "New user registration spike detected", time: language === "ur" ? "1 گھنٹے پہلے" : "1 hour ago", type: "info", priority: "low" },
    { id: "3", message: language === "ur" ? "سسٹم مینٹیننس 2 بجے شیڈول" : "System maintenance scheduled at 2 AM", time: language === "ur" ? "2 گھنٹے پہلے" : "2 hours ago", type: "warning", priority: "medium" },
    { id: "4", message: language === "ur" ? "بیک اپ کامیابی سے مکمل" : "Backup completed successfully", time: language === "ur" ? "3 گھنٹے پہلے" : "3 hours ago", type: "success", priority: "low" },
  ];

  const sampleActivity: RecentActivity[] = [
    { id: "1", action: language === "ur" ? "نیا صارف رجسٹرڈ" : "New user registered", user: "Muhammad Ali", time: language === "ur" ? "5 منٹ پہلے" : "5 min ago", status: "completed" },
    { id: "2", action: language === "ur" ? "بل ادائیگی موصول" : "Bill payment received", user: "Fatima Khan", time: language === "ur" ? "15 منٹ پہلے" : "15 min ago", status: "completed" },
    { id: "3", action: language === "ur" ? "سپورٹ ٹکٹ کھولا گیا" : "Support ticket opened", user: "Ahmed Hassan", time: language === "ur" ? "30 منٹ پہلے" : "30 min ago", status: "pending" },
    { id: "4", action: language === "ur" ? "میٹر ریڈنگ اپ ڈیٹ" : "Meter reading updated", user: "System", time: language === "ur" ? "1 گھنٹے پہلے" : "1 hour ago", status: "completed" },
  ];

  const sampleHourlyUsage = [
    { hour: "00:00", usage: 2400 },
    { hour: "04:00", usage: 1800 },
    { hour: "08:00", usage: 4500 },
    { hour: "12:00", usage: 6200 },
    { hour: "16:00", usage: 5800 },
    { hour: "20:00", usage: 7200 },
    { hour: "23:00", usage: 3100 },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Residential":
        return <Home className="w-4 h-4 text-success" />;
      case "Commercial":
        return <Building2 className="w-4 h-4 text-info" />;
      case "Industrial":
        return <Factory className="w-4 h-4 text-warning" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-success" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Activity className="w-4 h-4 text-muted-foreground" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case "error":
        return "bg-destructive/10 border-destructive/30 text-destructive";
      case "warning":
        return "bg-warning/10 border-warning/30 text-warning";
      case "success":
        return "bg-success/10 border-success/30 text-success";
      default:
        return "bg-info/10 border-info/30 text-info";
    }
  };

  const formatUsage = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `Rs. ${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `Rs. ${(value / 1000).toFixed(0)}K`;
    }
    return `Rs. ${value}`;
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

  const statCards = [
    {
      title: language === "ur" ? "کل صارفین" : "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+15%",
      changeType: "positive" as const,
      changeText: language === "ur" ? "گزشتہ ہفتے سے" : "vs last week",
      icon: Users,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      gradient: "from-primary/20 to-primary/5",
    },
    {
      title: language === "ur" ? "کل استعمال" : "Total Usage",
      value: formatUsage(stats.totalUsage),
      subText: "kWh",
      change: "-8%",
      changeType: "negative" as const,
      changeText: language === "ur" ? "گزشتہ ہفتے سے" : "vs last week",
      icon: Zap,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      gradient: "from-success/20 to-success/5",
    },
    {
      title: language === "ur" ? "کل آمدنی" : "Total Revenue",
      value: formatCurrency(stats.revenue),
      change: "+22%",
      changeType: "positive" as const,
      changeText: language === "ur" ? "گزشتہ ماہ سے" : "vs last month",
      icon: DollarSign,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      gradient: "from-accent/20 to-accent/5",
    },
    {
      title: language === "ur" ? "سسٹم کارکردگی" : "System Efficiency",
      value: `${stats.efficiency}%`,
      change: "+2.5%",
      changeType: "positive" as const,
      changeText: language === "ur" ? "گزشتہ ماہ سے" : "vs last month",
      icon: Gauge,
      iconBg: "bg-info/10",
      iconColor: "text-info",
      gradient: "from-info/20 to-info/5",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {language === "ur" ? "ایڈمن ڈیش بورڈ" : "Admin Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {language === "ur" ? "سسٹم کا جائزہ اور تجزیات" : "System overview and analytics"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder={language === "ur" ? "تلاش..." : "Search..."} 
              className="pl-9 w-48"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className={cn("bg-gradient-to-br border-border/50 hover:shadow-lg transition-all duration-300", stat.gradient)}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                    {stat.subText && <span className="text-sm text-muted-foreground">{stat.subText}</span>}
                  </div>
                  {stat.change && (
                    <div className="flex items-center gap-1 mt-1">
                      {stat.changeType === "positive" ? (
                        <TrendingUp className="w-3 h-3 text-success" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-destructive" />
                      )}
                      <span className={cn("text-xs font-medium", stat.changeType === "positive" ? "text-success" : "text-destructive")}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">{stat.changeText}</span>
                    </div>
                  )}
                </div>
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.iconBg)}>
                  <stat.icon className={cn("w-6 h-6", stat.iconColor)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{language === "ur" ? "فعال کنکشن" : "Active Connections"}</p>
              <p className="text-xl font-bold text-foreground">{stats.activeConnections.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{language === "ur" ? "سسٹم الرٹس" : "System Alerts"}</p>
              <p className="text-xl font-bold text-foreground">{stats.systemAlerts}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{language === "ur" ? "ادا شدہ بل" : "Paid Bills"}</p>
              <p className="text-xl font-bold text-foreground">892</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{language === "ur" ? "زیر التوا بل" : "Pending Bills"}</p>
              <p className="text-xl font-bold text-foreground">358</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Usage & Revenue Trend */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">
              {language === "ur" ? "ماہانہ استعمال اور آمدنی" : "Monthly Usage & Revenue"}
            </CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData.length > 0 ? monthlyData : sampleMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => formatUsage(value)}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === "units" ? `${value.toLocaleString()} kWh` : formatCurrency(value),
                      name === "units" ? (language === "ur" ? "یونٹس" : "Units") : (language === "ur" ? "آمدنی" : "Revenue")
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="units" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={language === "ur" ? "یونٹس" : "Units"} />
                  <Bar yAxisId="right" dataKey="revenue" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name={language === "ur" ? "آمدنی" : "Revenue"} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              {language === "ur" ? "صارف کی تقسیم" : "User Distribution"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry: any) => (
                      <span className="text-xs text-muted-foreground">
                        {value} ({entry.payload.value}%)
                      </span>
                    )}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Usage Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            {language === "ur" ? "آج کا گھنٹہ وار استعمال" : "Today's Hourly Usage"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyUsage}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} kWh`, language === "ur" ? "استعمال" : "Usage"]}
                />
                <Area type="monotone" dataKey="usage" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Consumers */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">
              {language === "ur" ? "سب سے زیادہ صارفین" : "Top Consumers"}
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary text-xs">
              {language === "ur" ? "سب دیکھیں" : "View All"}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {topConsumers.map((consumer, index) => (
                <div key={consumer.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-muted-foreground w-6">#{index + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {getTypeIcon(consumer.type)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{consumer.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {consumer.location}
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {consumer.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-bold text-foreground">{formatUsage(consumer.usage)} kWh</p>
                      <p className="text-xs text-muted-foreground">{language === "ur" ? "ماہانہ" : "Monthly"}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(consumer.trend)}
                      <span className={cn(
                        "text-xs font-medium",
                        consumer.trend === "up" ? "text-success" : 
                        consumer.trend === "down" ? "text-destructive" : 
                        "text-muted-foreground"
                      )}>
                        {consumer.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              {language === "ur" ? "حالیہ سرگرمی" : "Recent Activity"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                <div className="mt-0.5">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card className="border-border/50">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            {language === "ur" ? "سسٹم الرٹس" : "System Alerts"}
            <Badge variant="destructive" className="ml-2">{recentAlerts.length}</Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary text-xs">
            {language === "ur" ? "سب صاف کریں" : "Clear All"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border",
                  getAlertStyles(alert.type)
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {alert.type === "error" && <XCircle className="w-5 h-5" />}
                  {alert.type === "warning" && <AlertTriangle className="w-5 h-5" />}
                  {alert.type === "success" && <CheckCircle className="w-5 h-5" />}
                  {alert.type === "info" && <Bell className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        alert.priority === "high" && "border-destructive text-destructive",
                        alert.priority === "medium" && "border-warning text-warning",
                        alert.priority === "low" && "border-muted-foreground text-muted-foreground"
                      )}
                    >
                      {alert.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;