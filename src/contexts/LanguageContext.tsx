import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "ur";

interface Translations {
  [key: string]: {
    en: string;
    ur: string;
  };
}

const translations: Translations = {
  // Navigation
  dashboard: { en: "Dashboard", ur: "ڈیش بورڈ" },
  usage: { en: "Usage", ur: "استعمال" },
  bills: { en: "Bills", ur: "بل" },
  tips: { en: "Tips", ur: "تجاویز" },
  profile: { en: "Profile", ur: "پروفائل" },
  support: { en: "Support", ur: "سپورٹ" },
  logout: { en: "Logout", ur: "لاگ آؤٹ" },
  admin: { en: "Admin", ur: "ایڈمن" },
  
  // Home Page
  home: { en: "Home", ur: "ہوم" },
  login: { en: "Login", ur: "لاگ ان" },
  signup: { en: "Sign Up", ur: "سائن اپ" },
  getStarted: { en: "Get Started", ur: "شروع کریں" },
  learnMore: { en: "Learn More", ur: "مزید جانیں" },
  heroTitle: { en: "Track Your Electricity Usage in Real-Time", ur: "اپنی بجلی کے استعمال کو ریئل ٹائم میں ٹریک کریں" },
  heroSubtitle: { en: "Monitor daily consumption, reduce costs, and save energy with AI-powered insights", ur: "روزانہ استعمال کی نگرانی کریں، اخراجات کم کریں، اور AI بصیرت کے ساتھ توانائی بچائیں" },
  aiPowered: { en: "AI-Powered Energy Tracking", ur: "AI سے چلنے والی توانائی ٹریکنگ" },
  features: { en: "Features", ur: "خصوصیات" },
  featuresSubtitle: { en: "Take complete control of your electricity consumption", ur: "اپنی بجلی کی کھپت پر مکمل کنٹرول حاصل کریں" },
  howItWorks: { en: "How It Works", ur: "یہ کیسے کام کرتا ہے" },
  startSavingToday: { en: "Start Saving Today", ur: "آج سے بچت شروع کریں" },
  ctaSubtitle: { en: "Join thousands of Pakistani households saving on their electricity bills every month", ur: "ہر ماہ اپنے بجلی کے بلوں پر بچت کرنے والے ہزاروں پاکستانی گھرانوں میں شامل ہوں" },
  
  // Features
  realTimeTracking: { en: "Real-Time Tracking", ur: "ریئل ٹائم ٹریکنگ" },
  realTimeTrackingDesc: { en: "Monitor your electricity usage as it happens", ur: "جیسے ہی یہ ہو رہا ہے اپنی بجلی کے استعمال کی نگرانی کریں" },
  costSavings: { en: "Cost Savings", ur: "لاگت میں بچت" },
  costSavingsDesc: { en: "Identify wasteful habits and reduce your bills", ur: "فضول عادات کی نشاندہی کریں اور اپنے بل کم کریں" },
  smartAlerts: { en: "Smart Alerts", ur: "سمارٹ الرٹس" },
  smartAlertsDesc: { en: "Get notified when usage exceeds thresholds", ur: "جب استعمال حد سے تجاوز کرے تو مطلع ہوں" },
  aiEnergyTips: { en: "AI Energy Tips", ur: "AI توانائی تجاویز" },
  aiEnergyTipsDesc: { en: "Personalized suggestions to optimize usage", ur: "استعمال کو بہتر بنانے کی ذاتی تجاویز" },
  analysis: { en: "Analysis", ur: "تجزیہ" },
  analysisDesc: { en: "Detailed reports and charts", ur: "تفصیلی رپورٹس اور چارٹس" },
  savings: { en: "Savings", ur: "بچت" },
  savingsDesc: { en: "Save money and conserve energy", ur: "پیسے بچائیں اور توانائی محفوظ کریں" },
  
  // Login/Signup
  back: { en: "Back", ur: "واپس" },
  accessAccount: { en: "Access your account", ur: "اپنے اکاؤنٹ تک رسائی حاصل کریں" },
  customer: { en: "Customer", ur: "گاہک" },
  email: { en: "Email", ur: "ای میل" },
  password: { en: "Password", ur: "پاس ورڈ" },
  forgotPassword: { en: "Forgot Password?", ur: "پاس ورڈ بھول گئے؟" },
  dontHaveAccount: { en: "Don't have an account?", ur: "اکاؤنٹ نہیں ہے؟" },
  alreadyHaveAccount: { en: "Already have an account?", ur: "پہلے سے اکاؤنٹ ہے؟" },
  createAccount: { en: "Create Account", ur: "اکاؤنٹ بنائیں" },
  startTracking: { en: "Start tracking your electricity usage", ur: "اپنی بجلی کے استعمال کی ٹریکنگ شروع کریں" },
  confirmPassword: { en: "Confirm Password", ur: "پاس ورڈ کی تصدیق کریں" },
  useDemoCredentials: { en: "Use Demo Credentials", ur: "ڈیمو اسناد استعمال کریں" },
  
  // Dashboard
  totalUnits: { en: "Total Units", ur: "کل یونٹس" },
  avgDailyUsage: { en: "Avg. Daily Usage", ur: "روزانہ اوسط استعمال" },
  estimatedCost: { en: "Estimated Cost", ur: "تخمینی لاگت" },
  unpaidBills: { en: "Unpaid Bills", ur: "غیر ادا شدہ بل" },
  dailyUsageTrend: { en: "Daily Usage Trend", ur: "روزانہ استعمال کا رجحان" },
  monthlyBills: { en: "Monthly Bills", ur: "ماہانہ بل" },
  alerts: { en: "Alerts", ur: "الرٹس" },
  applianceUsage: { en: "Appliance Usage", ur: "آلات کا استعمال" },
  highUsageAlert: { en: "High Usage Alert", ur: "زیادہ استعمال کا الرٹ" },
  billDueAlert: { en: "Bill Due Soon", ur: "بل کی ادائیگی قریب" },
  peakHoursAlert: { en: "Peak Hours Active", ur: "پیک اوقات فعال" },
  
  // Bills
  currentDue: { en: "Current Due", ur: "موجودہ واجبات" },
  totalPaid: { en: "Total Paid", ur: "کل ادا شدہ" },
  pendingBills: { en: "Pending Bills", ur: "زیر التواء بل" },
  billHistory: { en: "Bill History", ur: "بل کی تاریخ" },
  payNow: { en: "Pay Now", ur: "ابھی ادا کریں" },
  paid: { en: "Paid", ur: "ادا شدہ" },
  unpaid: { en: "Unpaid", ur: "غیر ادا شدہ" },
  rateSlabs: { en: "Rate Slabs", ur: "شرح کے درجات" },
  nextMonthPrediction: { en: "Next Month Prediction", ur: "اگلے مہینے کی پیشگوئی" },
  basedOnUsage: { en: "Based on your usage pattern", ur: "آپ کے استعمال کے پیٹرن پر مبنی" },
  
  // Usage
  usageTracking: { en: "Usage Tracking", ur: "استعمال کی ٹریکنگ" },
  monitorPatterns: { en: "Monitor your electricity consumption patterns", ur: "اپنی بجلی کی کھپت کے نمونوں کی نگرانی کریں" },
  today: { en: "Today", ur: "آج" },
  thisWeek: { en: "This Week", ur: "اس ہفتے" },
  thisMonth: { en: "This Month", ur: "اس مہینے" },
  weeklyUsageTrend: { en: "Weekly Usage Trend", ur: "ہفتہ وار استعمال کا رجحان" },
  peakUsageHours: { en: "Peak Usage Hours", ur: "زیادہ استعمال کے اوقات" },
  usageByTime: { en: "Usage by Time of Day", ur: "دن کے وقت کے حساب سے استعمال" },
  
  // Profile
  fullName: { en: "Full Name", ur: "پورا نام" },
  phone: { en: "Phone", ur: "فون" },
  address: { en: "Address", ur: "پتہ" },
  meterNumber: { en: "Meter Number", ur: "میٹر نمبر" },
  saveChanges: { en: "Save Changes", ur: "تبدیلیاں محفوظ کریں" },
  accountSettings: { en: "Account Settings", ur: "اکاؤنٹ کی ترتیبات" },
  personalInfo: { en: "Personal Information", ur: "ذاتی معلومات" },
  securitySettings: { en: "Security Settings", ur: "سیکیورٹی کی ترتیبات" },
  changePassword: { en: "Change Password", ur: "پاس ورڈ تبدیل کریں" },
  notifications: { en: "Notifications", ur: "اطلاعات" },
  emailNotifications: { en: "Email Notifications", ur: "ای میل اطلاعات" },
  smsNotifications: { en: "SMS Notifications", ur: "SMS اطلاعات" },
  
  // Support
  contactUs: { en: "Contact Us", ur: "ہم سے رابطہ کریں" },
  submitTicket: { en: "Submit a Ticket", ur: "ٹکٹ جمع کروائیں" },
  subject: { en: "Subject", ur: "موضوع" },
  message: { en: "Message", ur: "پیغام" },
  submit: { en: "Submit", ur: "جمع کروائیں" },
  liveChat: { en: "Live Chat", ur: "لائیو چیٹ" },
  available247: { en: "24/7 Available", ur: "24/7 دستیاب" },
  faqs: { en: "FAQs", ur: "عمومی سوالات" },
  helpCenter: { en: "Help Center", ur: "مدد مرکز" },
  
  // Tips
  energySavingTips: { en: "Energy Saving Tips", ur: "توانائی بچانے کی تجاویز" },
  potentialSavings: { en: "Potential Savings", ur: "ممکنہ بچت" },
  aiPoweredSuggestions: { en: "AI-Powered Suggestions", ur: "AI تجاویز" },
  personalizedTips: { en: "Personalized tips based on your usage", ur: "آپ کے استعمال کی بنیاد پر ذاتی تجاویز" },
  
  // Admin
  userManagement: { en: "User Management", ur: "صارف کا انتظام" },
  allBills: { en: "All Bills", ur: "تمام بل" },
  reports: { en: "Reports", ur: "رپورٹس" },
  totalUsers: { en: "Total Users", ur: "کل صارفین" },
  totalRevenue: { en: "Total Revenue", ur: "کل آمدنی" },
  activeUsers: { en: "Active Users", ur: "فعال صارفین" },
  generateReport: { en: "Generate Report", ur: "رپورٹ بنائیں" },
  
  // AI Assistant
  aiAssistant: { en: "AI Assistant", ur: "اے آئی اسسٹنٹ" },
  askQuestion: { en: "Ask a question...", ur: "سوال پوچھیں..." },
  translate: { en: "Translate", ur: "ترجمہ" },
  
  // Common
  loading: { en: "Loading...", ur: "لوڈ ہو رہا ہے..." },
  error: { en: "Error", ur: "خرابی" },
  success: { en: "Success", ur: "کامیابی" },
  cancel: { en: "Cancel", ur: "منسوخ" },
  save: { en: "Save", ur: "محفوظ کریں" },
  delete: { en: "Delete", ur: "حذف کریں" },
  edit: { en: "Edit", ur: "ترمیم" },
  view: { en: "View", ur: "دیکھیں" },
  search: { en: "Search", ur: "تلاش" },
  units: { en: "Units", ur: "یونٹس" },
  amount: { en: "Amount", ur: "رقم" },
  date: { en: "Date", ur: "تاریخ" },
  status: { en: "Status", ur: "حالت" },
  actions: { en: "Actions", ur: "کارروائیاں" },
  download: { en: "Download", ur: "ڈاؤن لوڈ" },
  perMonth: { en: "/month", ur: "/مہینہ" },
  kWh: { en: "kWh", ur: "کلو واٹ گھنٹہ" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("bijlitrack-language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("bijlitrack-language", language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language];
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ur" : "en");
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
