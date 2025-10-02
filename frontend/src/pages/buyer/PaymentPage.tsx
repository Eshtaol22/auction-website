import React, { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from './LanguageContext';
import { useNotifications } from './NotificationContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { mockAuctions } from './mockData';
import { 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Building, 
  Shield, 
  CheckCircle,
  Clock,
  Info,
  ArrowLeft
} from 'lucide-react';

type PaymentMethod = 'wallet' | 'telebirr' | 'cbe_birr' | 'bank_transfer';

export function PaymentPage() {
  const { auctionId } = useParams<{ auctionId: string }>();
  const { user, isAuthenticated, updateUser } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wallet');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'method' | 'confirm' | 'processing' | 'success'>('method');

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const auction = mockAuctions.find(a => a.id === auctionId);
  
  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Auction Not Found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const paymentAmount = auction.currentBid;
  const platformFee = paymentAmount * 0.02; // 2% platform fee
  const totalAmount = paymentAmount + platformFee;

  const paymentMethods = [
    {
      id: 'wallet' as PaymentMethod,
      name: 'Wallet Balance',
      description: 'Pay using your wallet balance',
      icon: Wallet,
      available: user.walletBalance >= totalAmount,
      balance: user.walletBalance
    },
    {
      id: 'telebirr' as PaymentMethod,
      name: 'Telebirr',
      description: 'Pay with Telebirr mobile payment',
      icon: Smartphone,
      available: true,
    },
    {
      id: 'cbe_birr' as PaymentMethod,
      name: 'CBE Birr',
      description: 'Pay with Commercial Bank of Ethiopia Birr',
      icon: Building,
      available: true,
    },
    {
      id: 'bank_transfer' as PaymentMethod,
      name: 'Bank Transfer',
      description: 'Direct bank transfer payment',
      icon: CreditCard,
      available: true,
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update user wallet if paying with wallet
      if (selectedMethod === 'wallet') {
        updateUser({ walletBalance: user.walletBalance - totalAmount });
      }

      setPaymentStep('success');
      showToast('Payment successful!', 'success');
    } catch (error) {
      showToast('Payment failed. Please try again.', 'error');
      setPaymentStep('confirm');
    } finally {
      setIsProcessing(false);
    }
  };

  const getMethodIcon = (methodId: PaymentMethod) => {
    const method = paymentMethods.find(m => m.id === methodId);
    return method ? method.icon : CreditCard;
  };

  if (paymentStep === 'processing') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
              <p className="text-gray-600 mb-4">Please wait while we process your payment...</p>
              <Progress value={66} className="w-full" />
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your payment of {formatCurrency(totalAmount)} has been processed successfully.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span>Transaction ID:</span>
                  <span className="font-mono">TXN{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">{selectedMethod.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate(`/auction/${auctionId}`)}>
                  View Auction
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/auction/${auctionId}`)}
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Auction
          </Button>
          <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
          <p className="text-gray-600">Secure payment for your winning bid</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            {paymentStep === 'method' && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Payment Method</CardTitle>
                  <CardDescription>Choose how you'd like to pay for this auction</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedMethod} onValueChange={(value: PaymentMethod) => setSelectedMethod(value)}>
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-4">
                          <RadioGroupItem 
                            value={method.id} 
                            id={method.id}
                            disabled={!method.available}
                          />
                          <Label 
                            htmlFor={method.id} 
                            className={`flex-1 cursor-pointer ${!method.available ? 'opacity-50' : ''}`}
                          >
                            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                              <div className="flex items-center space-x-3">
                                <method.icon className="h-6 w-6 text-blue-600" />
                                <div>
                                  <p className="font-medium">{method.name}</p>
                                  <p className="text-sm text-gray-600">{method.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                {method.id === 'wallet' && (
                                  <div>
                                    <p className="text-sm text-gray-600">Available:</p>
                                    <p className={`font-medium ${method.available ? 'text-green-600' : 'text-red-600'}`}>
                                      {formatCurrency(method.balance || 0)}
                                    </p>
                                  </div>
                                )}
                                {!method.available && method.id === 'wallet' && (
                                  <Badge variant="destructive">Insufficient Balance</Badge>
                                )}
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  {/* Phone number input for mobile payments */}
                  {(selectedMethod === 'telebirr' || selectedMethod === 'cbe_birr') && (
                    <div className="mt-6 space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+251911123456"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  )}

                  <Button 
                    className="w-full mt-6" 
                    onClick={() => setPaymentStep('confirm')}
                    disabled={
                      !paymentMethods.find(m => m.id === selectedMethod)?.available ||
                      ((selectedMethod === 'telebirr' || selectedMethod === 'cbe_birr') && !phoneNumber)
                    }
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {paymentStep === 'confirm' && (
              <Card>
                <CardHeader>
                  <CardTitle>Confirm Payment</CardTitle>
                  <CardDescription>Review your payment details before confirming</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Selected Method */}
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    {React.createElement(getMethodIcon(selectedMethod), { className: "h-6 w-6 text-blue-600" })}
                    <div>
                      <p className="font-medium">
                        {paymentMethods.find(m => m.id === selectedMethod)?.name}
                      </p>
                      {(selectedMethod === 'telebirr' || selectedMethod === 'cbe_birr') && (
                        <p className="text-sm text-gray-600">{phoneNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Instructions */}
                  {selectedMethod === 'telebirr' && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium mb-2">Telebirr Payment Instructions</h4>
                      <ol className="text-sm space-y-1">
                        <li>1. You will receive a push notification on your phone</li>
                        <li>2. Open Telebirr app and confirm the payment</li>
                        <li>3. Enter your Telebirr PIN to complete</li>
                      </ol>
                    </div>
                  )}

                  {selectedMethod === 'cbe_birr' && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium mb-2">CBE Birr Payment Instructions</h4>
                      <ol className="text-sm space-y-1">
                        <li>1. Dial *847# or use CBE Birr app</li>
                        <li>2. Select "Pay Merchant"</li>
                        <li>3. Enter merchant code: 123456</li>
                        <li>4. Enter amount and your PIN</li>
                      </ol>
                    </div>
                  )}

                  {selectedMethod === 'bank_transfer' && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                      <div className="text-sm space-y-1">
                        <p>Account Name: EthAuction Platform</p>
                        <p>Account Number: 1234567890</p>
                        <p>Bank: Commercial Bank of Ethiopia</p>
                        <p>Reference: {auction.id.toUpperCase()}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setPaymentStep('method')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handlePayment} 
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? 'Processing...' : `Pay ${formatCurrency(totalAmount)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Auction Item */}
                <div className="flex space-x-3">
                  <img
                    src={auction.images[0]}
                    alt={auction.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-2">{auction.title}</h4>
                    <p className="text-sm text-gray-600">Winning Bid</p>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Winning bid</span>
                    <span>{formatCurrency(paymentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform fee (2%)</span>
                    <span>{formatCurrency(platformFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                <Separator />

                {/* Security Notice */}
                <div className="flex items-start space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-gray-600">Your payment is protected by bank-level security</p>
                  </div>
                </div>

                {/* Processing Time */}
                <div className="flex items-start space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Processing Time</p>
                    <p className="text-gray-600">Payment will be processed within 5-10 minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}