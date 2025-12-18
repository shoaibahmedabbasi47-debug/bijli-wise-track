import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Fan, Tv, Refrigerator, AirVent, Plug } from "lucide-react";

const tips = [
  { icon: Lightbulb, title: "Switch to LED Bulbs", description: "Replace incandescent bulbs with LED. Save up to 75% on lighting costs.", savings: "Rs. 500/month" },
  { icon: AirVent, title: "AC Temperature", description: "Set your AC to 24-26°C. Each degree lower increases consumption by 6%.", savings: "Rs. 1,200/month" },
  { icon: Fan, title: "Use Ceiling Fans", description: "Ceiling fans use 10x less electricity than AC. Use them when possible.", savings: "Rs. 800/month" },
  { icon: Refrigerator, title: "Fridge Settings", description: "Keep your fridge at 3-4°C and freezer at -18°C for optimal efficiency.", savings: "Rs. 300/month" },
  { icon: Plug, title: "Unplug Devices", description: "Standby power can account for 10% of your bill. Unplug when not in use.", savings: "Rs. 400/month" },
  { icon: Tv, title: "Smart TV Usage", description: "Turn off TVs completely instead of standby. Use power strips for easy control.", savings: "Rs. 200/month" },
];

const Tips = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Energy Saving Tips</h1>
          <p className="text-muted-foreground">AI-powered recommendations to reduce your electricity bills</p>
        </div>

        <Card className="gradient-bg border-0">
          <CardContent className="p-6 text-center">
            <p className="text-white/80 text-sm mb-1">Potential Monthly Savings</p>
            <p className="text-4xl font-bold text-white">Rs. 3,400</p>
            <p className="text-white/70 text-sm mt-2">by following all recommendations</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{tip.title}</h3>
                        <span className="text-sm font-medium text-success">{tip.savings}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tips;
