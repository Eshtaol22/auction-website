import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from './LanguageContext';
import { useNotifications } from './NotificationContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { mockAuctions } from './mockData';
import { 
  Timer, 
  Users, 
  Star, 
  MapPin, 
  Heart,
  Share2,
  Flag,
  Gavel,
  Clock,
  TrendingUp,
  Shield,
  Truck,
  CreditCard
} from 'lucide-react';

export function AuctionDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { addNotification, showToast } = useNotifications();
  const navigate = useNavigate();
  

  const [timeLeft, setTimeLeft] = useState('');
  const [isWatching, setIsWatching] = useState(false);

  const auction = mockAuctions.find(a => a.id === id);

  useEffect(() => {
    if (!auction) return;

    const updateTimer = () => {
      const now = new Date();
      const endTime = new Date(auction.endTime);
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Auction ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [auction]);

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
  const userBid = auction.bids.find(bid => bid.bidderId === user?.id);

  const handlePlaceBid = () => {
    if (!isAuthenticated) {
      showToast('Please login to place a bid', 'error');
      navigate('/login');
      return;
    }

    // Navigate to bid placement page
    navigate(`/bid/${auction.id}`);
  };

  const handleWatchlist = () => {
    setIsWatching(!isWatching);
    showToast(
      isWatching ? 'Removed from watchlist' : 'Added to watchlist',
      'success'
    );
  };

  const getProgressPercentage = () => {
    if (auction.reservePrice) {
      return Math.min((auction.currentBid / auction.reservePrice) * 100, 100);
    }
    return (auction.currentBid / auction.startingBid) * 100;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{auction.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <img
                  src={auction.images[0]}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {/* Auction Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{auction.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <Badge variant={auction.status === 'active' ? 'default' : 'secondary'}>
                      {auction.status === 'active' ? 'Live Auction' : 'Ended'}
                    </Badge>
                    {auction.type === 'flash' && (
                      <Badge variant="secondary">Flash Sale</Badge>
                    )}
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {auction.location}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWatchlist}
                    className={`btn-outline-slate ${isWatching ? 'border-red-400 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500' : ''}`}
                  >
                    <Heart size={16} className={isWatching ? 'fill-current' : ''} />
                  </Button>
                  <Button variant="outline" size="sm" className="btn-outline-blue">
                    <Share2 size={16} />
                  </Button>
                  <Button variant="outline" size="sm" className="btn-outline-slate">
                    <Flag size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{auction.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{auction.category}</Badge>
                {auction.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Seller Info */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {auction.sellerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{auction.sellerName}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-400 fill-current mr-1" />
                      {auction.sellerRating} rating
                    </div>
                    <div className="flex items-center">
                      <Shield size={14} className="text-green-500 mr-1" />
                      KYC Verified
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="btn-outline-slate">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bidding History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gavel size={20} className="mr-2" />
                Bidding History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {auction.bids.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No bids yet</p>
              ) : (
                <div className="space-y-3">
                  {auction.bids
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .map((bid, index) => (
                      <div
                        key={bid.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          index === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {bid.bidderName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{bid.bidderName}</p>
                            <p className="text-xs text-gray-500">
                              {bid.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${index === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {formatCurrency(bid.amount)}
                          </p>
                          {index === 0 && (
                            <Badge variant="default" className="text-xs">Highest</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Bidding Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Current Bid
                {auction.status === 'active' && (
                  <div className="flex items-center text-red-600">
                    <Timer size={16} className="mr-1" />
                    <span className="text-sm font-mono">{timeLeft}</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(auction.currentBid)}
                </div>
                {auction.reservePrice && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      Reserve: {formatCurrency(auction.reservePrice)}
                    </div>
                    <Progress value={getProgressPercentage()} className="h-2" />
                    <div className="text-xs text-gray-500">
                      {getProgressPercentage().toFixed(0)}% of reserve met
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Users size={14} className="mr-1" />
                  {auction.totalBidders} bidders
                </div>
                <div>{auction.bids.length} bids</div>
              </div>

              {userBid && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Your bid: {formatCurrency(userBid.amount)}
                  </p>
                  <Badge variant={userBid.isWinning ? 'default' : 'secondary'} className="text-xs">
                    {userBid.isWinning ? 'Winning' : 'Outbid'}
                  </Badge>
                </div>
              )}

              {canBid ? (
                <div className="space-y-3">
                  <div className="text-center mb-3">
                    <p className="text-sm text-gray-600 mb-1">
                      Minimum bid: {formatCurrency(minBid)}
                    </p>
                  </div>
                  <Button onClick={handlePlaceBid} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 btn-primary-enhanced btn-hover-scale" size="lg">
                    <Gavel size={18} className="mr-2" />
                    {t('common.place_bid')}
                  </Button>
                  {user && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 text-center">
                        Wallet balance: {formatCurrency(user.walletBalance)}
                      </p>
                      {user.walletBalance < minBid && (
                        <Button variant="outline" size="sm" className="w-full btn-outline-indigo" asChild>
                          <Link to={`/wallet/${auction.id}`}>
                            Add Funds to Wallet
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ) : !isAuthenticated ? (
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 btn-primary-enhanced btn-hover-scale" asChild>
                    <Link to="/login">Login to Bid</Link>
                  </Button>
                </div>
              ) : isOwner ? (
                <div className="text-center text-gray-500 text-sm">
                  You cannot bid on your own auction
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  Auction has ended
                </div>
              )}
            </CardContent>
          </Card>

          {/* Auction Details */}
          <Card>
            <CardHeader>
              <CardTitle>Auction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Starting bid:</span>
                <span className="font-medium">{formatCurrency(auction.startingBid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bid increment:</span>
                <span className="font-medium">{formatCurrency(auction.bidIncrement)}</span>
              </div>
              {auction.reservePrice && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Reserve price:</span>
                  <span className="font-medium">{formatCurrency(auction.reservePrice)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-600">Start time:</span>
                <span className="font-medium">{auction.startTime.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End time:</span>
                <span className="font-medium">{auction.endTime.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{auction.location}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment & Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle>Payment & Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <CreditCard size={16} className="text-blue-600" />
                <div>
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-xs text-gray-500">Telebirr, CBE Birr, Bank Transfer</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Truck size={16} className="text-green-600" />
                <div>
                  <p className="font-medium">Delivery Available</p>
                  <p className="text-xs text-gray-500">Nationwide shipping options</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield size={16} className="text-purple-600" />
                <div>
                  <p className="font-medium">Buyer Protection</p>
                  <p className="text-xs text-gray-500">Secure transactions guaranteed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}