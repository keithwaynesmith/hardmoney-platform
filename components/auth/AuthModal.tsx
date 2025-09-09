'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { PasswordResetForm } from './PasswordResetForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>(defaultMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="p-8">
            {mode === 'login' ? (
              <LoginForm 
                onSwitchToRegister={() => setMode('register')}
                onSwitchToReset={() => setMode('reset')}
                onClose={onClose}
              />
            ) : mode === 'register' ? (
              <RegisterForm 
                onSwitchToLogin={() => setMode('login')}
                onClose={onClose}
              />
            ) : (
              <PasswordResetForm 
                onBack={() => setMode('login')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

