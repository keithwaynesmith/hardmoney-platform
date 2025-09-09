export type UserRole = 'borrower' | 'investor' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  company?: string;
  experience?: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

export interface Deal {
  id: string;
  borrowerId: string;
  title: string;
  description: string;
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  propertyType: 'single_family' | 'multi_family' | 'commercial' | 'land' | 'other';
  purchasePrice: number;
  arv: number;
  loanAmount: number;
  loanPurpose: 'purchase' | 'refinance' | 'construction' | 'bridge';
  timeline: number; // months
  exitStrategy: string;
  borrowerExperience: string;
  financialDetails: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'funded';
  createdAt: Date;
  updatedAt: Date;
}

export interface Investment {
  id: string;
  investorId: string;
  dealId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'funded';
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  dealId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  uploadedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface Communication {
  id: string;
  dealId: string;
  fromUserId: string;
  toUserId: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  company?: string;
  experience?: string;
}

export interface LoginData {
  email: string;
  password: string;
}