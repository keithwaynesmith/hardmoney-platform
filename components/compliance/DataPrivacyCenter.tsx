'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Lock,
  CheckCircle,
  AlertCircle,
  User,
  Database,
  Settings,
  Mail
} from 'lucide-react';

interface DataRequest {
  id: string;
  type: 'access' | 'portability' | 'deletion' | 'rectification';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  requestedAt: Date;
  completedAt?: Date;
  description: string;
}

interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  marketing: boolean;
  thirdPartySharing: boolean;
  dataRetention: number; // in months
  cookieConsent: boolean;
}

export function DataPrivacyCenter() {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataCollection: true,
    analytics: true,
    marketing: false,
    thirdPartySharing: false,
    dataRetention: 24,
    cookieConsent: true,
  });

  const [dataRequests, setDataRequests] = useState<DataRequest[]>([
    {
      id: '1',
      type: 'access',
      status: 'completed',
      requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      description: 'Request for personal data access',
    },
    {
      id: '2',
      type: 'portability',
      status: 'in_progress',
      requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      description: 'Request for data portability',
    },
    {
      id: '3',
      type: 'deletion',
      status: 'pending',
      requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      description: 'Request for data deletion',
    },
  ]);

  const [showDataExport, setShowDataExport] = useState(false);
  const [showDataDeletion, setShowDataDeletion] = useState(false);

  const handlePrivacySettingChange = (key: keyof PrivacySettings, value: boolean | number) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const requestDataAccess = () => {
    const newRequest: DataRequest = {
      id: Date.now().toString(),
      type: 'access',
      status: 'pending',
      requestedAt: new Date(),
      description: 'Request for personal data access',
    };
    setDataRequests(prev => [newRequest, ...prev]);
  };

  const requestDataPortability = () => {
    const newRequest: DataRequest = {
      id: Date.now().toString(),
      type: 'portability',
      status: 'pending',
      requestedAt: new Date(),
      description: 'Request for data portability',
    };
    setDataRequests(prev => [newRequest, ...prev]);
  };

  const requestDataDeletion = () => {
    setShowDataDeletion(true);
  };

  const exportData = () => {
    setShowDataExport(true);
    // In a real app, this would generate and download the data
    console.log('Exporting user data...');
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'access':
        return <Eye className="w-4 h-4" />;
      case 'portability':
        return <Download className="w-4 h-4" />;
      case 'deletion':
        return <Trash2 className="w-4 h-4" />;
      case 'rectification':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Privacy Center</h1>
        <p className="text-gray-600">
          Manage your data privacy settings and exercise your rights
        </p>
      </div>

      {/* Privacy Rights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Right to Access</h3>
            <p className="text-sm text-gray-600">View your personal data</p>
            <Button onClick={requestDataAccess} className="mt-3" size="sm">
              Request Access
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">Data Portability</h3>
            <p className="text-sm text-gray-600">Export your data</p>
            <Button onClick={requestDataPortability} className="mt-3" size="sm">
              Request Export
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">Right to Rectification</h3>
            <p className="text-sm text-gray-600">Correct your data</p>
            <Button onClick={() => {}} className="mt-3" size="sm">
              Update Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Trash2 className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-semibold">Right to Erasure</h3>
            <p className="text-sm text-gray-600">Delete your data</p>
            <Button onClick={requestDataDeletion} className="mt-3" size="sm" variant="destructive">
              Request Deletion
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control how your data is collected and used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Database className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Data Collection</p>
                  <p className="text-sm text-gray-500">Allow collection of personal data</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.dataCollection}
                onChange={(e) => handlePrivacySettingChange('dataCollection', e.target.checked)}
                className="text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-sm text-gray-500">Allow usage analytics and insights</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.analytics}
                onChange={(e) => handlePrivacySettingChange('analytics', e.target.checked)}
                className="text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Marketing Communications</p>
                  <p className="text-sm text-gray-500">Receive marketing emails and updates</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.marketing}
                onChange={(e) => handlePrivacySettingChange('marketing', e.target.checked)}
                className="text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Third-Party Sharing</p>
                  <p className="text-sm text-gray-500">Share data with trusted partners</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.thirdPartySharing}
                onChange={(e) => handlePrivacySettingChange('thirdPartySharing', e.target.checked)}
                className="text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Data Retention</p>
                  <p className="text-sm text-gray-500">How long to keep your data</p>
                </div>
              </div>
              <select
                value={privacySettings.dataRetention}
                onChange={(e) => handlePrivacySettingChange('dataRetention', parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={6}>6 months</option>
                <option value={12}>1 year</option>
                <option value={24}>2 years</option>
                <option value={36}>3 years</option>
                <option value={60}>5 years</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => {}}>
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Data Requests
          </CardTitle>
          <CardDescription>
            Track your data privacy requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No data requests yet</p>
            ) : (
              dataRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getRequestTypeIcon(request.type)}
                    <div>
                      <p className="font-medium capitalize">{request.type} Request</p>
                      <p className="text-sm text-gray-500">{request.description}</p>
                      <p className="text-xs text-gray-400">
                        Requested {formatDate(request.requestedAt)}
                        {request.completedAt && ` • Completed ${formatDate(request.completedAt)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.replace('_', ' ')}
                    </Badge>
                    {request.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Compliance & Certifications
          </CardTitle>
          <CardDescription>
            Our commitment to data protection and privacy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Data Protection Regulations</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">GDPR Compliant (EU)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">CCPA Compliant (California)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">PIPEDA Compliant (Canada)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">LGPD Compliant (Brazil)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Security Certifications</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">SOC 2 Type II</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">ISO 27001</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">PCI DSS Level 1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">HIPAA Ready</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Deletion Confirmation Modal */}
      {showDataDeletion && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowDataDeletion(false)} />
            <Card className="relative w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Confirm Data Deletion
                </CardTitle>
                <CardDescription>
                  This action cannot be undone. All your personal data will be permanently deleted.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This will delete all your account data, including deals, investments, and documents.
                  </AlertDescription>
                </Alert>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDataDeletion(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      // In a real app, this would initiate data deletion
                      console.log('Initiating data deletion...');
                      setShowDataDeletion(false);
                    }}
                    className="flex-1"
                  >
                    Delete All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

