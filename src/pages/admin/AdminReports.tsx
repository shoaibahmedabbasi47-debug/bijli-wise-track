import { useState, useEffect } from "react";
import { BarChart3, Download, Calendar, TrendingUp, Users, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface ReportData {
  month: string;
  revenue: number;
  units: number;
  users: number;
}

const AdminReports = () => {
  const { t } = useLanguage();
  const [reportType, setReportType] = useState("monthly");
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalUnits: 0,
    avgMonthlyRevenue: 0,
    growthRate: 0,
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Fetch bills data
        const { data: bills } = await supabase.from("bills").select("*");

        // Fetch profiles count
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        if (bills) {
          // Group by month
          const monthlyMap: { [key: string]: { revenue: number; units: number } } = {};
          
          bills.forEach((bill) => {
            const month = bill.bill_month;
            if (!monthlyMap[month]) {
              monthlyMap[month] = { revenue: 0, units: 0 };
            }
            if (bill.paid) {
              monthlyMap[month].revenue += Number(bill.total_amount);
            }
            monthlyMap[month].units += Number(bill.total_units);
          });

          const sortedData = Object.entries(monthlyMap)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([month, data]) => ({
              month,
              revenue: data.revenue,
              units: data.units,
              users: usersCount || 0,
            }));

          setReportData(sortedData);

          // Calculate summary
          const totalRevenue = sortedData.reduce((sum, d) => sum + d.revenue, 0);
          const totalUnits = sortedData.reduce((sum, d) => sum + d.units, 0);
          const avgMonthlyRevenue = sortedData.length > 0 ? totalRevenue / sortedData.length : 0;
          
          // Calculate growth rate
          let growthRate = 0;
          if (sortedData.length >= 2) {
            const lastMonth = sortedData[sortedData.length - 1].revenue;
            const prevMonth = sortedData[sortedData.length - 2].revenue;
            if (prevMonth > 0) {
              growthRate = ((lastMonth - prevMonth) / prevMonth) * 100;
            }
          }

          setSummary({
            totalRevenue,
            totalUnits,
            avgMonthlyRevenue,
            growthRate,
          });
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
        toast.error("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportType]);

  const exportReport = () => {
    const csvContent = [
      ["Month", "Revenue (Rs.)", "Units (kWh)", "Users"],
      ...reportData.map((row) => [row.month, row.revenue, row.units, row.users]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bijlitrack-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" />
            {t("reports")}
          </h1>
          <p className="text-muted-foreground">Generate and export system reports</p>
        </div>
        <div className="flex gap-2">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("totalRevenue")}</p>
                <p className="text-xl font-bold">Rs. {summary.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total {t("units")}</p>
                <p className="text-xl font-bold">{summary.totalUnits.toLocaleString()} kWh</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Monthly Revenue</p>
                <p className="text-xl font-bold">Rs. {Math.round(summary.avgMonthlyRevenue).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${summary.growthRate >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                <TrendingUp className={`w-5 h-5 ${summary.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className={`text-xl font-bold ${summary.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.growthRate >= 0 ? '+' : ''}{summary.growthRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportData}>
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
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Units Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()} kWh`, "Units"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar dataKey="units" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Report Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3">Month</th>
                  <th className="text-right p-3">Revenue (Rs.)</th>
                  <th className="text-right p-3">Units (kWh)</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="p-3 font-medium">{row.month}</td>
                    <td className="p-3 text-right">{row.revenue.toLocaleString()}</td>
                    <td className="p-3 text-right">{row.units.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50 font-bold">
                  <td className="p-3">Total</td>
                  <td className="p-3 text-right">{summary.totalRevenue.toLocaleString()}</td>
                  <td className="p-3 text-right">{summary.totalUnits.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
