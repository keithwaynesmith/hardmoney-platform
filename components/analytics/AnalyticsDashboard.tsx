'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  totalDeals: number;
  totalValue: number;
  averageDealSize: number;
  successRate: number;
  monthlyTrends: Array<{
    month: string;
    deals: number;
    value: number;
    investments: number;
  }>;
  dealStatusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  topInvestors: Array<{
    name: string;
    investments: number;
    totalValue: number;
  }>;
  performanceMetrics: {
    roi: number;
    defaultRate: number;
    averageTerm: number;
    liquidityRatio: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call - in real app, this would fetch from your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with real data from your API
      const mockData: AnalyticsData = {
        totalDeals: 156,
        totalValue: 45200000,
        averageDealSize: 289743,
        successRate: 87.5,
        monthlyTrends: [
          { month: 'Jan', deals: 12, value: 3200000, investments: 8 },
          { month: 'Feb', deals: 15, value: 4100000, investments: 12 },
          { month: 'Mar', deals: 18, value: 5200000, investments: 15 },
          { month: 'Apr', deals: 22, value: 6300000, investments: 18 },
          { month: 'May', deals: 19, value: 5800000, investments: 16 },
          { month: 'Jun', deals: 25, value: 7200000, investments: 22 },
          { month: 'Jul', deals: 28, value: 8100000, investments: 25 },
          { month: 'Aug', deals: 31, value: 9200000, investments: 28 },
        ],
        dealStatusDistribution: [
          { status: 'Approved', count: 45, percentage: 28.8 },
          { status: 'Under Review', count: 32, percentage: 20.5 },
          { status: 'Funded', count: 38, percentage: 24.4 },
          { status: 'Rejected', count: 20, percentage: 12.8 },
          { status: 'Draft', count: 21, percentage: 13.5 },
        ],
        topInvestors: [
          { name: 'John Smith', investments: 12, totalValue: 2500000 },
          { name: 'Sarah Johnson', investments: 10, totalValue: 2100000 },
          { name: 'Mike Wilson', investments: 8, totalValue: 1800000 },
          { name: 'Lisa Brown', investments: 7, totalValue: 1500000 },
          { name: 'David Lee', investments: 6, totalValue: 1200000 },
        ],
        performanceMetrics: {
          roi: 12.5,
          defaultRate: 2.3,
          averageTerm: 14.2,
          liquidityRatio: 0.85,
        },
      };
      
      setData(mockData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  const exportData = () => {
    // In a real app, this would generate and download a CSV/Excel file
    console.log('Exporting analytics data...');
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

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics data</p>
        <Button onClick={loadAnalyticsData} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive insights into your platform performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={loadAnalyticsData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold text-gray-900">{data.totalDeals}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
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
                  {formatCurrency(data.totalValue)}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18% from last month
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
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPercentage(data.successRate)}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.3% from last month
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(data.averageDealSize)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Per deal
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>
              Deal volume and value over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'value' ? formatCurrency(value as number) : value,
                    name === 'deals' ? 'Deals' : name === 'value' ? 'Value' : 'Investments'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="deals" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                />
                <Area 
                  type="monotone" 
                  dataKey="investments" 
                  stackId="2" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Deal Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Status Distribution</CardTitle>
            <CardDescription>
              Current status of all deals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.dealStatusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percentage }) => `${status}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.dealStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">ROI</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {formatPercentage(data.performanceMetrics.roi)}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Default Rate</span>
                <Badge variant="outline" className="text-red-600 border-red-600">
                  {formatPercentage(data.performanceMetrics.defaultRate)}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Average Term</span>
                <span className="font-bold">{data.performanceMetrics.averageTerm} months</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Liquidity Ratio</span>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {formatPercentage(data.performanceMetrics.liquidityRatio * 100)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Investors</CardTitle>
            <CardDescription>
              Most active investors by volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topInvestors.map((investor, index) => (
                <div key={investor.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{investor.name}</p>
                      <p className="text-sm text-gray-500">{investor.investments} investments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(investor.totalValue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {lastUpdated.toLocaleString()}
      </div>
    </div>
  );
}

