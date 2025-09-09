'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  RefreshCw
} from 'lucide-react';
import { Deal, Investment, Notification } from '@/types';
import { dealService, investmentService, notificationService } from '@/lib/database/services';

interface DashboardStats {
  totalDeals: number;
  activeDeals: number;
  totalInvestments: number;
  totalValue: number;
  recentActivity: number;
  pendingApprovals: number;
}

export function LiveDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalDeals: 0,
    activeDeals: 0,
    totalInvestments: 0,
    totalValue: 0,
    recentActivity: 0,
    pendingApprovals: 0,
  });
  const [recentDeals, setRecentDeals] = useState<Deal[]>([]);
  const [recentInvestments, setRecentInvestments] = useState<Investment[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      
      // Set up real-time updates every 30 seconds
      const interval = setInterval(() => {
        if (isLive) {
          loadDashboardData();
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, isLive]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load deals
      const deals = user.role === 'borrower' 
        ? await dealService.getDealsByBorrower(user.id)
        : await dealService.getAllDeals();
      
      // Load investments
      const investments = user.role === 'investor'
        ? await investmentService.getInvestmentsByInvestor(user.id)
        : [];
      
      // Load notifications
      const notifications = await notificationService.getNotificationsByUser(user.id);
      
      // Calculate stats
      const activeDeals = deals.filter(d => ['submitted', 'under_review', 'approved'].includes(d.status)).length;
      const totalValue = deals.reduce((sum, deal) => sum + deal.loanAmount, 0);
      const recentActivity = notifications.filter(n => {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        return new Date(n.createdAt) > oneDayAgo;
      }).length;
      
      const pendingApprovals = deals.filter(d => d.status === 'submitted').length;
      
      setStats({
        totalDeals: deals.length,
        activeDeals,
        totalInvestments: investments.length,
        totalValue,
        recentActivity,
        pendingApprovals,
      });
      
      setRecentDeals(deals.slice(0, 5));
      setRecentInvestments(investments.slice(0, 5));
      setRecentNotifications(notifications.slice(0, 5));
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  const toggleLiveUpdates = () => {
    setIsLive(!isLive);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName}! Here&apos;s what&apos;s happening.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isLive ? 'Live updates' : 'Paused'}
            </span>
          </div>
          <Button
            onClick={toggleLiveUpdates}
            variant="outline"
            size="sm"
            className={isLive ? 'text-green-600 border-green-600' : ''}
          >
            <Activity className="w-4 h-4 mr-2" />
            {isLive ? 'Pause' : 'Resume'}
          </Button>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDeals}</p>
                <p className="text-xs text-gray-500">
                  {stats.activeDeals} active
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalValue)}
                </p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Investments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInvestments}</p>
                <p className="text-xs text-gray-500">
                  {stats.pendingApprovals} pending
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentActivity}</p>
                <p className="text-xs text-gray-500">
                  Last 24 hours
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Recent Deals
            </CardTitle>
            <CardDescription>
              Latest deal activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDeals.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent deals</p>
              ) : (
                recentDeals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{deal.title}</p>
                      <p className="text-sm text-gray-500">{deal.propertyAddress}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(deal.status)}>
                        {deal.status.replace('_', ' ')}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatTimeAgo(deal.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Recent Notifications
            </CardTitle>
            <CardDescription>
              Latest updates and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent notifications</p>
              ) : (
                recentNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.read ? 'bg-gray-400' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {formatTimeAgo(lastUpdated)}
      </div>
    </div>
  );
}
