import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Wallet, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Shield, 
  Clock,
  ArrowLeft,
  CheckCircle,
  Info,
  Plus,
  TrendingUp,
  History,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

export function WalletPage() {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [fundingAmount, setFundingAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('telebirr');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock wallet balance
  const walletBalance = 2500.00;
  const requiredAmount = auctionId ? 1000.00 : 0; // Mock required amount for auction

  const paymentMethods = [
    {
      id: 'telebirr',
      name: 'Telebirr',
      icon: Smartphone,
      description: 'Pay instantly with your Telebirr wallet',
      fee: '1.5%',
      time: 'Instant',
      color: 'indigo'
    },
    {
      id: 'cbebirr',
      name: 'CBE Birr',
      icon: Building2,
      description: 'Commercial Bank of Ethiopia mobile banking',
      fee: '2.0%',
      time: '2-5 minutes',
      color: 'blue'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: CreditCard,
      description: 'Direct bank transfer to EthAuction account',
      fee: '0.5%',
      time: '1-24 hours',
      color: 'slate'
    }
  ];

  const recentTransactions = [
    { id: 1, type: 'Funding', amount: 500, method: 'Telebirr', date: '2024-01-15', status: 'Completed' },
    { id: 2, type: 'Bid Payment', amount: -200, auction: 'Vintage Watch', date: '2024-01-14', status: 'Completed' },
    { id: 3, type: 'Funding', amount: 1000, method: 'CBE Birr', date: '2024-01-12', status: 'Completed' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleFunding = async () => {
    if (!fundingAmount || !phoneNumber || !pin) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(fundingAmount) < 10) {
      toast.error('Minimum funding amount is ETB 10');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      toast.success('Wallet funded successfully!');
      
      // If this was for an auction, redirect after funding
      if (auctionId) {
        setTimeout(() => {
          navigate(`/auction/${auctionId}`);
        }, 2000);
      }
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen modern-pattern flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white mb-6 mx-auto">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Payment Successful!</h2>
            <p className="text-slate-600 mb-6">
              {formatCurrency(parseFloat(fundingAmount))} has been added to your wallet successfully.
            </p>
            {auctionId && (
              <p className="text-sm text-slate-500 mb-6">
                Redirecting you back to the auction...
              </p>
            )}
            <Button onClick={() => setShowSuccess(false)} className="btn-primary-enhanced btn-hover-scale">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen modern-pattern py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" size="sm" asChild className="btn-outline-enhanced">
              <Link to={auctionId ? `/auction/${auctionId}` : '/dashboard'}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Wallet className="h-6 w-6 text-indigo-600" />
              <h1 className="text-3xl font-bold text-slate-900">EthAuction Wallet</h1>
            </div>
          </div>
          
          {auctionId && (
            <Alert className="border-indigo-200 bg-indigo-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-indigo-800">
                You need to fund your wallet to place bids on this auction. Minimum required: {formatCurrency(requiredAmount)}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Funding Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5" />
                  <span>Current Balance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {formatCurrency(walletBalance)}
                </div>
                <p className="text-slate-600">Available for bidding and purchases</p>
              </CardContent>
            </Card>

            {/* Funding Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add Funds to Wallet</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Input */}
                <div>
                  <Label htmlFor="amount">Funding Amount (ETB)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount (minimum 10 ETB)"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    className="mt-2"
                    min="10"
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    Minimum funding amount: ETB 10
                  </p>
                </div>

                <Separator />

                {/* Payment Methods */}
                <div>
                  <Label className="text-base font-semibold">Select Payment Method</Label>
                  <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="mt-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-start space-x-3 p-4 border rounded-xl hover:bg-slate-50 transition-colors duration-200">
                        <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-2 rounded-lg ${
                              method.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                              method.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              <method.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <Label htmlFor={method.id} className="font-semibold cursor-pointer">
                                {method.name}
                              </Label>
                              <p className="text-sm text-slate-600">{method.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Fee: {method.fee}
                            </Badge>
                            <div className="flex items-center space-x-1 text-slate-500">
                              <Clock className="h-3 w-3" />
                              <span>{method.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator />

                {/* Payment Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+251 9XX XXX XXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pin">PIN/Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="pin"
                        type={showPin ? "text" : "password"}
                        placeholder="Enter your payment PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                        onClick={() => setShowPin(!showPin)}
                      >
                        {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {fundingAmount && (
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-slate-900 mb-3">Transaction Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Funding Amount:</span>
                        <span className="font-medium">{formatCurrency(parseFloat(fundingAmount) || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Service Fee:</span>
                        <span className="font-medium">{formatCurrency((parseFloat(fundingAmount) || 0) * 0.015)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total to Pay:</span>
                        <span>{formatCurrency((parseFloat(fundingAmount) || 0) * 1.015)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  onClick={handleFunding}
                  disabled={isProcessing || !fundingAmount || !phoneNumber || !pin}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 btn-primary-enhanced btn-hover-scale"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Fund Wallet Securely
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm">End-to-end encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">PCI DSS compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Real-time processing</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>Recent Transactions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className={`h-4 w-4 ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`} />
                          <span className="text-sm font-medium">{transaction.type}</span>
                        </div>
                        <p className="text-xs text-slate-500">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}