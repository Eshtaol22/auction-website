import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Shield, 
  Clock, 
  Users, 
  Gavel, 
  CreditCard, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Globe,
  Lock,
  TrendingUp,
  Heart,
  Award
} from 'lucide-react';

export function LearnMorePage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Advanced security measures protect your transactions and personal information with bank-level encryption.',
      color: 'slate'
    },
    {
      icon: Clock,
      title: 'Real-time Bidding',
      description: 'Experience live auctions with instant bid updates and countdown timers for exciting bidding experiences.',
      color: 'indigo'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of verified buyers and sellers in Ethiopia\'s most trusted auction marketplace.',
      color: 'blue'
    },
    {
      icon: CreditCard,
      title: 'Local Payment Methods',
      description: 'Pay securely using Telebirr, CBE Birr, and other popular Ethiopian payment methods.',
      color: 'purple'
    }
  ];

  const benefits = [
    'KYC verified users for security',
    'Commission rates as low as 2%',
    'Multiple auction formats',
    'Mobile-first responsive design',
    '24/7 customer support',
    'Dispute resolution system'
  ];

  const auctionTypes = [
    {
      type: 'Standard Auctions',
      description: 'Traditional bidding format where highest bid wins',
      duration: '3-7 days',
      icon: Gavel,
      features: ['Open bidding', 'Extended time', 'Reserve price option']
    },
    {
      type: 'Flash Auctions',
      description: 'Quick auctions for time-sensitive deals',
      duration: '1-24 hours',
      icon: Zap,
      features: ['Fast bidding', 'No reserves', 'Instant results']
    },
    {
      type: 'Sealed Bids',
      description: 'Private bidding for exclusive items',
      duration: '2-5 days',
      icon: Lock,
      features: ['Hidden bids', 'Privacy protection', 'Strategic bidding']
    }
  ];

  return (
    <div className="min-h-screen modern-pattern">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-modern"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Globe className="h-4 w-4 mr-2" />
              Learn About EthAuction
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              How EthAuction Works
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed">
              Discover how Ethiopia's premier auction platform connects buyers and sellers through secure, transparent, and exciting online auctions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-4 rounded-xl shadow-elevation font-semibold btn-hover-scale" asChild>
                <Link to="/register">Get Started Today</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-xl font-semibold backdrop-blur-sm btn-outline-enhanced" asChild>
                <Link to="/dashboard">View Live Auctions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose EthAuction?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We've built the most comprehensive auction platform specifically for the Ethiopian market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative group cursor-pointer transition-all duration-300 hover:shadow-ethereal hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 mx-auto transition-transform duration-300 group-hover:scale-110 ${
                    feature.color === 'slate' ? 'bg-gradient-to-br from-slate-600 to-slate-700' :
                    feature.color === 'indigo' ? 'bg-gradient-to-br from-indigo-600 to-indigo-700' :
                    feature.color === 'blue' ? 'bg-gradient-to-br from-blue-600 to-blue-700' :
                    'bg-gradient-to-br from-purple-600 to-purple-700'
                  } text-white`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">{feature.description}</p>
                </CardContent>
                
                <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl ${
                  feature.color === 'slate' ? 'bg-gradient-to-r from-slate-400 to-slate-500' :
                  feature.color === 'indigo' ? 'bg-gradient-to-r from-indigo-400 to-indigo-500' :
                  feature.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                  'bg-gradient-to-r from-purple-400 to-purple-500'
                }`}></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Simple steps to start buying or selling</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-600 to-indigo-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Create Account</h3>
              <p className="text-slate-600 mb-6">Sign up with your phone number and complete KYC verification for secure trading.</p>
              <Button variant="outline" className="btn-outline-enhanced" asChild>
                <Link to="/register">Register Now</Link>
              </Button>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Browse & Bid</h3>
              <p className="text-slate-600 mb-6">Explore thousands of items and place bids on auctions that interest you.</p>
              <Button variant="outline" className="btn-outline-enhanced" asChild>
                <Link to="/">Browse Auctions</Link>
              </Button>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Win & Pay</h3>
              <p className="text-slate-600 mb-6">Win auctions and pay securely using local payment methods like Telebirr.</p>
              <Button variant="outline" className="btn-outline-enhanced" asChild>
                <Link to="/payment/demo">Payment Options</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Auction Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Auction Formats</h2>
            <p className="text-xl text-slate-600">Choose the right auction type for your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {auctionTypes.map((auction, index) => (
              <Card key={index} className="relative group cursor-pointer transition-all duration-300 hover:shadow-ethereal hover:-translate-y-2">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <auction.icon className="h-8 w-8 text-indigo-600" />
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                      {auction.duration}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">{auction.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-6">{auction.description}</p>
                  <div className="space-y-2">
                    {auction.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-indigo-500" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Platform Benefits</h2>
              <p className="text-xl text-slate-600 mb-8">
                EthAuction offers comprehensive features designed specifically for Ethiopian users
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-indigo-500 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="mt-8 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 btn-primary-enhanced btn-hover-scale" asChild>
                <Link to="/register">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6">
                <TrendingUp className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900">500+</div>
                <div className="text-slate-600">Active Users</div>
              </Card>
              
              <Card className="text-center p-6">
                <Gavel className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900">1,200+</div>
                <div className="text-slate-600">Completed Auctions</div>
              </Card>
              
              <Card className="text-center p-6">
                <Star className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900">4.8/5</div>
                <div className="text-slate-600">User Rating</div>
              </Card>
              
              <Card className="text-center p-6">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-slate-900">98%</div>
                <div className="text-slate-600">Satisfaction Rate</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-professional"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Award className="h-16 w-16 mx-auto mb-6 text-indigo-300" />
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            Ready to Join Ethiopia's Premier Auction Platform?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Start buying and selling today with thousands of verified users across Ethiopia
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-10 py-4 rounded-xl shadow-elevation font-semibold text-lg btn-hover-scale" asChild>
              <Link to="/register">Create Free Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 px-10 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm btn-outline-enhanced" asChild>
              <Link to="/dashboard">Browse Auctions</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}