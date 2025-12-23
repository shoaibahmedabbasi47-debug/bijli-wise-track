import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Zap, Bell, Shield, Eye, EyeOff } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profile, setProfile] = useState({ full_name: "", phone: "", address: "", meter_number: "" });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    billReminder: true,
    usageAlerts: true
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (data) setProfile({ full_name: data.full_name || "", phone: data.phone || "", address: data.address || "", meter_number: data.meter_number || "" });
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update(profile).eq("user_id", user.id);
    setLoading(false);
    if (error) toast({ title: t("error"), description: error.message, variant: "destructive" });
    else toast({ title: t("success"), description: language === "ur" ? "پروفائل کامیابی سے اپ ڈیٹ ہو گیا" : "Profile updated successfully" });
  };

  const handleChangePassword = async () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: t("error"),
        description: language === "ur" ? "براہ کرم تمام فیلڈز بھریں" : "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: t("error"),
        description: language === "ur" ? "پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے" : "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: t("error"),
        description: language === "ur" ? "پاس ورڈ مماثل نہیں ہیں" : "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword,
    });
    setPasswordLoading(false);

    if (error) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t("success"),
        description: language === "ur" ? "پاس ورڈ کامیابی سے تبدیل ہو گیا" : "Password changed successfully",
      });
      setPasswordDialogOpen(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("profile")}</h1>
          <p className="text-muted-foreground">{t("accountSettings")}</p>
        </div>

        {/* Profile Header */}
        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary via-primary/80 to-accent" />
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <div className="w-24 h-24 bg-card rounded-2xl border-4 border-card shadow-lg flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>
              <div className="flex-1 pb-2">
                <h2 className="text-xl font-bold text-foreground">{profile.full_name || "User"}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {t("personalInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {t("fullName")}
                </Label>
                <Input 
                  value={profile.full_name} 
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} 
                  placeholder={language === "ur" ? "آپ کا نام" : "Your name"}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {t("phone")}
                </Label>
                <Input 
                  value={profile.phone} 
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })} 
                  placeholder="+92 300 1234567" 
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {t("address")}
                </Label>
                <Input 
                  value={profile.address} 
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })} 
                  placeholder={language === "ur" ? "آپ کا پتہ" : "Your address"} 
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  {t("meterNumber")}
                </Label>
                <Input 
                  value={profile.meter_number} 
                  onChange={(e) => setProfile({ ...profile, meter_number: e.target.value })} 
                  placeholder="e.g., 12345678" 
                />
              </div>
              <Button onClick={handleSave} disabled={loading} className="w-full">
                {loading ? t("loading") : t("saveChanges")}
              </Button>
            </CardContent>
          </Card>

          {/* Notifications & Security */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-warning" />
                  {t("notifications")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{t("emailNotifications")}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === "ur" ? "بل اور اپ ڈیٹس ای میل پر" : "Bills and updates via email"}
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.email} 
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{t("smsNotifications")}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === "ur" ? "اہم الرٹس SMS پر" : "Important alerts via SMS"}
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.sms} 
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {language === "ur" ? "بل کی یاد دہانی" : "Bill Reminders"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === "ur" ? "آخری تاریخ سے پہلے" : "Before due dates"}
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.billReminder} 
                    onCheckedChange={(checked) => setNotifications({...notifications, billReminder: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {language === "ur" ? "استعمال الرٹس" : "Usage Alerts"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === "ur" ? "زیادہ استعمال کی صورت میں" : "When usage exceeds threshold"}
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.usageAlerts} 
                    onCheckedChange={(checked) => setNotifications({...notifications, usageAlerts: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success" />
                  {t("securitySettings")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      {t("changePassword")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {language === "ur" ? "پاس ورڈ تبدیل کریں" : "Change Password"}
                      </DialogTitle>
                      <DialogDescription>
                        {language === "ur" 
                          ? "اپنا نیا پاس ورڈ درج کریں" 
                          : "Enter your new password below"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>{language === "ur" ? "نیا پاس ورڈ" : "New Password"}</Label>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder={language === "ur" ? "نیا پاس ورڈ" : "New password"}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{language === "ur" ? "پاس ورڈ کی تصدیق" : "Confirm Password"}</Label>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            placeholder={language === "ur" ? "پاس ورڈ کی تصدیق کریں" : "Confirm password"}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <Button 
                        onClick={handleChangePassword} 
                        disabled={passwordLoading} 
                        className="w-full"
                      >
                        {passwordLoading 
                          ? t("loading") 
                          : (language === "ur" ? "پاس ورڈ تبدیل کریں" : "Change Password")}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="p-4 bg-success/5 border border-success/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {language === "ur" ? "اکاؤنٹ محفوظ" : "Account Secured"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === "ur" ? "آخری لاگ ان: آج" : "Last login: Today"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
