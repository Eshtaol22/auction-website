import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { HomePage } from './pages/buyer/HomePage';
import { LanguageProvider } from './pages/buyer/LanguageContext';
import { AuthProvider } from './pages/auth/AuthContext';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
