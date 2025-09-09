'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Briefcase, 
  TrendingUp,
  Shield
} from 'lucide-react';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'borrower':
        return <Briefcase className="w-4 h-4" />;
      case 'investor':
        return <TrendingUp className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'borrower':
        return 'Borrower';
      case 'investor':
        return 'Investor';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </span>
        </div>
        <div className="text-left">
          <div className="text-sm font-medium">{user.firstName} {user.lastName}</div>
          <div className="text-xs text-slate-400 flex items-center">
            {getRoleIcon(user.role)}
            <span className="ml-1">{getRoleLabel(user.role)}</span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-20">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-slate-900">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-slate-500">{user.email}</div>
                  <div className="text-xs text-blue-600 flex items-center mt-1">
                    {getRoleIcon(user.role)}
                    <span className="ml-1">{getRoleLabel(user.role)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="py-2">
              <a
                href="/dashboard"
                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User className="w-4 h-4 mr-3" />
                Dashboard
              </a>
              <a
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Settings className="w-4 h-4 mr-3" />
                Profile Settings
              </a>
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


