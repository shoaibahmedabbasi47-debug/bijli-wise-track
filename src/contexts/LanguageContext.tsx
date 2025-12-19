import { createContext, useContext, useState, ReactNode } from "react";

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
  
  // Dashboard
  totalUnits: { en: "Total Units", ur: "کل یونٹس" },
  avgDailyUsage: { en: "Avg. Daily Usage", ur: "روزانہ اوسط استعمال" },
  estimatedCost: { en: "Estimated Cost", ur: "تخمینی لاگت" },
  unpaidBills: { en: "Unpaid Bills", ur: "غیر ادا شدہ بل" },
  dailyUsageTrend: { en: "Daily Usage Trend", ur: "روزانہ استعمال کا رجحان" },
  monthlyBills: { en: "Monthly Bills", ur: "ماہانہ بل" },
  
  // Bills
  currentDue: { en: "Current Due", ur: "موجودہ واجبات" },
  totalPaid: { en: "Total Paid", ur: "کل ادا شدہ" },
  pendingBills: { en: "Pending Bills", ur: "زیر التواء بل" },
  billHistory: { en: "Bill History", ur: "بل کی تاریخ" },
  payNow: { en: "Pay Now", ur: "ابھی ادا کریں" },
  paid: { en: "Paid", ur: "ادا شدہ" },
  
  // Profile
  fullName: { en: "Full Name", ur: "پورا نام" },
  phone: { en: "Phone", ur: "فون" },
  address: { en: "Address", ur: "پتہ" },
  meterNumber: { en: "Meter Number", ur: "میٹر نمبر" },
  saveChanges: { en: "Save Changes", ur: "تبدیلیاں محفوظ کریں" },
  
  // Support
  contactUs: { en: "Contact Us", ur: "ہم سے رابطہ کریں" },
  submitTicket: { en: "Submit Ticket", ur: "ٹکٹ جمع کروائیں" },
  subject: { en: "Subject", ur: "موضوع" },
  message: { en: "Message", ur: "پیغام" },
  submit: { en: "Submit", ur: "جمع کروائیں" },
  
  // Tips
  energySavingTips: { en: "Energy Saving Tips", ur: "توانائی بچانے کی تجاویز" },
  potentialSavings: { en: "Potential Savings", ur: "ممکنہ بچت" },
  
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
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

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
