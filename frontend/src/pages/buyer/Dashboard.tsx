import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { AuctionCard } from './AuctionCard';
import { mockAuctions, Bid } from './mockData';
import { 
  PlusCircle, 
  Gavel, 
  Wallet, 
  TrendingUp, 
  Clock, 
  Trophy,
  Eye,
  Edit,
  Trash2,
  Star,
  Users
} from 'lucide-react';

export function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

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

  // Get user's auctions (if seller)
  const userAuctions = mockAuctions.filter(auction => auction.sellerId === user.id);
  const activeAuctions = userAuctions.filter(auction => auction.status === 'active');
  const endedAuctions = userAuctions.filter(auction => auction.status === 'ended');

  // Get user's bids (if buyer)
  const userBids: (Bid & { auction: typeof mockAuctions[0] })[] = [];
  mockAuctions.forEach(auction => {
    auction.bids.forEach(bid => {
      if (bid.bidderId === user.id) {
        userBids.push({ ...bid, auction });
      }
    });
  });

  const winningBids = userBids.filter(bid => bid.isWinning);
  const recentActivity = userBids.slice(0, 5);

  const BuyerDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(user.walletBalance)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userBids.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Winning Bids</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{winningBids.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(userBids.reduce((sum, bid) => sum + bid.amount, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Bids */}
        <Card>
          <CardHeader>
            <CardTitle>My Active Bids</CardTitle>
            <CardDescription>Auctions you're currently bidding on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {winningBids.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No active bids</p>
              ) : (
                winningBids.map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={bid.auction.images[0]}
                        alt={bid.auction.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{bid.auction.title}</h4>
                        <p className="text-sm text-gray-500">
                          Your bid: {formatCurrency(bid.amount)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={bid.isWinning ? 'default' : 'secondary'}>
                        {bid.isWinning ? 'Winning' : 'Outbid'}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild className="mt-1">
                        <Link to={`/auction/${bid.auction.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest bidding activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{activity.auction.title}</h4>
                      <p className="text-sm text-gray-500">
                        Bid {formatCurrency(activity.amount)} • {activity.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/auction/${activity.auction.id}`}>
                        <Eye size={16} />
                      </Link>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Auctions */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended For You</CardTitle>
          <CardDescription>Auctions you might be interested in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAuctions
              .filter(auction => auction.status === 'active')
              .slice(0, 3)
              .map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SellerDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAuctions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeAuctions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(userAuctions.reduce((sum, auction) => sum + auction.currentBid, 0))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.rating.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/create-auction">
                <PlusCircle size={16} className="mr-2" />
                Create New Auction
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Auctions</TabsTrigger>
          <TabsTrigger value="ended">Ended Auctions</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAuctions.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No active auctions</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/create-auction">Create Your First Auction</Link>
                </Button>
              </div>
            ) : (
              activeAuctions.map((auction) => (
                <div key={auction.id} className="relative">
                  <AuctionCard auction={auction} />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/80">
                      <Edit size={14} />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/80">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="ended" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {endedAuctions.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No ended auctions</p>
              </div>
            ) : (
              endedAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('dashboard.welcome')}, {user.firstName}!
        </h1>
        <p className="text-gray-600">
          Welcome to your {user.role} dashboard
        </p>
      </div>

      {user.role === 'buyer' ? <BuyerDashboard /> : <SellerDashboard />}
    </div>
  );
}