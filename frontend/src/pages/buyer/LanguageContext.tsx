import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'am';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.create_auction': 'Create Auction',
    'nav.admin': 'Admin Panel',
    'nav.profile': 'Profile',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    
    // Common
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.bid_now': 'Bid Now',
    'common.place_bid': 'Place Bid',
    'common.current_bid': 'Current Bid',
    'common.time_left': 'Time Left',
    'common.ended': 'Ended',
    'common.starting_bid': 'Starting Bid',
    'common.reserve_price': 'Reserve Price',
    'common.bid_increment': 'Bid Increment',
    
    // Home page
    'home.title': 'Ethiopian Auction Platform',
    'home.subtitle': 'Discover unique items and bid on your favorites',
    'home.featured_auctions': 'Featured Auctions',
    'home.search_placeholder': 'Search auctions...',
    
    // Authentication
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.first_name': 'First Name',
    'auth.last_name': 'Last Name',
    'auth.phone': 'Phone Number',
    'auth.location': 'Location',
    'auth.role': 'Role',
    'auth.role_buyer': 'Buyer',
    'auth.role_seller': 'Seller',
    'auth.login_title': 'Login to Your Account',
    'auth.register_title': 'Create New Account',
    'auth.have_account': 'Already have an account?',
    'auth.no_account': "Don't have an account?",
    'auth.login_here': 'Login here',
    'auth.register_here': 'Register here',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.my_auctions': 'My Auctions',
    'dashboard.my_bids': 'My Bids',
    'dashboard.wallet_balance': 'Wallet Balance',
    'dashboard.create_new_auction': 'Create New Auction',
    'dashboard.recent_activity': 'Recent Activity',
    
    // Auction
    'auction.title': 'Title',
    'auction.description': 'Description',
    'auction.category': 'Category',
    'auction.duration': 'Duration',
    'auction.type': 'Auction Type',
    'auction.type_standard': 'Standard',
    'auction.type_flash': 'Flash Sale',
    'auction.type_sealed': 'Sealed Bids',
    'auction.seller': 'Seller',
    'auction.bidders': 'Bidders',
    'auction.bids': 'Bids',
    'auction.winning_bid': 'Winning Bid',
    
    // Payment
    'payment.title': 'Payment',
    'payment.method': 'Payment Method',
    'payment.wallet': 'Wallet Balance',
    'payment.telebirr': 'Telebirr',
    'payment.cbe_birr': 'CBE Birr',
    'payment.bank_transfer': 'Bank Transfer',
    'payment.amount': 'Amount',
    'payment.process': 'Process Payment',
    
    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.users': 'Users',
    'admin.auctions': 'Auctions',
    'admin.reports': 'Reports',
    'admin.settings': 'Settings',
    'admin.total_users': 'Total Users',
    'admin.active_auctions': 'Active Auctions',
    'admin.total_revenue': 'Total Revenue',
    'admin.pending_approvals': 'Pending Approvals',
  },
  am: {
    // Navigation
    'nav.home': 'መነሻ',
    'nav.dashboard': 'ዳሽቦርድ',
    'nav.create_auction': 'ጨረታ ፍጠር',
    'nav.admin': 'አስተዳዳሪ',
    'nav.profile': 'መገለጫ',
    'nav.login': 'ግባ',
    'nav.register': 'ተመዝገብ',
    'nav.logout': 'ውጣ',
    
    // Common
    'common.submit': 'አስገባ',
    'common.cancel': 'ሰርዝ',
    'common.save': 'አስቀምጥ',
    'common.edit': 'አርም',
    'common.delete': 'ሰርዝ',
    'common.view': 'ይመልከቱ',
    'common.bid_now': 'አሁን ጨረታ',
    'common.place_bid': 'ጨረታ አስቀምጥ',
    'common.current_bid': 'አሁኑ ጨረታ',
    'common.time_left': 'የቀረ ጊዜ',
    'common.ended': 'አለቀ',
    'common.starting_bid': 'መነሻ ጨረታ',
    'common.reserve_price': 'ዝቅተኛ ዋጋ',
    'common.bid_increment': 'የጨረታ መጨመሪያ',
    
    // Home page
    'home.title': 'የኢትዮጵያ ጨረታ መድረክ',
    'home.subtitle': 'ልዩ ዕቃዎችን አግኙ እና በወዳጅዎ ላይ ጨረታ ያድርጉ',
    'home.featured_auctions': 'ተመረጡ ጨረታዎች',
    'home.search_placeholder': 'ጨረታዎችን ይፈልጉ...',
    
    // Authentication
    'auth.email': 'ኢሜይል',
    'auth.password': 'ፓስወርድ',
    'auth.first_name': 'ስም',
    'auth.last_name': 'የአባት ስም',
    'auth.phone': 'ስልክ ቁጥር',
    'auth.location': 'አድራሻ',
    'auth.role': 'ሚና',
    'auth.role_buyer': 'ገዢ',
    'auth.role_seller': 'ሻጭ',
    'auth.login_title': 'ወደ መለያዎ ይግቡ',
    'auth.register_title': 'አዲስ መለያ ፍጠር',
    'auth.have_account': 'አስቀድመው መለያ አለዎት?',
    'auth.no_account': 'መለያ የለዎትም?',
    'auth.login_here': 'እዚህ ይግቡ',
    'auth.register_here': 'እዚህ ይመዝገቡ',
    
    // Dashboard
    'dashboard.welcome': 'እንኳን ደህና መጡ',
    'dashboard.my_auctions': 'የኔ ጨረታዎች',
    'dashboard.my_bids': 'የኔ ጨረታዎች',
    'dashboard.wallet_balance': 'የኪስ ቦርሳ ቀሪ',
    'dashboard.create_new_auction': 'አዲስ ጨረታ ፍጠር',
    'dashboard.recent_activity': 'የቅርብ ጊዜ እንቅስቃሴ',
    
    // Auction
    'auction.title': 'ርዕስ',
    'auction.description': 'መግለጫ',
    'auction.category': 'ምድብ',
    'auction.duration': 'ቆይታ',
    'auction.type': 'የጨረታ አይነት',
    'auction.type_standard': 'መደበኛ',
    'auction.type_flash': 'ፈጣን ሽያጭ',
    'auction.type_sealed': 'የተዘጋ ጨረታ',
    'auction.seller': 'ሻጭ',
    'auction.bidders': 'ጨራሾች',
    'auction.bids': 'ጨረታዎች',
    'auction.winning_bid': 'አሸናፊ ጨረታ',
    
    // Payment
    'payment.title': 'ክፍያ',
    'payment.method': 'የክፍያ መንገድ',
    'payment.wallet': 'የኪስ ቦርሳ ቀሪ',
    'payment.telebirr': 'ቴሌብር',
    'payment.cbe_birr': 'ሲቢኢ ብር',
    'payment.bank_transfer': 'የባንክ ዝውውር',
    'payment.amount': 'መጠን',
    'payment.process': 'ክፍያ አካሂድ',
    
    // Admin
    'admin.dashboard': 'የአስተዳዳሪ ዳሽቦርድ',
    'admin.users': 'ተጠቃሚዎች',
    'admin.auctions': 'ጨረታዎች',
    'admin.reports': 'ሪፖርቶች',
    'admin.settings': 'ቅንብሮች',
    'admin.total_users': 'ጠቅላላ ተጠቃሚዎች',
    'admin.active_auctions': 'ንቁ ጨረታዎች',
    'admin.total_revenue': 'ጠቅላላ ገቢ',
    'admin.pending_approvals': 'በመጠባበቅ ላይ ያሉ ፈቃዶች',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}