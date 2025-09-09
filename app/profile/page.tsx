'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileSettings } from '@/components/auth/ProfileSettings';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <ProfileSettings />
      </div>
    </ProtectedRoute>
  );
}

