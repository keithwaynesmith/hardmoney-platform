'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Eye,
  Heart,
  Star,
  Building,
  Clock
} from 'lucide-react';

// Mock data for available deals
const mockDeals = [
  {
    id: '1',
    title: 'Modern Single Family Home - Brooklyn',
    description: 'Beautiful 3BR/2BA home in prime Brooklyn location. Recently renovated with modern finishes.',
    address: '123 Park Slope, Brooklyn, NY 11215',
    propertyType: 'single_family',
    loanAmount: 400000,
    purchasePrice: 500000,
    arv: 650000,
    ltv: 80,
    interestRate: 8.5,
    term: 12,
    borrowerExperience: '5+ years',
    status: 'available',
    postedDate: '2024-01-15',
    images: ['/api/placeholder/400/300'],
    riskScore: 'Low',
    expectedReturn: 12.5,
  },
  {
    id: '2',
    title: 'Multi-Family Investment Property - Queens',
    description: '4-unit apartment building with strong rental income. Located near subway station.',
    address: '456 Astoria Blvd, Queens, NY 11102',
    propertyType: 'multi_family',
    loanAmount: 750000,
    purchasePrice: 900000,
    arv: 1200000,
    ltv: 83,
    interestRate: 9.0,
    term: 18,
    borrowerExperience: '10+ years',
    status: 'available',
    postedDate: '2024-01-12',
    images: ['/api/placeholder/400/300'],
    riskScore: 'Medium',
    expectedReturn: 15.2,
  },
  {
    id: '3',
    title: 'Commercial Office Space - Manhattan',
    description: 'Prime office space in Midtown Manhattan. Long-term tenant with strong credit.',
    address: '789 5th Avenue, New York, NY 10022',
    propertyType: 'commercial',
    loanAmount: 1200000,
    purchasePrice: 1500000,
    arv: 1800000,
    ltv: 80,
    interestRate: 7.5,
    term: 24,
    borrowerExperience: '15+ years',
    status: 'funded',
    postedDate: '2024-01-10',
    images: ['/api/placeholder/400/300'],
    riskScore: 'Low',
    expectedReturn: 11.8,
  },
];

const propertyTypeLabels = {
  single_family: 'Single Family',
  multi_family: 'Multi Family',
  commercial: 'Commercial',
  land: 'Land',
  other: 'Other',
};

const riskScoreColors = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
};

export default function InvestorPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredDeals = mockDeals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || deal.propertyType === selectedType;
    const matchesRisk = !selectedRisk || deal.riskScore === selectedRisk;
    
    return matchesSearch && matchesType && matchesRisk && deal.status === 'available';
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      case 'oldest':
        return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
      case 'amount_high':
        return b.loanAmount - a.loanAmount;
      case 'amount_low':
        return a.loanAmount - b.loanAmount;
      case 'return_high':
        return b.expectedReturn - a.expectedReturn;
      case 'return_low':
        return a.expectedReturn - b.expectedReturn;
      default:
        return 0;
    }
  });

  return (
    <ProtectedRoute requiredRole="investor">
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Investment Opportunities</h1>
                <p className="text-slate-600">Browse and invest in real estate deals</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-slate-600">Available Capital</div>
                  <div className="text-2xl font-bold text-green-600">$2,500,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search Deals
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search by property or location..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  {Object.entries(propertyTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Risk Level
                </label>
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Risk Levels</option>
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Sort by:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount_high">Highest Amount</option>
                  <option value="amount_low">Lowest Amount</option>
                  <option value="return_high">Highest Return</option>
                  <option value="return_low">Lowest Return</option>
                </select>
              </div>
              <div className="text-sm text-slate-600">
                {filteredDeals.length} deals available
              </div>
            </div>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedDeals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
                {/* Property Image */}
                <div className="relative h-48 bg-slate-200 rounded-t-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskScoreColors[deal.riskScore as keyof typeof riskScoreColors]}`}>
                      {deal.riskScore} Risk
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{deal.address.split(',')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Deal Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
                      {deal.title}
                    </h3>
                    <button className="text-slate-400 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {deal.description}
                  </p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Loan Amount</div>
                      <div className="text-lg font-semibold text-slate-900">
                        ${deal.loanAmount.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Expected Return</div>
                      <div className="text-lg font-semibold text-green-600">
                        {deal.expectedReturn}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">LTV</div>
                      <div className="text-sm font-medium text-slate-900">
                        {deal.ltv}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Term</div>
                      <div className="text-sm font-medium text-slate-900">
                        {deal.term} months
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      <span>{propertyTypeLabels[deal.propertyType as keyof typeof propertyTypeLabels]}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{new Date(deal.postedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                      Invest
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedDeals.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No Deals Found</h3>
              <p className="text-slate-600 mb-6">
                Try adjusting your search criteria to find more investment opportunities.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('');
                  setSelectedRisk('');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
