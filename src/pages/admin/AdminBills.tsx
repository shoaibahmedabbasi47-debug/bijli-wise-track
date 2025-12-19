import { useState, useEffect } from "react";
import { Search, FileText, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Bill {
  id: string;
  user_id: string;
  bill_month: string;
  total_units: number;
  total_amount: number;
  due_date: string | null;
  paid: boolean;
  paid_at: string | null;
  profile?: {
    full_name: string | null;
    meter_number: string | null;
  };
}

const AdminBills = () => {
  const { t } = useLanguage();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        // Fetch all bills
        const { data: billsData, error } = await supabase
          .from("bills")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Fetch profile data for each bill
        const billsWithProfiles = await Promise.all(
          (billsData || []).map(async (bill) => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name, meter_number")
              .eq("user_id", bill.user_id)
              .maybeSingle();

            return { ...bill, profile };
          })
        );

        setBills(billsWithProfiles);
      } catch (error) {
        console.error("Error fetching bills:", error);
        toast.error("Failed to load bills");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const togglePaidStatus = async (billId: string, currentlyPaid: boolean) => {
    try {
      const { error } = await supabase
        .from("bills")
        .update({
          paid: !currentlyPaid,
          paid_at: !currentlyPaid ? new Date().toISOString() : null,
        })
        .eq("id", billId);

      if (error) throw error;

      setBills((prev) =>
        prev.map((b) =>
          b.id === billId
            ? { ...b, paid: !currentlyPaid, paid_at: !currentlyPaid ? new Date().toISOString() : null }
            : b
        )
      );

      toast.success(currentlyPaid ? "Marked as unpaid" : "Marked as paid");
    } catch (error) {
      console.error("Error updating bill:", error);
      toast.error("Failed to update bill");
    }
  };

  const filteredBills = bills.filter((bill) => {
    const searchLower = search.toLowerCase();
    return (
      bill.bill_month.toLowerCase().includes(searchLower) ||
      bill.profile?.full_name?.toLowerCase().includes(searchLower) ||
      bill.profile?.meter_number?.toLowerCase().includes(searchLower)
    );
  });

  const totalRevenue = bills.filter((b) => b.paid).reduce((sum, b) => sum + Number(b.total_amount), 0);
  const pendingAmount = bills.filter((b) => !b.paid).reduce((sum, b) => sum + Number(b.total_amount), 0);

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
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-7 h-7 text-primary" />
          {t("allBills")}
        </h1>
        <p className="text-muted-foreground">View and manage all customer bills</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Bills</p>
            <p className="text-2xl font-bold">{bills.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Collected Revenue</p>
            <p className="text-2xl font-bold text-green-600">Rs. {totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending Amount</p>
            <p className="text-2xl font-bold text-red-600">Rs. {pendingAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle>Bill Records</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>{t("meterNumber")}</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>{t("units")}</TableHead>
                  <TableHead>{t("amount")}</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">
                      {bill.profile?.full_name || "N/A"}
                    </TableCell>
                    <TableCell>{bill.profile?.meter_number || "N/A"}</TableCell>
                    <TableCell>{bill.bill_month}</TableCell>
                    <TableCell>{bill.total_units} kWh</TableCell>
                    <TableCell>Rs. {Number(bill.total_amount).toLocaleString()}</TableCell>
                    <TableCell>
                      {bill.due_date ? format(new Date(bill.due_date), "dd MMM yyyy") : "N/A"}
                    </TableCell>
                    <TableCell>
                      {bill.paid ? (
                        <Badge className="bg-green-600">Paid</Badge>
                      ) : (
                        <Badge variant="destructive">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePaidStatus(bill.id, bill.paid)}
                        className="flex items-center gap-1"
                      >
                        {bill.paid ? (
                          <>
                            <X className="w-4 h-4" />
                            Mark Unpaid
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Mark Paid
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBills.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No bills found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBills;
