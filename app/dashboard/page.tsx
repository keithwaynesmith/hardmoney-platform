'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoanApplicationForm from '@/components/forms/LoanApplicationForm';
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react';

// Mock data for demonstration
const mockDeals = [
  {
    id: '1',
    title: '123 Main Street, NYC',
    status: 'under_review',
    loanAmount: 400000,
    purchasePrice: 500000,
    arv: 650000,
    submittedDate: '2024-01-15',
    propertyType: 'single_family',
  },
  {
    id: '2',
    title: '456 Oak Avenue, LA',
    status: 'approved',
    loanAmount: 750000,
    purchasePrice: 900000,
    arv: 1200000,
    submittedDate: '2024-01-10',
    propertyType: 'multi_family',
  },
  {
    id: '3',
    title: '789 Pine Street, Miami',
    status: 'rejected',
    loanAmount: 300000,
    purchasePrice: 400000,
    arv: 550000,
    submittedDate: '2024-01-05',
    propertyType: 'single_family',
  },
];

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-800', icon: FileText },
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-800', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
  funded: { label: 'Funded', color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const handleApplicationSuccess = (data: any) => {
    console.log('Application submitted:', data);
    setShowApplicationForm(false);
    // In a real app, you'd update the deals list here
  };

  if (showApplicationForm) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 py-8">
          <div className="container mx-auto px-4">
            <LoanApplicationForm
              onSuccess={handleApplicationSuccess}
              onCancel={() => setShowApplicationForm(false)}
            />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600">Welcome back, {user?.firstName}!</p>
              </div>
              <button
                onClick={() => setShowApplicationForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>New Application</span>
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Applications</p>
                  <p className="text-2xl font-bold text-slate-900">{mockDeals.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Approved</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {mockDeals.filter(deal => deal.status === 'approved').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Under Review</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {mockDeals.filter(deal => deal.status === 'under_review').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Requested</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${mockDeals.reduce((sum, deal) => sum + deal.loanAmount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Recent Applications</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {mockDeals.map((deal) => {
                const statusInfo = statusConfig[deal.status as keyof typeof statusConfig];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={deal.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-slate-900">{deal.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span>Loan: ${deal.loanAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            <span>ARV: ${deal.arv.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Submitted: {new Date(deal.submittedDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="capitalize">{deal.propertyType.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View Details
                        </button>
                        {deal.status === 'draft' && (
                          <button className="text-slate-600 hover:text-slate-800 text-sm font-medium">
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {mockDeals.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No Applications Yet</h3>
              <p className="text-slate-600 mb-6">Get started by submitting your first loan application.</p>
              <button
                onClick={() => setShowApplicationForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Application
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
