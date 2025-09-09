'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, RegisterData, LoginData } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { userService } from '@/lib/database/services';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Create Supabase client
  const supabase = createClient();

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userData = await userService.getCurrentUser();
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData = await userService.getCurrentUser();
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        const userData = await userService.getCurrentUser();
        if (userData) {
          setUser(userData);
        } else {
          // Create user profile if it doesn't exist
          const newUser = await userService.createUser({
            id: data.user.id,
            email: data.user.email!,
            firstName: data.user.user_metadata?.first_name || '',
            lastName: data.user.user_metadata?.last_name || '',
            role: data.user.user_metadata?.role || 'borrower',
            isEmailVerified: data.user.email_confirmed_at ? true : false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          setUser(newUser);
        }
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
            phone: userData.phone,
            company: userData.company,
            experience: userData.experience,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        // Create user profile
        const newUser = await userService.createUser({
          id: data.user.id,
          email: data.user.email!,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          phone: userData.phone,
          company: userData.company,
          experience: userData.experience,
          isEmailVerified: data.user.email_confirmed_at ? true : false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        setUser(newUser);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const updatedUser = await userService.updateUser(user.id, userData);
      if (updatedUser) {
        setUser(updatedUser);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      // Validate new password
      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters');
      }
      
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        throw new Error('New password must contain at least one uppercase letter, one lowercase letter, and one number');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });

      if (error) {
        throw new Error(error.message);
      }

      // Update user verification status
      const updatedUser = await userService.updateUser(user.id, { isEmailVerified: true });
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Email verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Resend verification failed');
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userData = await userService.getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    updateProfile,
    changePassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

