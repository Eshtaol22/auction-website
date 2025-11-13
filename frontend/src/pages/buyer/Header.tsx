import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from './LanguageContext';
import { useNotifications } from './NotificationContext';
import { Button } from '../ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { 
  Gavel, 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  Menu, 
  Home,
  LayoutDashboard,
  Plus,
  ShieldCheck,
  Globe
} from 'lucide-react';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 text-slate-600 hover:text-slate-900 font-medium">
        <Home size={18} />
        <span>{t('nav.home')}</span>
      </Link>
      
      {isAuthenticated && (
        <>
          <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 text-slate-600 hover:text-slate-900 font-medium">
            <LayoutDashboard size={18} />
            <span>{t('nav.dashboard')}</span>
          </Link>
          
          {user?.role === 'seller' && (
            <Link to="/create-auction" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 text-slate-600 hover:text-slate-900 font-medium">
              <Plus size={18} />
              <span>{t('nav.create_auction')}</span>
            </Link>
          )}
          
          {user?.role === 'admin' && (
            <Link to="/admin" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 text-slate-600 hover:text-slate-900 font-medium">
              <ShieldCheck size={18} />
              <span>{t('nav.admin')}</span>
            </Link>
          )}
        </>
      )}
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-elevation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Gavel className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                EthAuction
              </span>
              <div className="text-xs text-slate-500 -mt-1">Premium Marketplace</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <div className="flex items-center space-x-1 bg-slate-50 rounded-xl p-1">
              <NavLinks />
            </div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className="flex items-center space-x-2 bg-white border-slate-200 hover:bg-slate-50 rounded-xl px-3 py-2 shadow-sm"
            >
              <Globe size={16} />
              <span className="uppercase font-medium">{language}</span>
            </Button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="relative bg-white border-slate-200 hover:bg-slate-50 rounded-xl p-3 shadow-sm">
                      <Bell size={18} />
                      {unreadCount > 0 && (
                        <Badge 
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg animate-pulse"
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 max-w-sm">
                    <div className="p-3 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-800">Notifications</h4>
                        {unreadCount > 0 && (
                          <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                            {unreadCount} new
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500">
                          <Bell size={32} className="mx-auto mb-2 text-slate-300" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            className={`p-3 cursor-pointer transition-colors ${!notification.read ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-slate-50'}`}
                            onClick={() => {
                              markAsRead(notification.id);
                              // Navigate to relevant page based on notification type
                              if (notification.auctionId) {
                                navigate(`/auction/${notification.auctionId}`);
                              } else {
                                navigate('/dashboard');
                              }
                            }}
                          >
                            <div className="space-y-1 w-full">
                              <div className="flex items-start justify-between">
                                <p className="text-sm pr-2 flex-1">{notification.message}</p>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1"></div>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-500">
                                  {notification.timestamp.toLocaleString()}
                                </p>
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs bg-slate-100 text-slate-600 px-2 py-1"
                                >
                                  {notification.type.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-2 border-t border-slate-100">
                        <Button 
                          variant="ghost" 
                          className="w-full text-center text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                          onClick={() => navigate('/notifications')}
                        >
                          View all notifications
                        </Button>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-all duration-200">
                      <Avatar className="h-10 w-10 ring-2 ring-slate-100 shadow-md">
                        <AvatarImage src={user?.profilePicture} />
                        <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-white font-semibold">
                          {getInitials(user?.firstName || '', user?.lastName || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <p className="font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm">
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-slate-500">{user?.email}</p>
                      {user?.role === 'buyer' && (
                        <p className="text-indigo-600">
                          Wallet: {formatCurrency(user.walletBalance)}
                        </p>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User size={16} className="mr-2" />
                        {t('nav.profile')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings size={16} className="mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut size={16} className="mr-2" />
                      {t('nav.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="bg-white border-slate-200 hover:bg-slate-50 rounded-xl px-6 py-2 font-medium" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl px-6 py-2 font-medium shadow-lg" asChild>
                  <Link to="/register">{t('nav.register')}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-8">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}