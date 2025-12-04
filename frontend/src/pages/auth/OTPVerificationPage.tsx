import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../buyer/LanguageContext';
import { useNotifications } from '../buyer/NotificationContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Gavel, ArrowLeft } from 'lucide-react';

export function OTPVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || '';
  const type = location.state?.type || 'password-reset';

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      showToast('Please enter complete OTP code', 'error');
      return;
    }

    if (timeLeft === 0) {
      showToast('OTP code has expired', 'error');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Demo: accept '123456' as valid OTP
      if (otpCode === '123456') {
        showToast('OTP verified successfully!', 'success');
        setIsLoading(false);
        navigate('/reset-password', { state: { email, otpVerified: true } });
      } else {
        showToast('Invalid OTP code. Try 123456 for demo', 'error');
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']);
    setTimeLeft(600);
    showToast('New OTP code sent to your email!', 'success');
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
          <p className="text-gray-600 mt-2">Verify your identity</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter OTP Code</CardTitle>
            <CardDescription>
              We've sent a 6-digit code to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-semibold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Timer */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-sm text-gray-600">
                    Code expires in{' '}
                    <span className="font-semibold text-blue-600">
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-red-600 font-semibold">
                    OTP code has expired
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || timeLeft === 0}>
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendOTP}
                  className="text-blue-600 hover:underline font-medium"
                  type="button"
                >
                  Resend OTP
                </button>
              </p>
              
              <button
                onClick={() => navigate('/forgot-password')}
                className="inline-flex items-center text-sm text-blue-600 hover:underline"
                type="button"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Try different email
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800">
              <strong>Demo Mode:</strong> Use <strong>123456</strong> as the OTP code for testing
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
