import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Zap, TrendingUp, Clock, Sun, Moon, Sunset } from "lucide-react";

const weeklyData = [
  { day: "Mon", units: 45, cost: 1125 },
  { day: "Tue", units: 52, cost: 1300 },
  { day: "Wed", units: 38, cost: 950 },
  { day: "Thu", units: 65, cost: 1625 },
  { day: "Fri", units: 48, cost: 1200 },
  { day: "Sat", units: 72, cost: 1800 },
  { day: "Sun", units: 55, cost: 1375 },
];

const hourlyData = [
  { hour: "12am", units: 2 },
  { hour: "3am", units: 1 },
  { hour: "6am", units: 4 },
  { hour: "9am", units: 8 },
  { hour: "12pm", units: 12 },
  { hour: "3pm", units: 15 },
  { hour: "6pm", units: 18 },
  { hour: "9pm", units: 14 },
];

const Usage = () => {
  const { t, language } = useLanguage();

  const peakHours = [
    { 
      period: language === "ur" ? "صبح" : "Morning", 
      time: "6 AM - 12 PM", 
      usage: "25%", 
      icon: Sun,
      color: "warning"
    },
    { 
      period: language === "ur" ? "دوپہر" : "Afternoon", 
      time: "12 PM - 6 PM", 
      usage: "35%", 
      icon: Sunset,
      color: "destructive"
    },
    { 
      period: language === "ur" ? "شام/رات" : "Evening/Night", 
      time: "6 PM - 12 AM", 
      usage: "32%", 
      icon: Moon,
      color: "primary"
    },
    { 
      period: language === "ur" ? "رات" : "Night", 
      time: "12 AM - 6 AM", 
      usage: "8%", 
      icon: Moon,
      color: "muted"
    },
  ];

  const getBarColor = (hour: string) => {
    if (["6pm", "9pm"].includes(hour)) return "hsl(var(--destructive))";
    if (["3pm", "12pm"].includes(hour)) return "hsl(var(--warning))";
    return "hsl(var(--primary))";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("usageTracking")}</h1>
          <p className="text-muted-foreground">{t("monitorPatterns")}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">{t("today")}</p>
              <p className="text-xl md:text-3xl font-bold text-foreground">55 kWh</p>
              <p className="text-xs text-success mt-1">↓ 8% {language === "ur" ? "کل سے" : "from yesterday"}</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">{t("thisWeek")}</p>
              <p className="text-xl md:text-3xl font-bold text-foreground">375 kWh</p>
              <p className="text-xs text-success mt-1">↓ 12% {language === "ur" ? "گزشتہ ہفتے سے" : "from last week"}</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-warning" />
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">{t("thisMonth")}</p>
              <p className="text-xl md:text-3xl font-bold text-foreground">1,520 kWh</p>
              <p className="text-xs text-muted-foreground mt-1">{language === "ur" ? "تخمینی Rs. 38,000" : "Est. Rs. 38,000"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          {/* Weekly Usage Chart */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                {t("weeklyUsageTrend")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorUnitsUsage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                      formatter={(value: number) => [`${value} kWh`, language === "ur" ? "یونٹس" : "Units"]}
                    />
                    <Area type="monotone" dataKey="units" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUnitsUsage)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Hourly Usage Chart */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                {t("usageByTime")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number) => [`${value} kWh`, language === "ur" ? "یونٹس" : "Units"]}
                    />
                    <Bar dataKey="units" radius={[6, 6, 0, 0]}>
                      {hourlyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.hour)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-destructive" />
                  <span className="text-muted-foreground">{language === "ur" ? "پیک" : "Peak"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-warning" />
                  <span className="text-muted-foreground">{language === "ur" ? "زیادہ" : "High"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span className="text-muted-foreground">{language === "ur" ? "نارمل" : "Normal"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Peak Usage Hours */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-destructive" />
              {t("peakUsageHours")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {peakHours.map((period, index) => {
                const Icon = period.icon;
                return (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                      period.color === "destructive" ? "bg-destructive/5 border-destructive/20" :
                      period.color === "warning" ? "bg-warning/5 border-warning/20" :
                      period.color === "primary" ? "bg-primary/5 border-primary/20" :
                      "bg-muted/50 border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        period.color === "destructive" ? "bg-destructive/10" :
                        period.color === "warning" ? "bg-warning/10" :
                        period.color === "primary" ? "bg-primary/10" :
                        "bg-muted"
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          period.color === "destructive" ? "text-destructive" :
                          period.color === "warning" ? "text-warning" :
                          period.color === "primary" ? "text-primary" :
                          "text-muted-foreground"
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{period.period}</p>
                        <p className="text-xs text-muted-foreground">{period.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{language === "ur" ? "استعمال" : "Usage"}</span>
                      <span className={`text-lg font-bold ${
                        period.color === "destructive" ? "text-destructive" :
                        period.color === "warning" ? "text-warning" :
                        period.color === "primary" ? "text-primary" :
                        "text-muted-foreground"
                      }`}>{period.usage}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          period.color === "destructive" ? "bg-destructive" :
                          period.color === "warning" ? "bg-warning" :
                          period.color === "primary" ? "bg-primary" :
                          "bg-muted-foreground/30"
                        }`}
                        style={{ width: period.usage }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
              <p className="text-sm text-foreground font-medium">
                💡 {language === "ur" 
                  ? "تجویز: پیک اوقات (6 PM - 10 PM) میں بھاری آلات کا استعمال کم کریں تاکہ 15% تک بچت ہو سکے"
                  : "Tip: Reduce heavy appliance usage during peak hours (6 PM - 10 PM) to save up to 15%"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Usage;
