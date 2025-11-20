import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Context Providers
import { AuthProvider } from './pages/auth/AuthContext';
import { LanguageProvider } from './pages/buyer/LanguageContext'; // Note: This is now optional here as it's in main.tsx
import { NotificationProvider } from './pages/buyer/NotificationContext';

// Layout & Components
import { Header } from './pages/buyer/Header';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { HomePage } from './pages/buyer/HomePage';
import { Dashboard } from './pages/buyer/Dashboard';
import { AuctionDetails } from './pages/buyer/AuctionDetails';
import { CreateAuction } from './pages/seller/CreateAuction';
import { AdminPanel } from './pages/admin/AdminPanel';
import { UserProfile } from './pages/buyer/UserProfile';
import { PaymentPage } from './pages/buyer/PaymentPage';
import { LearnMorePage } from './pages/buyer/LearnMorePage';
import { WalletPage } from './pages/buyer/WalletPage';
import { BidPlacementPage } from './pages/buyer/BidPlacementPage';
import { TermsPage } from './pages/buyer/TermsPage';
import { NotificationsPage } from './pages/buyer/NotificationsPage';

// CSS Imports (already handled in main.tsx, but no harm in keeping them here)
//import './App.css'; 
import './index.css';

function Appn() {
  // NOTE: Router and Language/Auth providers are already handled in main.tsx,
  // so we can clean up the structure here. However, I've kept the NotificationProvider
  // here as it is often a specific application feature.

  return (
    <NotificationProvider>
      {/* This top-level div applies the global background and ensures minimum height. 
          If Tailwind is working, this should make your background change! */}
      <div className="min-h-screen bg-background">
        <Header />
        {/* Adds padding to push content below the fixed header */}
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auction/:id" element={<AuctionDetails />} />
            <Route path="/create-auction" element={<CreateAuction />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/payment/:auctionId" element={<PaymentPage />} />
            <Route path="/learn-more" element={<LearnMorePage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/wallet/:auctionId" element={<WalletPage />} />
            <Route path="/bid/:id" element={<BidPlacementPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </NotificationProvider>
  );
};