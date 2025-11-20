import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'bid_placed' | 'bid_outbid' | 'auction_won' | 'auction_ended' | 'payment_received';
  message: string;
  timestamp: Date;
  read: boolean;
  auctionId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  unreadCount: number;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Sample notifications for demo
    {
      id: '1',
      type: 'bid_placed',
      message: 'Your bid of ETB 25,000 was placed successfully on "Vintage Car Collection"',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      auctionId: '1'
    },
    {
      id: '2',
      type: 'bid_outbid',
      message: 'You have been outbid on "Ethiopian Coffee Set". Current bid: ETB 1,200',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      auctionId: '2'
    },
    {
      id: '3',
      type: 'auction_ended',
      message: 'Auction "Handmade Traditional Dress" has ended',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      auctionId: '3'
    }
  ]);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notificationData,
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    toast.info(notificationData.message);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      default:
        toast.info(message);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        unreadCount,
        showToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}