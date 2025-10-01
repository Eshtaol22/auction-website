import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { useNotifications } from './NotificationContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  User, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Shield, 
  Bell, 
  Wallet,
  CreditCard,
  Settings,
  Camera,
  Edit,
  Save
} from 'lucide-react';

export function UserProfile() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });
  const [notifications, setNotifications] = useState({
    emailBids: true,
    emailAuctions: true,
    smsBids: false,
    smsAuctions: false,
  });

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    showToast('Profile updated successfully', 'success');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: checked }));
    showToast('Notification preferences updated', 'success');
  };

  const kycDocuments = [
    { type: 'Government ID', status: 'verified', uploadDate: '2024-01-15' },
    { type: 'Business License', status: 'pending', uploadDate: '2024-01-20' },
  ];

  const ethiopianCities = [
    'Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Gondar', 'Hawassa', 
    'Mekelle', 'Jimma', 'Adama', 'Dessie', 'Harar'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback className="text-xl">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0"
                  >
                    <Camera size={14} />
                  </Button>
                </div>
                
                <h3 className="text-xl font-semibold mb-1">
                  {user.firstName} {user.lastName}
                </h3>
                <Badge variant={user.role === 'seller' ? 'default' : 'secondary'} className="mb-2">
                  {user.role}
                </Badge>
                
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{user.rating.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm ml-1">/ 5.0</span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <MapPin size={14} className="mr-2" />
                    {user.location}
                  </div>
                  <div className="flex items-center justify-center">
                    <Calendar size={14} className="mr-2" />
                    Member since Jan 2024
                  </div>
                  {user.isKYCVerified && (
                    <div className="flex items-center justify-center text-green-600">
                      <Shield size={14} className="mr-2" />
                      KYC Verified
                    </div>
                  )}
                </div>

                {user.role === 'buyer' && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium text-green-700">
                        {formatCurrency(user.walletBalance)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Wallet Balance</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="kyc">KYC</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                      </div>
                      <Button
                        variant={isEditing ? "default" : "outline"}
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      >
                        {isEditing ? <Save size={16} className="mr-2" /> : <Edit size={16} className="mr-2" />}
                        {isEditing ? 'Save' : 'Edit'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      {isEditing ? (
                        <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ethiopianCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input value={formData.location} disabled className="bg-gray-50" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">••••••••••••</span>
                        <Button variant="outline" size="sm">Change Password</Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS Authentication</p>
                          <p className="text-sm text-gray-600">Receive codes via SMS</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Authentication</p>
                          <p className="text-sm text-gray-600">Receive codes via email</p>
                        </div>
                        <Switch />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Account Activity</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Last login</span>
                          <span className="text-gray-600">Today at 2:30 PM</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Password changed</span>
                          <span className="text-gray-600">Never</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Account created</span>
                          <span className="text-gray-600">January 15, 2024</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Email Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Bid Updates</p>
                            <p className="text-sm text-gray-600">When you're outbid or win an auction</p>
                          </div>
                          <Switch
                            checked={notifications.emailBids}
                            onCheckedChange={(checked) => handleNotificationChange('emailBids', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Auction Updates</p>
                            <p className="text-sm text-gray-600">New auctions and endings</p>
                          </div>
                          <Switch
                            checked={notifications.emailAuctions}
                            onCheckedChange={(checked) => handleNotificationChange('emailAuctions', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">SMS Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Bid Updates</p>
                            <p className="text-sm text-gray-600">Important bid notifications via SMS</p>
                          </div>
                          <Switch
                            checked={notifications.smsBids}
                            onCheckedChange={(checked) => handleNotificationChange('smsBids', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Auction Endings</p>
                            <p className="text-sm text-gray-600">When auctions you're watching end</p>
                          </div>
                          <Switch
                            checked={notifications.smsAuctions}
                            onCheckedChange={(checked) => handleNotificationChange('smsAuctions', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="kyc" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>KYC Verification</CardTitle>
                    <CardDescription>Verify your identity to access all platform features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <Shield className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-green-800">KYC Status: Verified</h4>
                          <p className="text-sm text-green-600">Your account is fully verified</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Verified
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Submitted Documents</h4>
                      <div className="space-y-3">
                        {kycDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{doc.type}</p>
                              <p className="text-sm text-gray-600">
                                Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={doc.status === 'verified' ? 'default' : 'secondary'}>
                              {doc.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Benefits of KYC Verification</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Higher bidding limits</li>
                        <li>• Access to premium auctions</li>
                        <li>• Faster payment processing</li>
                        <li>• Enhanced account security</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}