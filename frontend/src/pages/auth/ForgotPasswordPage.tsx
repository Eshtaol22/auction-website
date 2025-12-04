import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../buyer/LanguageContext';
import { useNotifications } from '../buyer/NotificationContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Gavel, ArrowLeft, Mail } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      showToast('OTP code sent to your email!', 'success');
      setIsLoading(false);
      // Navigate to OTP verification page with email
      navigate('/verify-otp', { state: { email, type: 'password-reset' } });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Gavel className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">EthAuction</h1>
          <p className="text-gray-600 mt-2">Reset your password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you an OTP code to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending OTP...' : 'Send OTP Code'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-blue-600 hover:underline"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> For security reasons, if an account with this email exists, 
              you will receive an OTP code within 5 minutes. The code will be valid for 10 minutes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
