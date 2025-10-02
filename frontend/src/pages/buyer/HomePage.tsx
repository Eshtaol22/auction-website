import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AuctionCard } from './AuctionCard';
import { mockAuctions, categories } from './mockData';
import { Search, Timer, Users, Gavel, Star, Filter, Palette, Watch, Car, Laptop, Shirt, Home, Zap, TrendingUp, Clock, Target, Bell } from 'lucide-react';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();

  const featuredAuctions = mockAuctions
    .filter(auction => auction.status === 'active')
    .slice(0, 6);

  const upcomingAuctions = mockAuctions
    .filter(auction => auction.status === 'upcoming')
    .slice(0, 3);

  const filteredAuctions = mockAuctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || auction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const stats = [
    { label: 'Active Auctions', value: mockAuctions.filter(a => a.status === 'active').length, icon: Gavel },
    { label: 'Total Bidders', value: '500+', icon: Users },
    { label: 'Successful Sales', value: '1,200+', icon: Star },
    { label: 'Categories', value: categories.length, icon: Filter },
  ];

  return (
    <div className="min-h-screen modern-pattern">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-modern"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Zap className="h-4 w-4 mr-2" />
              Ethiopia's Premier Auction Platform
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed">
              {t('home.subtitle')}
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 z-10" />
                <Input
                  type="text"
                  placeholder={t('home.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-6 h-16 text-lg bg-white/95 backdrop-blur-sm text-gray-900 border-0 rounded-2xl shadow-ethereal group-hover:bg-white transition-all duration-300 placeholder:text-gray-500"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-slate-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl shadow-elevation font-semibold btn-hover-scale" asChild>
                  <Link to="/register">{t('nav.register')}</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl font-semibold backdrop-blur-sm btn-outline-enhanced" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Statistics</h2>
            <p className="text-gray-600">Join thousands of users in Ethiopia's fastest-growing marketplace</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="relative group">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-elevation hover:shadow-ethereal transition-all duration-300 group-hover:-translate-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-indigo-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
                
                {/* Decorative gradient border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-slate-400 via-indigo-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl scale-105"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse Categories</h2>
            <p className="text-xl text-gray-600">Discover amazing items across diverse categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`group cursor-pointer transition-all duration-300 ${
                  selectedCategory === category.name ? 'scale-105' : 'hover:scale-105'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category.name ? '' : category.name)}
              >
                <div className={`relative p-6 rounded-2xl text-center transition-all duration-300 ${
                  selectedCategory === category.name 
                    ? 'bg-gradient-to-br from-slate-600 to-indigo-600 text-white shadow-ethereal' 
                    : 'bg-white hover:shadow-elevation group-hover:bg-gradient-to-br group-hover:from-slate-50 group-hover:to-indigo-50'
                }`}>
                  <div className={`mb-3 transition-transform duration-300 group-hover:scale-110 ${
                    selectedCategory === category.name ? 'drop-shadow-lg' : ''
                  }`}>
                    {category.icon === 'Palette' && <Palette className="h-8 w-8 mx-auto" />}
                    {category.icon === 'Watch' && <Watch className="h-8 w-8 mx-auto" />}
                    {category.icon === 'Car' && <Car className="h-8 w-8 mx-auto" />}
                    {category.icon === 'Laptop' && <Laptop className="h-8 w-8 mx-auto" />}
                    {category.icon === 'Shirt' && <Shirt className="h-8 w-8 mx-auto" />}
                    {category.icon === 'Home' && <Home className="h-8 w-8 mx-auto" />}
                  </div>
                  <h3 className={`font-semibold text-sm transition-colors duration-300 ${
                    selectedCategory === category.name ? 'text-white' : 'text-gray-900 group-hover:text-slate-700'
                  }`}>
                    {language === 'am' ? category.nameAm : category.name}
                  </h3>
                  
                  {/* Selection indicator */}
                  {selectedCategory === category.name && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                
                {/* Animated border on hover */}
                <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 -z-10 blur-xl ${
                  selectedCategory === category.name 
                    ? 'bg-gradient-to-r from-slate-400 to-indigo-400 opacity-30' 
                    : 'bg-gradient-to-r from-slate-400 to-indigo-400 opacity-0 group-hover:opacity-20'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-100 to-indigo-100 rounded-full text-slate-800 font-medium mb-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending Now
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('home.featured_auctions')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Don't miss out on these exciting auctions ending soon</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {(searchQuery || selectedCategory ? filteredAuctions : featuredAuctions).map((auction, index) => (
              <div 
                key={auction.id} 
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <AuctionCard auction={auction} />
              </div>
            ))}
          </div>

          {(searchQuery || selectedCategory) && filteredAuctions.length === 0 && (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No auctions found</h3>
              <p className="text-gray-500 text-lg">Try adjusting your search criteria or browse different categories.</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Auctions */}
      {!searchQuery && !selectedCategory && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-100 to-indigo-100 rounded-full text-slate-800 font-medium mb-4">
                <Clock className="h-4 w-4 mr-2" />
                Coming Soon
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Auctions</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get ready for these exciting upcoming auctions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingAuctions.map((auction, index) => (
                <div 
                  key={auction.id} 
                  className="group cursor-pointer opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white shadow-elevation hover:shadow-ethereal transition-all duration-500 group-hover:-translate-y-2">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <img
                        src={auction.images[0]}
                        alt={auction.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                      
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-3 py-1 font-semibold shadow-sm">
                        Upcoming
                      </Badge>
                      
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-xl text-sm flex items-center font-medium">
                        <Timer size={14} className="mr-2 text-indigo-500" />
                        Starts in {getTimeLeft(auction.startTime)}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-slate-700 transition-colors duration-300">{auction.title}</h3>
                      
                      <div className="bg-gradient-to-r from-slate-50 to-indigo-50 p-4 rounded-xl border border-slate-100 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Starting Bid</span>
                          <span className="text-2xl font-bold text-indigo-600">
                            {formatCurrency(auction.startingBid)}
                          </span>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full rounded-xl border-2 hover:bg-slate-50 hover:border-slate-300 font-semibold transition-all duration-200 btn-outline-enhanced" asChild>
                        <Link to={`/auction/${auction.id}`}>View Details</Link>
                      </Button>
                    </div>
                    
                    {/* Decorative gradient border */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-slate-400 via-indigo-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl scale-105"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-professional"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Decorative patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-16 left-1/4 w-16 h-16 border-2 border-indigo-300 rounded-full"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center px-6 py-3 bg-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <Target className="h-4 w-4 mr-2" />
            Join the Revolution
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            Ready to Start Bidding?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied buyers and sellers on Ethiopia's premier auction platform
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 rounded-xl shadow-elevation font-semibold text-lg btn-hover-scale" asChild>
              <Link to="/register">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm btn-outline-enhanced" asChild>
              <Link to="/learn-more">Learn More</Link>
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 flex items-center justify-center space-x-8 opacity-80">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-indigo-300 fill-current" />
              </div>
              <span className="text-sm">Trusted Platform</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-sm">500+ Active Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Gavel className="w-4 h-4" />
              </div>
              <span className="text-sm">Daily Auctions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Test Guide */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Test Notifications & Features</h3>
            <p className="text-gray-600 mb-6">
              To test the notification system and other features, login with any of these demo accounts:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">Admin Account</p>
                <p className="text-xs text-gray-600">admin@auction.com</p>
                <p className="text-xs text-blue-600">Password: password</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">Seller Account</p>
                <p className="text-xs text-gray-600">seller@test.com</p>
                <p className="text-xs text-blue-600">Password: password</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">Buyer Account</p>
                <p className="text-xs text-gray-600">buyer@test.com</p>
                <p className="text-xs text-blue-600">Password: password</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              After logging in, click the bell icon (🔔) in the header to see notifications and test the dropdown functionality.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}