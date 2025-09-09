'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  MessageSquare,
  Filter,
  Search,
  Calendar,
  MapPin,
  Building
} from 'lucide-react';

// Mock data for admin dashboard
const mockApplications = [
  {
    id: '1',
    borrowerName: 'John Smith',
    borrowerEmail: 'john@example.com',
    propertyAddress: '123 Main St, Brooklyn, NY',
    loanAmount: 400000,
    purchasePrice: 500000,
    arv: 650000,
    status: 'under_review',
    submittedDate: '2024-01-15',
    propertyType: 'single_family',
    borrowerExperience: '5+ years',
    priority: 'high',
  },
  {
    id: '2',
    borrowerName: 'Sarah Johnson',
    borrowerEmail: 'sarah@example.com',
    propertyAddress: '456 Oak Ave, Queens, NY',
    loanAmount: 750000,
    purchasePrice: 900000,
    arv: 1200000,
    status: 'approved',
    submittedDate: '2024-01-12',
    propertyType: 'multi_family',
    borrowerExperience: '10+ years',
    priority: 'medium',
  },
  {
    id: '3',
    borrowerName: 'Mike Davis',
    borrowerEmail: 'mike@example.com',
    propertyAddress: '789 Pine St, Manhattan, NY',
    loanAmount: 300000,
    purchasePrice: 400000,
    arv: 550000,
    status: 'rejected',
    submittedDate: '2024-01-10',
    propertyType: 'single_family',
    borrowerExperience: '2+ years',
    priority: 'low',
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

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

export default function AdminPage() {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplications = mockApplications.filter(app => {
    const matchesStatus = !selectedStatus || app.status === selectedStatus;
    const matchesSearch = app.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    totalApplications: mockApplications.length,
    pendingReview: mockApplications.filter(app => app.status === 'under_review').length,
    approved: mockApplications.filter(app => app.status === 'approved').length,
    totalLoanAmount: mockApplications.reduce((sum, app) => sum + app.loanAmount, 0),
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600">Manage loan applications and platform operations</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-slate-600">Welcome, {user?.firstName}</div>
                  <div className="text-xs text-slate-500">Administrator</div>
                </div>
              </div>
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
                  <p className="text-2xl font-bold text-slate-900">{stats.totalApplications}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Pending Review</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.pendingReview}</p>
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
                  <p className="text-2xl font-bold text-slate-900">{stats.approved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Loan Amount</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ${stats.totalLoanAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Loan Applications</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search applications..."
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Borrower
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Loan Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredApplications.map((app) => {
                    const statusInfo = statusConfig[app.status as keyof typeof statusConfig];
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{app.borrowerName}</div>
                            <div className="text-sm text-slate-500">{app.borrowerEmail}</div>
                            <div className="text-xs text-slate-400">{app.borrowerExperience}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-slate-400 mr-2" />
                            <div>
                              <div className="text-sm text-slate-900">{app.propertyAddress}</div>
                              <div className="text-xs text-slate-500 flex items-center">
                                <Building className="w-3 h-3 mr-1" />
                                {app.propertyType.replace('_', ' ')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">
                            ${app.loanAmount.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            ARV: ${app.arv.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[app.priority as keyof typeof priorityColors]}`}>
                            {app.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-slate-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(app.submittedDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button className="text-slate-600 hover:text-slate-800">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Applications Found</h3>
                <p className="text-slate-600">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
