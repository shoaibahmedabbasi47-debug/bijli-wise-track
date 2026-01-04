import { useState, useEffect } from "react";
import { 
  Users, 
  Zap, 
  Activity,
  AlertTriangle,
  Building2,
  Home,
  Factory,
  User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
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
} from "recharts";

interface TopConsumer {
  id: string;
  name: string;
  location: string;
  type: "Residential" | "Commercial" | "Industrial";
  usage: number;
}

interface Alert {
  id: string;
  message: string;
  time: string;
  type: "warning" | "info" | "success";
}

const AdminDashboard = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalUsage: 0,
    activeConnections: 0,
    systemAlerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<{ month: string; units: number }[]>([]);
  const [userDistribution, setUserDistribution] = useState<{ name: string; value: number; color: string }[]>([]);
  const [topConsumers, setTopConsumers] = useState<TopConsumer[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);

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

        setStats({
          totalUsers: usersCount || 0,
          totalUsage: totalUnits,
          activeConnections: usersCount || 0,
          systemAlerts: openTickets || 0,
        });

        // Group by month for chart
        const monthlyMap: { [key: string]: number } = {};
        bills.forEach((bill) => {
          const month = bill.bill_month;
          if (!monthlyMap[month]) {
            monthlyMap[month] = 0;
          }
          monthlyMap[month] += Number(bill.total_units);
        });

        const sortedMonths = Object.entries(monthlyMap)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .slice(-6)
          .map(([month, units]) => ({ month, units }));

        setMonthlyData(sortedMonths);
      }

      // Set user distribution (demo data for now)
      setUserDistribution([
        { name: language === "ur" ? "رہائشی" : "Residential", value: 65, color: "#22c55e" },
        { name: language === "ur" ? "تجارتی" : "Commercial", value: 25, color: "#3b82f6" },
        { name: language === "ur" ? "صنعتی" : "Industrial", value: 10, color: "#f59e0b" },
      ]);

      // Set top consumers (demo data)
      setTopConsumers([
        { id: "1", name: "Ahmed Khan", location: "Lahore", type: "Residential", usage: 450 },
        { id: "2", name: "XYZ Industries", location: "Karachi", type: "Industrial", usage: 1250 },
        { id: "3", name: "ABC Mall", location: "Islamabad", type: "Commercial", usage: 890 },
        { id: "4", name: "Sara Ahmed", location: "Faisalabad", type: "Residential", usage: 380 },
      ]);

      // Set recent alerts (demo data)
      setRecentAlerts([
        { id: "1", message: language === "ur" ? "سیکٹر 5 میں غیر معمولی اضافہ" : "Unusual spike in Sector 5", time: language === "ur" ? "10 منٹ پہلے" : "10 min ago", type: "warning" },
        { id: "2", message: language === "ur" ? "نیا صارف رجسٹریشن" : "New user registration spike", time: language === "ur" ? "1 گھنٹے پہلے" : "1 hour ago", type: "info" },
        { id: "3", message: language === "ur" ? "سسٹم مینٹیننس شیڈول" : "System maintenance scheduled", time: language === "ur" ? "2 گھنٹے پہلے" : "2 hours ago", type: "success" },
      ]);

    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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

  const formatUsage = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
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
      changeText: language === "ur" ? "گزشتہ ہفتے سے" : "vs last week",
      icon: Users,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: language === "ur" ? "کل استعمال" : "Total Usage",
      value: formatUsage(stats.totalUsage),
      subText: language === "ur" ? "یونٹس" : "Units",
      change: "-8%",
      changeText: language === "ur" ? "گزشتہ ہفتے سے" : "vs last week",
      icon: Zap,
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
    {
      title: language === "ur" ? "فعال کنکشن" : "Active Connections",
      value: stats.activeConnections.toLocaleString(),
      icon: Activity,
      iconBg: "bg-info/10",
      iconColor: "text-info",
    },
    {
      title: language === "ur" ? "سسٹم الرٹس" : "System Alerts",
      value: stats.systemAlerts.toString(),
      icon: AlertTriangle,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{language === "ur" ? "ایڈمن ڈیش بورڈ" : "Admin Dashboard"}</h1>
        <p className="text-sm text-primary mt-1">{language === "ur" ? "سسٹم کا جائزہ اور تجزیات" : "System overview and analytics"}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-card border-border/50">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    {stat.subText && <span className="text-sm text-muted-foreground">{stat.subText}</span>}
                  </div>
                  {stat.change && (
                    <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                      {stat.change} <span className="text-muted-foreground">{stat.changeText}</span>
                    </p>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Usage Trend */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              {language === "ur" ? "ماہانہ استعمال کا رجحان" : "Monthly Usage Trend"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData.length > 0 ? monthlyData : [
                  { month: "Jan", units: 42000 },
                  { month: "Feb", units: 48000 },
                  { month: "Mar", units: 52000 },
                  { month: "Apr", units: 58000 },
                  { month: "May", units: 55000 },
                  { month: "Jun", units: 68000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => formatUsage(value)}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()} kWh`, language === "ur" ? "یونٹس" : "Units"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="units"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
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
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
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
                      <span className="text-sm text-muted-foreground">
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

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Consumers */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              {language === "ur" ? "سب سے زیادہ صارفین" : "Top Consumers"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {topConsumers.map((consumer) => (
                <div key={consumer.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {getTypeIcon(consumer.type)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{consumer.name}</p>
                      <p className="text-xs text-muted-foreground">{consumer.location} • {consumer.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{consumer.usage} kWh</p>
                    <p className="text-xs text-muted-foreground">{language === "ur" ? "ماہانہ" : "Monthly"}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              {language === "ur" ? "حالیہ الرٹس" : "Recent Alerts"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`flex items-start gap-3 p-4 rounded-xl ${
                  alert.type === 'warning' ? 'bg-warning/10 border border-warning/20' :
                  alert.type === 'info' ? 'bg-info/10 border border-info/20' :
                  'bg-success/10 border border-success/20'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  alert.type === 'warning' ? 'bg-warning/20' :
                  alert.type === 'info' ? 'bg-info/20' :
                  'bg-success/20'
                }`}>
                  <AlertTriangle className={`w-3.5 h-3.5 ${
                    alert.type === 'warning' ? 'text-warning' :
                    alert.type === 'info' ? 'text-info' :
                    'text-success'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;