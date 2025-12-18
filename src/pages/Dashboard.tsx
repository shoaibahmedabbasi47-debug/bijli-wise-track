import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Zap, TrendingUp, Receipt, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

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

const Dashboard = () => {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState<UsageRecord[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const [usageRes, billsRes] = await Promise.all([
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
      ]);

      if (usageRes.data) setUsageData(usageRes.data);
      if (billsRes.data) setBills(billsRes.data);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  // Demo data for visualization
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your energy overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Units</p>
                  <p className="text-2xl font-bold text-foreground">{totalUnits}</p>
                  <p className="text-xs text-muted-foreground">This week</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Daily</p>
                  <p className="text-2xl font-bold text-foreground">{avgDaily} kWh</p>
                  <p className="text-xs text-success">↓ 12% from last week</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Est. Cost</p>
                  <p className="text-2xl font-bold text-foreground">Rs. {estimatedCost}</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unpaid Bills</p>
                  <p className="text-2xl font-bold text-foreground">{unpaidBills}</p>
                  <p className="text-xs text-destructive">Action needed</p>
                </div>
                <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Daily Usage (kWh)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(152, 69%, 31%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(152, 69%, 31%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(168, 30%, 88%)" />
                    <XAxis dataKey="name" stroke="hsl(160, 15%, 45%)" fontSize={12} />
                    <YAxis stroke="hsl(160, 15%, 45%)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(0, 0%, 100%)', 
                        border: '1px solid hsl(168, 30%, 88%)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area type="monotone" dataKey="units" stroke="hsl(152, 69%, 31%)" fillOpacity={1} fill="url(#colorUnits)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Bills (Rs.)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(168, 30%, 88%)" />
                    <XAxis dataKey="month" stroke="hsl(160, 15%, 45%)" fontSize={12} />
                    <YAxis stroke="hsl(160, 15%, 45%)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(0, 0%, 100%)', 
                        border: '1px solid hsl(168, 30%, 88%)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="amount" fill="hsl(152, 69%, 31%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Energy Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-secondary rounded-xl">
                <p className="font-medium text-foreground mb-1">Switch to LED</p>
                <p className="text-sm text-muted-foreground">Save up to 75% on lighting costs</p>
              </div>
              <div className="p-4 bg-secondary rounded-xl">
                <p className="font-medium text-foreground mb-1">Unplug Devices</p>
                <p className="text-sm text-muted-foreground">Standby power costs Rs. 500/month</p>
              </div>
              <div className="p-4 bg-secondary rounded-xl">
                <p className="font-medium text-foreground mb-1">AC at 24°C</p>
                <p className="text-sm text-muted-foreground">Each degree lower adds 6% cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
