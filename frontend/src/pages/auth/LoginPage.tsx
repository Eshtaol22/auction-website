import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLanguage } from '../buyer/LanguageContext';
import { useNotifications } from '../buyer//NotificationContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Gavel } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        showToast('Login successful!', 'success');
        navigate('/dashboard');
      } else {
        showToast('Invalid email or password. Try "password" as password.', 'error');
      }
    } catch (error) {
      showToast('Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo accounts info
  const demoAccounts = [
    { email: 'admin@auction.com', role: 'Admin' },
    { email: 'seller@test.com', role: 'Seller' },
    { email: 'buyer@test.com', role: 'Buyer' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Gavel className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">EthAuction</h1>
          <p className="text-gray-600 mt-2">{t('home.subtitle')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('auth.login_title')}</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : t('nav.login')}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.no_account')}{' '}
                <Link to="/register" className="text-blue-600 hover:underline">
                  {t('auth.register_here')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Demo Accounts</CardTitle>
            <CardDescription>
              Use these accounts to explore the platform (password: "password")
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <div
                  key={account.email}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('password');
                  }}
                >
                  <div>
                    <p className="text-sm font-medium">{account.email}</p>
                    <p className="text-xs text-gray-500">{account.role}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Use Account
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}