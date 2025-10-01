import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from './NotificationContext';
import { useLanguage } from './LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bell, 
  Check, 
  Trash2, 
  ArrowLeft, 
  Filter,
  Clock,
  Gavel,
  DollarSign,
  Trophy,
  AlertTriangle
} from 'lucide-react';

type NotificationFilter = 'all' | 'unread' | 'read';

const notificationIcons = {
  bid_placed: Gavel,
  bid_outbid: AlertTriangle,
  auction_won: Trophy,
  auction_ended: Clock,
  payment_received: DollarSign,
};

const notificationColors = {
  bid_placed: 'bg-blue-50 border-blue-200 text-blue-800',
  bid_outbid: 'bg-amber-50 border-amber-200 text-amber-800',
  auction_won: 'bg-green-50 border-green-200 text-green-800',
  auction_ended: 'bg-slate-50 border-slate-200 text-slate-800',
  payment_received: 'bg-emerald-50 border-emerald-200 text-emerald-800',
};

export function NotificationsPage() {
  const { notifications, markAsRead, addNotification } = useNotifications();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate to relevant page
    if (notification.auctionId) {
      navigate(`/auction/${notification.auctionId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const markAllAsRead = () => {
    notifications
      .filter(n => !n.read)
      .forEach(n => markAsRead(n.id));
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
                <p className="text-slate-600 mt-1">
                  Stay updated with your auction activities
                </p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className="flex items-center space-x-2"
              >
                <Check size={16} />
                <span>Mark all as read</span>
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Bell size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{notifications.length}</p>
                    <p className="text-sm text-slate-600">Total Notifications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <AlertTriangle size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{unreadCount}</p>
                    <p className="text-sm text-slate-600">Unread</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Check size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{readCount}</p>
                    <p className="text-sm text-slate-600">Read</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(value) => setFilter(value as NotificationFilter)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <span>All</span>
              <Badge variant="secondary" className="text-xs">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center space-x-2">
              <span>Unread</span>
              {unreadCount > 0 && (
                <Badge className="text-xs bg-blue-500">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="read" className="flex items-center space-x-2">
              <span>Read</span>
              <Badge variant="secondary" className="text-xs">
                {readCount}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bell size={48} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">
                      No {filter === 'all' ? '' : filter} notifications
                    </h3>
                    <p className="text-slate-500">
                      {filter === 'all' 
                        ? "You don't have any notifications yet." 
                        : `You don't have any ${filter} notifications.`}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => {
                  const IconComponent = notificationIcons[notification.type];
                  const colorClass = notificationColors[notification.type];
                  
                  return (
                    <Card 
                      key={notification.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        !notification.read ? 'ring-2 ring-blue-100 bg-blue-50/30' : 'hover:bg-slate-50'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${colorClass}`}>
                            <IconComponent size={20} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-sm font-medium text-slate-900 pr-4">
                                {notification.message}
                              </p>
                              {!notification.read && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs bg-slate-100 text-slate-600"
                                >
                                  {notification.type.replace('_', ' ')}
                                </Badge>
                                <span className="text-xs text-slate-500">
                                  {formatRelativeTime(notification.timestamp)}
                                </span>
                              </div>
                              
                              <div className="text-xs text-slate-400">
                                {notification.timestamp.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}