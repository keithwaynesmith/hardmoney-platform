'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle,
  Key,
  UserCheck,
  FileText,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';

interface SecurityStatus {
  twoFactorEnabled: boolean;
  passwordStrength: 'weak' | 'medium' | 'strong';
  lastPasswordChange: Date;
  loginAttempts: number;
  suspiciousActivity: boolean;
  dataEncryption: boolean;
  auditLogs: number;
  complianceScore: number;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'password_change' | 'file_access' | 'admin_action' | 'suspicious';
  description: string;
  timestamp: Date;
  ipAddress: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function SecurityDashboard() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with real data from your API
      const mockStatus: SecurityStatus = {
        twoFactorEnabled: true,
        passwordStrength: 'strong',
        lastPasswordChange: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        loginAttempts: 3,
        suspiciousActivity: false,
        dataEncryption: true,
        auditLogs: 1247,
        complianceScore: 94,
      };

      const mockEvents: SecurityEvent[] = [
        {
          id: '1',
          type: 'login',
          description: 'Successful login from New York, NY',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          ipAddress: '192.168.1.100',
          location: 'New York, NY',
          severity: 'low',
        },
        {
          id: '2',
          type: 'password_change',
          description: 'Password changed successfully',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          ipAddress: '192.168.1.100',
          location: 'New York, NY',
          severity: 'medium',
        },
        {
          id: '3',
          type: 'file_access',
          description: 'Document accessed: property_contract.pdf',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          ipAddress: '192.168.1.100',
          location: 'New York, NY',
          severity: 'low',
        },
        {
          id: '4',
          type: 'suspicious',
          description: 'Multiple failed login attempts detected',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          ipAddress: '203.0.113.1',
          location: 'Unknown',
          severity: 'high',
        },
      ];

      setSecurityStatus(mockStatus);
      setRecentEvents(mockEvents);
    } catch (err) {
      console.error('Error loading security data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <UserCheck className="w-4 h-4" />;
      case 'password_change':
        return <Key className="w-4 h-4" />;
      case 'file_access':
        return <FileText className="w-4 h-4" />;
      case 'admin_action':
        return <Settings className="w-4 h-4" />;
      case 'suspicious':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const exportAuditLogs = () => {
    // In a real app, this would generate and download audit logs
    console.log('Exporting audit logs...');
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

  if (!securityStatus) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load security data</p>
        <Button onClick={loadSecurityData} className="mt-4">
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
          <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
          <p className="text-gray-600">
            Monitor security status and compliance metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={exportAuditLogs} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button onClick={loadSecurityData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {securityStatus.complianceScore}%
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Excellent
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">2FA Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {securityStatus.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Secure
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Password Strength</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {securityStatus.passwordStrength}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Strong
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Key className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Audit Logs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {securityStatus.auditLogs.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Total events
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {securityStatus.suspiciousActivity && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Suspicious activity detected. Please review your account security immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your account security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
              </div>
              <Badge variant={securityStatus.twoFactorEnabled ? 'default' : 'outline'}>
                {securityStatus.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Key className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-gray-500">
                    Last changed {formatTimeAgo(securityStatus.lastPasswordChange)}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Data Encryption</p>
                  <p className="text-sm text-gray-500">All data is encrypted at rest</p>
                </div>
              </div>
              <Badge variant={securityStatus.dataEncryption ? 'default' : 'outline'}>
                {securityStatus.dataEncryption ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
            <CardDescription>
              Latest security-related activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent events</p>
              ) : (
                recentEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{event.description}</p>
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>{event.location}</span>
                        <span>{event.ipAddress}</span>
                        <span>{formatTimeAgo(event.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Information */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance & Certifications</CardTitle>
          <CardDescription>
            Security certifications and compliance standards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium">SOC 2 Type II</p>
                <p className="text-sm text-gray-500">Certified</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium">GDPR Compliant</p>
                <p className="text-sm text-gray-500">EU Data Protection</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium">PCI DSS</p>
                <p className="text-sm text-gray-500">Payment Security</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium">ISO 27001</p>
                <p className="text-sm text-gray-500">Information Security</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium">HIPAA Ready</p>
                <p className="text-sm text-gray-500">Health Data Protection</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium">256-bit SSL</p>
                <p className="text-sm text-gray-500">Data Encryption</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

