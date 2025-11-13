import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { useNotifications } from './NotificationContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Gavel } from 'lucide-react';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    role: 'buyer' as UserRole,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await register(formData);
      if (success) {
        showToast('Account created successfully!', 'success');
        navigate('/dashboard');
      } else {
        showToast('Registration failed. Please try again.', 'error');
      }
    } catch (error) {
      showToast('Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const ethiopianCities = [
    'Addis Ababa',
    'Dire Dawa',
    'Bahir Dar',
    'Gondar',
    'Hawassa',
    'Mekelle',
    'Jimma',
    'Adama',
    'Dessie',
    'Harar'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
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
            <CardTitle>{t('auth.register_title')}</CardTitle>
            <CardDescription>
              Create your account to start bidding or selling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('auth.first_name')}</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('auth.last_name')}</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('auth.phone')}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+251911123456"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">{t('auth.location')}</Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    {ethiopianCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">{t('auth.role')}</Label>
                <Select value={formData.role} onValueChange={(value: UserRole) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">{t('auth.role_buyer')}</SelectItem>
                    <SelectItem value="seller">{t('auth.role_seller')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : t('nav.register')}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.have_account')}{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  {t('auth.login_here')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}