import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { useNotifications } from './NotificationContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { mockAuctions, categories } from './mockData';
import { 
  Users, 
  Gavel, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  Download,
  Search,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  FileText
} from 'lucide-react';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  status: 'active' | 'banned' | 'pending';
  joinDate: Date;
  totalSpent: number;
  totalSold: number;
  rating: number;
}

const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'John Seller',
    email: 'seller@test.com',
    role: 'seller',
    status: 'active',
    joinDate: new Date('2024-01-15'),
    totalSpent: 0,
    totalSold: 125000,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Jane Buyer',
    email: 'buyer@test.com',
    role: 'buyer',
    status: 'active',
    joinDate: new Date('2024-02-01'),
    totalSpent: 45000,
    totalSold: 0,
    rating: 4.5
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@test.com',
    role: 'seller',
    status: 'pending',
    joinDate: new Date('2024-03-10'),
    totalSpent: 0,
    totalSold: 0,
    rating: 0
  }
];

export function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalUsers = mockUsers.length;
  const activeAuctions = mockAuctions.filter(a => a.status === 'active').length;
  const pendingAuctions = mockAuctions.filter(a => !a.isApproved).length;
  const totalRevenue = mockAuctions.reduce((sum, auction) => sum + auction.currentBid, 0);

  const handleUserAction = (userId: string, action: 'ban' | 'unban' | 'approve') => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return;

    let message = '';
    switch (action) {
      case 'ban':
        message = `User ${user.name} has been banned`;
        break;
      case 'unban':
        message = `User ${user.name} has been unbanned`;
        break;
      case 'approve':
        message = `User ${user.name} has been approved`;
        break;
    }

    showToast(message, 'success');
  };

  const handleAuctionAction = (auctionId: string, action: 'approve' | 'reject') => {
    const auction = mockAuctions.find(a => a.id === auctionId);
    if (!auction) return;

    const message = action === 'approve' 
      ? `Auction "${auction.title}" has been approved`
      : `Auction "${auction.title}" has been rejected`;

    showToast(message, 'success');
  };

  const exportReport = (type: 'users' | 'auctions' | 'revenue') => {
    showToast(`${type} report exported successfully`, 'success');
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingAuctionsList = mockAuctions.filter(a => !a.isApproved);

  const stats = [
    {
      title: t('admin.total_users'),
      value: totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: t('admin.active_auctions'),
      value: activeAuctions,
      icon: Gavel,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: t('admin.total_revenue'),
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: t('admin.pending_approvals'),
      value: pendingAuctions,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('admin.dashboard')}</h1>
        <p className="text-gray-600">Manage platform users, auctions, and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">{t('admin.users')}</TabsTrigger>
          <TabsTrigger value="auctions">{t('admin.auctions')}</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">{t('admin.reports')}</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage platform users and their permissions</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => exportReport('users')}>
                    <Download size={16} className="mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'seller' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              user.status === 'active' ? 'default' :
                              user.status === 'banned' ? 'destructive' : 'secondary'
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {user.role === 'buyer' ? (
                              <div>Spent: {formatCurrency(user.totalSpent)}</div>
                            ) : (
                              <div>Sold: {formatCurrency(user.totalSold)}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="text-sm">{user.rating.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                                  <Eye size={14} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>User Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Name</label>
                                      <p>{user.name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Email</label>
                                      <p>{user.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Role</label>
                                      <p className="capitalize">{user.role}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Status</label>
                                      <p className="capitalize">{user.status}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Join Date</label>
                                      <p>{user.joinDate.toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Rating</label>
                                      <p>{user.rating.toFixed(1)} / 5.0</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {user.status === 'active' ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'ban')}
                              >
                                <Ban size={14} />
                              </Button>
                            ) : user.status === 'banned' ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'unban')}
                              >
                                <CheckCircle size={14} />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'approve')}
                              >
                                <CheckCircle size={14} />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auctions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Auction Management</CardTitle>
                  <CardDescription>Review and approve auction listings</CardDescription>
                </div>
                <Badge variant="secondary">
                  {pendingAuctionsList.length} pending approvals
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAuctionsList.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500">No auctions pending approval</p>
                  </div>
                ) : (
                  pendingAuctionsList.map((auction) => (
                    <div key={auction.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={auction.images[0]}
                          alt={auction.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-lg mb-1">{auction.title}</h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {auction.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span>Category: {auction.category}</span>
                            <span>Seller: {auction.sellerName}</span>
                            <span>Starting: {formatCurrency(auction.startingBid)}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleAuctionAction(auction.id, 'approve')}
                            >
                              <CheckCircle size={14} className="mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAuctionAction(auction.id, 'reject')}
                            >
                              <XCircle size={14} className="mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Monthly revenue and transaction data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">This Month</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalRevenue * 0.4)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Total Commission</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalRevenue * 0.03)}</p>
                    </div>
                    <PieChart className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Popular categories and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.slice(0, 4).map((category) => {
                    const categoryAuctions = mockAuctions.filter(a => a.category === category.name).length;
                    return (
                      <div key={category.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <Badge variant="secondary">{categoryAuctions} auctions</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>User registration and activity trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{mockUsers.filter(u => u.role === 'buyer').length}</p>
                  <p className="text-sm text-gray-600">Active Buyers</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{mockUsers.filter(u => u.role === 'seller').length}</p>
                  <p className="text-sm text-gray-600">Verified Sellers</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{mockUsers.filter(u => u.status === 'pending').length}</p>
                  <p className="text-sm text-gray-600">Pending KYC</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Reports</CardTitle>
              <CardDescription>Generate and download various reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <FileText className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-medium mb-2">User Report</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Export user data, activity, and statistics
                  </p>
                  <Button onClick={() => exportReport('users')} className="w-full">
                    <Download size={14} className="mr-2" />
                    Export CSV
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <BarChart3 className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-medium mb-2">Auction Report</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Export auction listings and performance data
                  </p>
                  <Button onClick={() => exportReport('auctions')} className="w-full">
                    <Download size={14} className="mr-2" />
                    Export CSV
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <DollarSign className="h-8 w-8 text-purple-600 mb-3" />
                  <h3 className="font-medium mb-2">Revenue Report</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Export financial data and commission reports
                  </p>
                  <Button onClick={() => exportReport('revenue')} className="w-full">
                    <Download size={14} className="mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure platform settings and commission rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Commission Rate (%)</label>
                    <Input type="number" placeholder="3" min="0" max="10" step="0.1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Auction Duration (days)</label>
                    <Input type="number" placeholder="30" min="1" max="90" />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button>Save Settings</Button>
                  <Button variant="outline">Reset to Defaults</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}