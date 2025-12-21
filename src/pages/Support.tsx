import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Phone, Mail, HelpCircle, Send, CheckCircle, Clock, Headphones } from "lucide-react";

const faqs = [
  { 
    q: "How is my bill calculated?", 
    qUr: "میرا بل کیسے لگایا جاتا ہے؟",
    a: "Your bill is calculated based on units consumed multiplied by the applicable tariff rate. Different slabs have different rates.",
    aUr: "آپ کا بل استعمال شدہ یونٹس کو قابل اطلاق ٹیرف ریٹ سے ضرب دے کر لگایا جاتا ہے۔"
  },
  { 
    q: "How can I reduce my electricity bill?", 
    qUr: "میں اپنا بجلی کا بل کیسے کم کر سکتا ہوں؟",
    a: "Check our Tips section for personalized AI-powered recommendations to reduce consumption.",
    aUr: "استعمال کم کرنے کے لیے ذاتی AI تجاویز کے لیے ہماری تجاویز سیکشن دیکھیں۔"
  },
  { 
    q: "How do I report a meter issue?", 
    qUr: "میٹر کے مسئلے کی رپورٹ کیسے کروں؟",
    a: "Submit a support ticket through this page and our team will assist you within 24 hours.",
    aUr: "اس صفحے سے سپورٹ ٹکٹ جمع کروائیں اور ہماری ٹیم 24 گھنٹوں میں مدد کرے گی۔"
  },
  {
    q: "What are peak hours?",
    qUr: "پیک اوقات کیا ہیں؟",
    a: "Peak hours are typically 6 PM to 10 PM when electricity demand and rates are highest.",
    aUr: "پیک اوقات عام طور پر شام 6 بجے سے رات 10 بجے تک ہوتے ہیں جب بجلی کی مانگ زیادہ ہوتی ہے۔"
  },
  {
    q: "How do I update my meter number?",
    qUr: "میٹر نمبر کیسے اپ ڈیٹ کروں؟",
    a: "Go to your Profile section and update your meter number in the personal information card.",
    aUr: "پروفائل سیکشن میں جائیں اور ذاتی معلومات میں اپنا میٹر نمبر اپ ڈیٹ کریں۔"
  },
];

const Support = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
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
    if (error) toast({ title: t("error"), description: error.message, variant: "destructive" });
    else { 
      toast({ 
        title: language === "ur" ? "ٹکٹ جمع ہو گیا" : "Ticket Submitted", 
        description: language === "ur" ? "ہم جلد ہی آپ سے رابطہ کریں گے" : "We'll get back to you soon." 
      }); 
      setSubject(""); 
      setMessage(""); 
    }
  };

  const contactMethods = [
    { 
      icon: Phone, 
      title: language === "ur" ? "فون" : "Phone", 
      value: "0800-12345",
      description: language === "ur" ? "سوموار تا جمعہ، 9 AM - 6 PM" : "Mon-Fri, 9 AM - 6 PM",
      color: "primary"
    },
    { 
      icon: Mail, 
      title: language === "ur" ? "ای میل" : "Email", 
      value: "support@bijlitrack.com",
      description: language === "ur" ? "24 گھنٹوں میں جواب" : "Response within 24 hours",
      color: "warning"
    },
    { 
      icon: Headphones, 
      title: t("liveChat"), 
      value: t("available247"),
      description: language === "ur" ? "فوری مدد" : "Instant assistance",
      color: "success"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("support")}</h1>
          <p className="text-muted-foreground">{t("helpCenter")}</p>
        </div>

        {/* Contact Methods */}
        <div className="grid sm:grid-cols-3 gap-4">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <Card 
                key={index} 
                className={`text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-${method.color}/20 hover:border-${method.color}/40`}
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 bg-${method.color}/10 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-7 h-7 text-${method.color}`} />
                  </div>
                  <p className="font-semibold text-foreground">{method.title}</p>
                  <p className="text-sm text-primary font-medium">{method.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Submit Ticket */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                {t("submitTicket")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("subject")}</Label>
                  <Input 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    placeholder={language === "ur" ? "مختصر وضاحت" : "Brief description"} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("message")}</Label>
                  <Textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder={language === "ur" ? "اپنے مسئلے کی تفصیل لکھیں" : "Describe your issue in detail"} 
                    rows={5} 
                    required 
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? t("loading") : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t("submit")}
                    </>
                  )}
                </Button>
              </form>

              {/* Response Time */}
              <div className="mt-4 p-4 bg-success/5 border border-success/20 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {language === "ur" ? "تیز جواب" : "Quick Response"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === "ur" ? "عموماً 2-4 گھنٹوں میں جواب" : "Usually respond within 2-4 hours"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-warning" /> 
                {t("faqs")}
                <Badge variant="secondary" className="ml-2">{faqs.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-sm text-left hover:no-underline">
                      <span className="font-medium text-foreground">
                        {language === "ur" ? faq.qUr : faq.q}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground pt-2">
                        {language === "ur" ? faq.aUr : faq.a}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support;
