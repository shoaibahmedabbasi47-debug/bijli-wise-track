import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Phone, Mail, HelpCircle } from "lucide-react";

const faqs = [
  { q: "How is my bill calculated?", a: "Your bill is calculated based on units consumed multiplied by the applicable tariff rate." },
  { q: "How can I reduce my electricity bill?", a: "Check our Tips section for personalized recommendations to reduce consumption." },
  { q: "How do I report a meter issue?", a: "Submit a support ticket through this page and our team will assist you." },
];

const Support = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("support_tickets").insert({ user_id: user.id, subject, message });
    setLoading(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Ticket Submitted", description: "We'll get back to you soon." }); setSubject(""); setMessage(""); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Support</h1>
          <p className="text-muted-foreground">Get help with your account</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center"><CardContent className="p-6"><Phone className="w-8 h-8 text-primary mx-auto mb-2" /><p className="font-medium">Phone</p><p className="text-sm text-muted-foreground">0800-12345</p></CardContent></Card>
          <Card className="text-center"><CardContent className="p-6"><Mail className="w-8 h-8 text-primary mx-auto mb-2" /><p className="font-medium">Email</p><p className="text-sm text-muted-foreground">support@bijlitrack.com</p></CardContent></Card>
          <Card className="text-center"><CardContent className="p-6"><MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" /><p className="font-medium">Live Chat</p><p className="text-sm text-muted-foreground">24/7 Available</p></CardContent></Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Submit a Ticket</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief description" required /></div>
                <div className="space-y-2"><Label>Message</Label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue in detail" rows={4} required /></div>
                <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Ticket"}</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><HelpCircle className="w-5 h-5" /> FAQs</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-foreground mb-1">{faq.q}</p>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support;
