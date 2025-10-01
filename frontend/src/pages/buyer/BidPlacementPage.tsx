import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { useNotifications } from './NotificationContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { mockAuctions } from './mockData';
import { 
  ArrowLeft,
  Gavel,
  Wallet,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  CreditCard
} from 'lucide-react';

export function BidPlacementPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { addNotification, showToast } = useNotifications();
  const navigate = useNavigate();
  
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'review' | 'confirm' | 'success'>('review');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const auction = mockAuctions.find(a => a.id === id);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Auction Not Found</h1>
          <Button asChild className="btn-primary-enhanced btn-hover-scale">
            <Link to="/">Back to Home</Link>
          </Button>
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

  const minBid = auction.currentBid + auction.bidIncrement;
  const isOwner = user?.id === auction.sellerId;
  const canBid = isAuthenticated && !isOwner && auction.status === 'active';
  const bidValue = parseFloat(bidAmount) || 0;
  const isValidBid = bidValue >= minBid;
  const hasSufficientFunds = user ? bidValue <= user.walletBalance : false;

  const handleReviewBid = () => {
    if (!canBid) {
      showToast('Cannot place bid on this auction', 'error');
      return;
    }

    if (!isValidBid) {
      showToast(`Minimum bid is ${formatCurrency(minBid)}`, 'error');
      return;
    }

    if (!hasSufficientFunds) {
      showToast('Insufficient wallet balance', 'error');
      return;
    }

    setStep('confirm');
  };

  const handleConfirmBid = async () => {
    if (!agreedToTerms) {
      showToast('Please agree to the terms and conditions', 'error');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful bid placement
      addNotification({
        type: 'bid_placed',
        message: `You placed a bid of ${formatCurrency(bidValue)} on "${auction.title}"`
      });
      
      setStep('success');
      showToast('Bid placed successfully!', 'success');
    } catch (error) {
      showToast('Failed to place bid. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToAuction = () => {
    navigate(`/auction/${id}`);
  };

  const commission = bidValue * 0.025; // 2.5% commission
  const totalCost = bidValue + commission;

  if (step === 'success') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Bid Placed Successfully!</CardTitle>
              <CardDescription>
                Your bid of {formatCurrency(bidValue)} has been placed on "{auction.title}"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">What happens next?</h3>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• You'll receive notifications if you're outbid</li>
                  <li>• Funds are held securely in escrow</li>
                  <li>• If you win, you'll be contacted for payment confirmation</li>
                  <li>• If outbid, funds are returned to your wallet immediately</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleBackToAuction} variant="outline" className="btn-outline-slate">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Auction
                </Button>
                <Button asChild className="btn-primary-enhanced btn-hover-scale">
                  <Link to="/dashboard">View My Bids</Link>
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
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/auction/${id}`} className="hover:text-blue-600">{auction.title}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Place Bid</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            onClick={handleBackToAuction} 
            variant="ghost" 
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Auction
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Place Your Bid</h1>
          <p className="text-gray-600">Review your bid details before confirming</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auction Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Auction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={auction.images[0]}
                      alt={auction.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">{auction.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{auction.description.substring(0, 100)}...</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <Badge variant={auction.status === 'active' ? 'default' : 'secondary'}>
                        {auction.status === 'active' ? 'Live Auction' : 'Ended'}
                      </Badge>
                      <span className="text-gray-500">Current bid: {formatCurrency(auction.currentBid)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bid Form */}
            {step === 'review' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gavel size={20} className="mr-2" />
                    Enter Your Bid
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Bid Amount (minimum: {formatCurrency(minBid)})
                    </label>
                    <Input
                      type="number"
                      placeholder={minBid.toString()}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={minBid}
                      className="text-lg"
                    />
                    {bidValue > 0 && !isValidBid && (
                      <p className="text-red-600 text-sm mt-1">
                        Bid must be at least {formatCurrency(minBid)}
                      </p>
                    )}
                    {bidValue > 0 && !hasSufficientFunds && (
                      <p className="text-red-600 text-sm mt-1">
                        Insufficient wallet balance. You need {formatCurrency(bidValue - (user?.walletBalance || 0))} more.
                      </p>
                    )}
                  </div>

                  {bidValue > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Bid Breakdown</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Your bid:</span>
                          <span>{formatCurrency(bidValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Platform fee (2.5%):</span>
                          <span>{formatCurrency(commission)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>Total to be charged:</span>
                          <span>{formatCurrency(totalCost)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleReviewBid}
                    disabled={!bidValue || !isValidBid || !hasSufficientFunds}
                    className="w-full btn-primary-enhanced btn-hover-scale"
                    size="lg"
                  >
                    Review Bid
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Confirmation */}
            {step === 'confirm' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-600">
                    <CheckCircle size={20} className="mr-2" />
                    Confirm Your Bid
                  </CardTitle>
                  <CardDescription>
                    Please review and confirm your bid details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Once confirmed, your bid cannot be cancelled. Funds will be held in escrow until the auction ends.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Final Bid Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Bid amount:</span>
                        <span className="font-medium">{formatCurrency(bidValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform fee:</span>
                        <span>{formatCurrency(commission)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium text-base">
                        <span>Total charge:</span>
                        <span>{formatCurrency(totalCost)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{' '}
                      <Link to="/terms" className="text-blue-600 hover:underline">
                        Terms and Conditions
                      </Link>{' '}
                      and understand that this bid is legally binding.
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      onClick={() => setStep('review')} 
                      variant="outline"
                      className="flex-1 btn-outline-slate"
                    >
                      Back to Edit
                    </Button>
                    <Button 
                      onClick={handleConfirmBid}
                      disabled={!agreedToTerms || isSubmitting}
                      className="flex-1 btn-primary-enhanced btn-hover-scale"
                    >
                      {isSubmitting ? 'Placing Bid...' : 'Confirm Bid'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet size={18} className="mr-2" />
                  Wallet Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {user ? formatCurrency(user.walletBalance) : formatCurrency(0)}
                </div>
                <p className="text-sm text-gray-600 mb-3">Available balance</p>
                {user && bidValue > user.walletBalance && (
                  <Button asChild variant="outline" size="sm" className="w-full btn-outline-blue">
                    <Link to={`/wallet/${id}`}>
                      <CreditCard size={16} className="mr-2" />
                      Add Funds
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield size={18} className="mr-2" />
                  Security & Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Funds held securely in escrow</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Instant refund if outbid</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Buyer protection guarantee</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>24/7 customer support</p>
                </div>
              </CardContent>
            </Card>

            {/* Auction Timer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock size={18} className="mr-2" />
                  Time Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    {/* This would be updated with real countdown */}
                    2d 14h 23m
                  </div>
                  <p className="text-sm text-gray-600">
                    Auction ends on {auction.endTime.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}