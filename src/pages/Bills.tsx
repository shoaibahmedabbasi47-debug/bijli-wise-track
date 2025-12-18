import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receipt, Download, CheckCircle, Clock } from "lucide-react";

const bills = [
  { id: 1, month: "December 2024", units: 520, amount: 13000, dueDate: "Jan 15, 2025", paid: false },
  { id: 2, month: "November 2024", units: 480, amount: 12000, dueDate: "Dec 15, 2024", paid: true },
  { id: 3, month: "October 2024", units: 550, amount: 13750, dueDate: "Nov 15, 2024", paid: true },
  { id: 4, month: "September 2024", units: 420, amount: 10500, dueDate: "Oct 15, 2024", paid: true },
];

const Bills = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bills</h1>
            <p className="text-muted-foreground">View and manage your electricity bills</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="border-warning/50 bg-warning/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center"><Clock className="w-6 h-6 text-warning" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Due</p>
                  <p className="text-2xl font-bold text-foreground">Rs. 13,000</p>
                  <p className="text-sm text-warning">Due: Jan 15, 2025</p>
                </div>
              </div>
              <Button className="w-full mt-4">Pay Now</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6 text-success" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid (2024)</p>
                  <p className="text-2xl font-bold text-foreground">Rs. 36,250</p>
                  <p className="text-sm text-success">3 bills paid</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Bill History</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"><Receipt className="w-5 h-5 text-primary" /></div>
                    <div>
                      <p className="font-medium text-foreground">{bill.month}</p>
                      <p className="text-sm text-muted-foreground">{bill.units} kWh • Due: {bill.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-foreground">Rs. {bill.amount.toLocaleString()}</p>
                      <Badge variant={bill.paid ? "default" : "destructive"} className={bill.paid ? "bg-success" : ""}>{bill.paid ? "Paid" : "Unpaid"}</Badge>
                    </div>
                    <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
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
