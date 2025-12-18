import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weeklyData = [
  { day: "Mon", units: 45, cost: 1125 },
  { day: "Tue", units: 52, cost: 1300 },
  { day: "Wed", units: 38, cost: 950 },
  { day: "Thu", units: 65, cost: 1625 },
  { day: "Fri", units: 48, cost: 1200 },
  { day: "Sat", units: 72, cost: 1800 },
  { day: "Sun", units: 55, cost: 1375 },
];

const Usage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usage Tracking</h1>
          <p className="text-muted-foreground">Monitor your electricity consumption patterns</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-6 text-center"><p className="text-sm text-muted-foreground">Today</p><p className="text-3xl font-bold text-foreground">55 kWh</p></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><p className="text-sm text-muted-foreground">This Week</p><p className="text-3xl font-bold text-foreground">375 kWh</p></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><p className="text-sm text-muted-foreground">This Month</p><p className="text-3xl font-bold text-foreground">1,520 kWh</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Weekly Usage Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs><linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(152, 69%, 31%)" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(152, 69%, 31%)" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(168, 30%, 88%)" />
                  <XAxis dataKey="day" stroke="hsl(160, 15%, 45%)" />
                  <YAxis stroke="hsl(160, 15%, 45%)" />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid hsl(168, 30%, 88%)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="units" stroke="hsl(152, 69%, 31%)" fillOpacity={1} fill="url(#colorUnits)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Usage;
