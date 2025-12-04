// frontend/src/app.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { NotificationProvider } from './pages/buyer/NotificationContext';

// Components
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
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { OTPVerificationPage } from './pages/auth/OTPVerificationPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';






import './index.css';

function App() {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-background">
        <Header />

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
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp" element={<OTPVerificationPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Toaster position="top-right" />
      </div>
    </NotificationProvider>
  );
}

export default App;
