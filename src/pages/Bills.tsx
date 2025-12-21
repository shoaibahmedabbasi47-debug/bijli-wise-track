import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Receipt, Download, CheckCircle, Clock, TrendingUp, Zap, Info } from "lucide-react";

const bills = [
  { id: 1, month: "December 2024", units: 520, amount: 13000, dueDate: "Jan 15, 2025", paid: false },
  { id: 2, month: "November 2024", units: 480, amount: 12000, dueDate: "Dec 15, 2024", paid: true },
  { id: 3, month: "October 2024", units: 550, amount: 13750, dueDate: "Nov 15, 2024", paid: true },
  { id: 4, month: "September 2024", units: 420, amount: 10500, dueDate: "Oct 15, 2024", paid: true },
];

const rateSlabs = [
  { range: "1 - 100", rate: 7.74, description: "Basic consumption" },
  { range: "101 - 200", rate: 9.82, description: "Low usage" },
  { range: "201 - 300", rate: 12.48, description: "Medium usage" },
  { range: "301 - 400", rate: 16.64, description: "High usage" },
  { range: "401 - 500", rate: 20.84, description: "Very high usage" },
  { range: "501+", rate: 25.00, description: "Peak usage" },
];

const Bills = () => {
  const { t, language } = useLanguage();

  const prediction = {
    units: 495,
    amount: 12375,
    change: -5,
    tips: language === "ur" 
      ? ["AC کم استعمال کریں", "LED بلب لگائیں", "آلات بند رکھیں"]
      : ["Reduce AC usage", "Switch to LED bulbs", "Turn off standby devices"]
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("bills")}</h1>
            <p className="text-muted-foreground">
              {language === "ur" ? "اپنے بجلی کے بل دیکھیں اور ادا کریں" : "View and manage your electricity bills"}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="border-warning/50 bg-gradient-to-br from-warning/5 to-warning/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-warning/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{t("currentDue")}</p>
                  <p className="text-3xl font-bold text-foreground">Rs. 13,000</p>
                  <p className="text-sm text-warning">{language === "ur" ? "آخری تاریخ: 15 جنوری 2025" : "Due: Jan 15, 2025"}</p>
                </div>
              </div>
              <Button className="w-full mt-4" size="lg">{t("payNow")}</Button>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-success/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("totalPaid")} (2024)</p>
                  <p className="text-3xl font-bold text-foreground">Rs. 36,250</p>
                  <p className="text-sm text-success">{language === "ur" ? "3 بل ادا شدہ" : "3 bills paid"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rate Slabs and Prediction */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          {/* Rate Slabs */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                {t("rateSlabs")} (Rs/kWh)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rateSlabs.map((slab, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      index === 4 || index === 5 ? "bg-destructive/5 border border-destructive/20" :
                      index === 3 ? "bg-warning/5 border border-warning/20" :
                      "bg-muted/50 border border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        index === 4 || index === 5 ? "bg-destructive/10 text-destructive" :
                        index === 3 ? "bg-warning/10 text-warning" :
                        "bg-primary/10 text-primary"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{slab.range} {t("units")}</p>
                        <p className="text-xs text-muted-foreground">{slab.description}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${
                      index === 4 || index === 5 ? "text-destructive" :
                      index === 3 ? "text-warning" :
                      "text-primary"
                    }`}>
                      Rs. {slab.rate}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Month Prediction */}
          <Card className="hover:shadow-lg transition-shadow border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                {t("nextMonthPrediction")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{language === "ur" ? "متوقع یونٹس" : "Expected Units"}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{prediction.units} kWh</p>
                </div>
                <div className="p-4 bg-card rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Receipt className="w-4 h-4 text-warning" />
                    <span className="text-sm text-muted-foreground">{language === "ur" ? "متوقع بل" : "Expected Bill"}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">Rs. {prediction.amount.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="p-4 bg-success/5 border border-success/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-foreground">
                    {prediction.change}% {language === "ur" ? "گزشتہ ماہ سے کم" : "less than last month"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{t("basedOnUsage")}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  {language === "ur" ? "مزید کم کرنے کے لیے:" : "To reduce further:"}
                </p>
                <div className="space-y-2">
                  {prediction.tips.map((tip, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-primary font-medium">{index + 1}</span>
                      </div>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bill History */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              {t("billHistory")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bills.map((bill) => (
                <div 
                  key={bill.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-colors ${
                    !bill.paid ? "bg-warning/5 border-warning/20" : "bg-muted/50 border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3 sm:mb-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      bill.paid ? "bg-success/10" : "bg-warning/10"
                    }`}>
                      <Receipt className={`w-6 h-6 ${bill.paid ? "text-success" : "text-warning"}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{bill.month}</p>
                      <p className="text-sm text-muted-foreground">
                        {bill.units} kWh • {language === "ur" ? "آخری تاریخ:" : "Due:"} {bill.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">Rs. {bill.amount.toLocaleString()}</p>
                      <Badge variant={bill.paid ? "default" : "destructive"} className={bill.paid ? "bg-success hover:bg-success/90" : ""}>
                        {bill.paid ? t("paid") : t("unpaid")}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <Download className="w-5 h-5" />
                    </Button>
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

export default Bills;
