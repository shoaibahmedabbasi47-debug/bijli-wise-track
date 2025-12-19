import { useState, useEffect } from "react";
import { Users, FileText, DollarSign, TrendingUp, Activity } from "lucide-react";
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
} from "recharts";

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalUnits: 0,
    pendingBills: 0,
  });
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<{ month: string; amount: number }[]>([]);
  const [billStatusData, setBillStatusData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch profiles count
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Fetch bills data
        const { data: bills } = await supabase.from("bills").select("*");

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
          });

          setBillStatusData([
            { name: "Paid", value: paidBills },
            { name: "Pending", value: pendingBills },
          ]);

          // Group by month
          const monthlyMap: { [key: string]: number } = {};
          bills.forEach((bill) => {
            const month = bill.bill_month;
            monthlyMap[month] = (monthlyMap[month] || 0) + Number(bill.total_amount);
          });

          const sortedMonths = Object.entries(monthlyMap)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .slice(-6)
            .map(([month, amount]) => ({ month, amount }));

          setMonthlyData(sortedMonths);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const COLORS = ["hsl(var(--primary))", "hsl(var(--destructive))"];

  const statCards = [
    {
      title: t("totalUsers"),
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: t("totalRevenue"),
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: t("units"),
      value: `${stats.totalUnits.toLocaleString()} kWh`,
      icon: Activity,
      color: "text-yellow-500",
    },
    {
      title: t("pendingBills"),
      value: stats.pendingBills,
      icon: FileText,
      color: "text-red-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("admin")} {t("dashboard")}</h1>
        <p className="text-muted-foreground">System overview and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-10 h-10 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, "Revenue"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Bill Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={billStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {billStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
