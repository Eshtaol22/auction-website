import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// FIX: Using type-only import for Auction
import { type Auction } from './mockData'; 
import { Timer, Users, Star, MapPin, Gavel } from 'lucide-react';

interface AuctionCardProps {
  auction: Auction;
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const { t } = useLanguage();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTimeLeft = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return t('common.ended');
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (status: string, type: string) => {
    if (status === 'ended') return 'destructive';
    if (type === 'flash') return 'secondary';
    return 'default';
  };

  const getStatusText = (status: string, type: string) => {
    if (status === 'ended') return 'Ended';
    if (status === 'upcoming') return 'Upcoming';
    if (type === 'flash') return 'Flash Sale';
    if (type === 'sealed') return 'Sealed Bids';
    return 'Live';
  };
  
  // Helper to determine the status badge background color class
  const getStatusBgClass = (status: string, type: string) => {
    if (status === 'ended') return 'bg-destructive/90 text-destructive-foreground';
    if (type === 'flash') return 'bg-secondary/90 text-secondary-foreground';
    return 'bg-primary/90 text-primary-foreground';
  }

  return (
    <div className="group cursor-pointer">
      {/* Applying modern shadows defined in base layer */}
      <div className="relative overflow-hidden rounded-2xl bg-card shadow-elevation hover:shadow-ethereal transition-all duration-500 group-hover:-translate-y-2">
        <div className="aspect-video bg-gradient-to-br from-muted/50 to-background relative overflow-hidden">
          <img
            src={auction.images[0]}
            alt={auction.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <Badge 
            variant="default" // Use 'default' or a standard variant, then override colors below
            className={`absolute top-3 left-3 px-3 py-1 font-semibold shadow-sm ${getStatusBgClass(auction.status, auction.type)}`}
          >
            {getStatusText(auction.status, auction.type)}
          </Badge>
          
          {auction.status === 'active' && (
            <div className="absolute top-3 right-3 bg-primary/80 backdrop-blur-sm text-primary-foreground px-3 py-2 rounded-xl text-sm flex items-center font-medium">
              <Timer size={14} className="mr-2 text-accent" />
              {getTimeLeft(auction.endTime)}
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
              {auction.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 leading-relaxed">{auction.description}</p>
          </div>

          {/* Seller info - using theme-aware colors */}
          <div className="flex items-center space-x-3 mb-4 p-3 bg-muted rounded-xl">
            <Avatar className="h-8 w-8 ring-2 ring-card shadow-sm">
              {/* Avatar fallback using primary color gradient */}
              <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                {auction.sellerName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-foreground">{auction.sellerName}</span>
                <div className="flex items-center bg-secondary/10 px-2 py-1 rounded-full">
                  <Star size={12} className="text-secondary fill-current mr-1" />
                  <span className="text-xs font-medium text-secondary-foreground/80">{auction.sellerRating}</span>
                </div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin size={12} className="mr-1" />
                {auction.location}
              </div>
            </div>
          </div>

          {/* Bidding info */}
          <div className="space-y-3 mb-4">
            {/* Bid box using themed backgrounds */}
            <div className="bg-gradient-to-r from-muted/50 to-accent/5 p-4 rounded-xl border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground/80">{t('common.current_bid')}</span>
                <span className="text-2xl font-bold text-secondary">
                  {formatCurrency(auction.currentBid)}
                </span>
              </div>
              
              {auction.status === 'upcoming' && (
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">{t('common.starting_bid')}</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(auction.startingBid)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-muted-foreground">
                  <Users size={14} className="mr-1 text-secondary" />
                  <span className="font-medium">{auction.totalBidders}</span>
                  <span className="ml-1">{auction.totalBidders === 1 ? 'bidder' : 'bidders'}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Gavel size={14} className="mr-1 text-muted-foreground" />
                  <span className="font-medium">{auction.bids.length} bids</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline" className="bg-card border-border text-foreground/80 hover:bg-muted/50">
              {auction.category}
            </Badge>
            {auction.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-0">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl border-2 hover:bg-muted/50 font-semibold btn-outline-enhanced" 
              asChild
            >
              <Link to={`/auction/${auction.id}`}>{t('common.view')}</Link>
            </Button>
            {auction.status === 'active' && (
              <Button 
                className="flex-1 rounded-xl bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 font-semibold shadow-lg btn-primary-enhanced btn-hover-scale" 
                asChild
              >
                <Link to={`/auction/${auction.id}`}>{t('common.bid_now')}</Link>
              </Button>
            )}
          </div>
        </div>
        
        {/* Decorative gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-secondary/50 via-secondary to-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl scale-105"></div>
      </div>
    </div>
  );
}