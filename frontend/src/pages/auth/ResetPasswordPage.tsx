import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../buyer/LanguageContext';
import { useNotifications } from '../buyer/NotificationContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Gavel, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || '';
  const otpVerified = location.state?.otpVerified || false;

  useEffect(() => {
    if (!email || !otpVerified) {
      navigate('/forgot-password');
    }
  }, [email, otpVerified, navigate]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    };
  };

  const passwordValidation = validatePassword(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordValidation.isValid) {
      showToast('Password does not meet requirements', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      showToast('Password reset successfully!', 'success');
      setIsLoading(false);
      navigate('/login');
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
          <p className="text-gray-600 mt-2">Create a new password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              {newPassword && (
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
                  <div className="space-y-1">
                    <RequirementItem
                      met={passwordValidation.minLength}
                      text="At least 8 characters"
                    />
                    <RequirementItem
                      met={passwordValidation.hasUpperCase}
                      text="One uppercase letter"
                    />
                    <RequirementItem
                      met={passwordValidation.hasLowerCase}
                      text="One lowercase letter"
                    />
                    <RequirementItem
                      met={passwordValidation.hasNumber}
                      text="One number"
                    />
                    <RequirementItem
                      met={passwordValidation.hasSpecialChar}
                      text="One special character"
                    />
                  </div>
                </div>
              )}

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className={`text-sm ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                  {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
      <CheckCircle2 size={14} className={met ? 'fill-current' : ''} />
      <span>{text}</span>
    </div>
  );
}
