import { User, Deal, Investment, Document, Notification, Communication } from '@/types';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hardmoney.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: '+1 (555) 123-4567',
    company: 'HardMoney Platform',
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'borrower@example.com',
    firstName: 'John',
    lastName: 'Borrower',
    role: 'borrower',
    phone: '+1 (555) 234-5678',
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'investor@example.com',
    firstName: 'Jane',
    lastName: 'Investor',
    role: 'investor',
    phone: '+1 (555) 345-6789',
    company: 'Investment Group LLC',
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockDeals: Deal[] = [
  {
    id: '1',
    borrowerId: '2',
    title: 'Downtown Office Building',
    description: 'Prime commercial property in downtown area',
    propertyAddress: '123 Main St',
    propertyCity: 'New York',
    propertyState: 'NY',
    propertyZip: '10001',
    propertyType: 'commercial',
    purchasePrice: 2500000,
    arv: 3200000,
    loanAmount: 2000000,
    loanPurpose: 'purchase',
    timeline: 12,
    exitStrategy: 'Sell after renovation',
    borrowerExperience: '5+ years in commercial real estate',
    financialDetails: 'Strong financial position with multiple properties',
    status: 'approved',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    borrowerId: '2',
    title: 'Residential Flip Project',
    description: 'Single family home renovation project',
    propertyAddress: '456 Oak Ave',
    propertyCity: 'Los Angeles',
    propertyState: 'CA',
    propertyZip: '90210',
    propertyType: 'single_family',
    purchasePrice: 800000,
    arv: 1200000,
    loanAmount: 600000,
    loanPurpose: 'purchase',
    timeline: 6,
    exitStrategy: 'Sell after renovation',
    borrowerExperience: '3+ years in residential flipping',
    financialDetails: 'Good credit and steady income',
    status: 'under_review',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockInvestments: Investment[] = [
  {
    id: '1',
    investorId: '3',
    dealId: '1',
    amount: 500000,
    status: 'approved',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    investorId: '3',
    dealId: '2',
    amount: 200000,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockDocuments: Document[] = [
  {
    id: '1',
    dealId: '1',
    fileName: 'property_photos.pdf',
    fileUrl: 'https://example.com/documents/property_photos.pdf',
    fileType: 'application/pdf',
    uploadedAt: new Date(),
  },
  {
    id: '2',
    dealId: '1',
    fileName: 'purchase_contract.pdf',
    fileUrl: 'https://example.com/documents/purchase_contract.pdf',
    fileType: 'application/pdf',
    uploadedAt: new Date(),
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '2',
    title: 'Deal Approved',
    message: 'Your deal "Downtown Office Building" has been approved!',
    type: 'success',
    read: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: '3',
    title: 'New Investment Opportunity',
    message: 'A new deal matching your criteria is now available.',
    type: 'info',
    read: false,
    createdAt: new Date(),
  },
];

const mockCommunications: Communication[] = [
  {
    id: '1',
    dealId: '1',
    fromUserId: '2',
    toUserId: '3',
    subject: 'Property Inspection',
    message: 'The property inspection is scheduled for next Tuesday.',
    read: false,
    createdAt: new Date(),
  },
];

// User Services
export const userService = {
  async getCurrentUser(): Promise<User | null> {
    // Return the first user as current user for demo
    return mockUsers[0];
  },

  async createUser(userData: Partial<User>): Promise<User | null> {
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      role: userData.role || 'borrower',
      phone: userData.phone,
      company: userData.company,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) return null;
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates, updatedAt: new Date() };
    return mockUsers[userIndex];
  },

  async getUserById(id: string): Promise<User | null> {
    return mockUsers.find(u => u.id === id) || null;
  },
};

// Deal Services
export const dealService = {
  async createDeal(dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal | null> {
    const newDeal: Deal = {
      id: Date.now().toString(),
      ...dealData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDeals.push(newDeal);
    return newDeal;
  },

  async getDealsByBorrower(borrowerId: string): Promise<Deal[]> {
    return mockDeals.filter(d => d.borrowerId === borrowerId);
  },

  async getAllDeals(): Promise<Deal[]> {
    return mockDeals;
  },

  async getDealById(id: string): Promise<Deal | null> {
    return mockDeals.find(d => d.id === id) || null;
  },

  async updateDeal(id: string, updates: Partial<Deal>): Promise<Deal | null> {
    const dealIndex = mockDeals.findIndex(d => d.id === id);
    if (dealIndex === -1) return null;
    
    mockDeals[dealIndex] = { ...mockDeals[dealIndex], ...updates, updatedAt: new Date() };
    return mockDeals[dealIndex];
  },

  async deleteDeal(id: string): Promise<boolean> {
    const dealIndex = mockDeals.findIndex(d => d.id === id);
    if (dealIndex === -1) return false;
    
    mockDeals.splice(dealIndex, 1);
    return true;
  },
};

// Investment Services
export const investmentService = {
  async createInvestment(investmentData: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Investment | null> {
    const newInvestment: Investment = {
      id: Date.now().toString(),
      ...investmentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockInvestments.push(newInvestment);
    return newInvestment;
  },

  async getInvestmentsByInvestor(investorId: string): Promise<Investment[]> {
    return mockInvestments.filter(i => i.investorId === investorId);
  },

  async getInvestmentsByDeal(dealId: string): Promise<Investment[]> {
    return mockInvestments.filter(i => i.dealId === dealId);
  },

  async updateInvestment(id: string, updates: Partial<Investment>): Promise<Investment | null> {
    const investmentIndex = mockInvestments.findIndex(i => i.id === id);
    if (investmentIndex === -1) return null;
    
    mockInvestments[investmentIndex] = { ...mockInvestments[investmentIndex], ...updates, updatedAt: new Date() };
    return mockInvestments[investmentIndex];
  },
};

// Document Services
export const documentService = {
  async uploadDocument(documentData: Omit<Document, 'id' | 'uploadedAt'>): Promise<Document | null> {
    const newDocument: Document = {
      id: Date.now().toString(),
      ...documentData,
      uploadedAt: new Date(),
    };
    mockDocuments.push(newDocument);
    return newDocument;
  },

  async getDocumentsByDeal(dealId: string): Promise<Document[]> {
    return mockDocuments.filter(d => d.dealId === dealId);
  },

  async deleteDocument(id: string): Promise<boolean> {
    const docIndex = mockDocuments.findIndex(d => d.id === id);
    if (docIndex === -1) return false;
    
    mockDocuments.splice(docIndex, 1);
    return true;
  },
};

// Notification Services
export const notificationService = {
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification | null> {
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...notificationData,
      createdAt: new Date(),
    };
    mockNotifications.push(newNotification);
    return newNotification;
  },

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return mockNotifications.filter(n => n.userId === userId);
  },

  async markNotificationAsRead(id: string): Promise<boolean> {
    const notification = mockNotifications.find(n => n.id === id);
    if (!notification) return false;
    
    notification.read = true;
    return true;
  },

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    const userNotifications = mockNotifications.filter(n => n.userId === userId && !n.read);
    userNotifications.forEach(n => n.read = true);
    return true;
  },
};

// Communication Services
export const communicationService = {
  async createCommunication(communicationData: Omit<Communication, 'id' | 'createdAt'>): Promise<Communication | null> {
    const newCommunication: Communication = {
      id: Date.now().toString(),
      ...communicationData,
      createdAt: new Date(),
    };
    mockCommunications.push(newCommunication);
    return newCommunication;
  },

  async getCommunicationsByDeal(dealId: string): Promise<Communication[]> {
    return mockCommunications.filter(c => c.dealId === dealId);
  },

  async getCommunicationsByUser(userId: string): Promise<Communication[]> {
    return mockCommunications.filter(c => c.fromUserId === userId || c.toUserId === userId);
  },

  async markCommunicationAsRead(id: string): Promise<boolean> {
    const communication = mockCommunications.find(c => c.id === id);
    if (!communication) return false;
    
    communication.read = true;
    return true;
  },
};

