import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profilePicture?: string;
  rating: number;
  location: string;
  phone: string;
  isKYCVerified: boolean;
  walletBalance: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone: string;
  location: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@auction.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    rating: 5.0,
    location: 'Addis Ababa',
    phone: '+251911123456',
    isKYCVerified: true,
    walletBalance: 0
  },
  {
    id: '2',
    email: 'seller@test.com',
    firstName: 'John',
    lastName: 'Seller',
    role: 'seller',
    rating: 4.8,
    location: 'Addis Ababa',
    phone: '+251911234567',
    isKYCVerified: true,
    walletBalance: 15000
  },
  {
    id: '3',
    email: 'buyer@test.com',
    firstName: 'Jane',
    lastName: 'Buyer',
    role: 'buyer',
    rating: 4.5,
    location: 'Bahir Dar',
    phone: '+251911345678',
    isKYCVerified: true,
    walletBalance: 25000
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('auction_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('auction_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Mock registration - in real app, this would call an API
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      rating: 0,
      location: userData.location,
      phone: userData.phone,
      isKYCVerified: false,
      walletBalance: userData.role === 'buyer' ? 10000 : 0 // Start buyers with some balance
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('auction_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auction_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('auction_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}