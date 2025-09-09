import { createClient } from '@/lib/supabase/client';
import { User, Deal, Investment, Document, Notification, Communication } from '@/types';

const supabase = createClient();

// Helper function to check if supabase is available
const checkSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }
  return supabase;
};

// User Services
export const userService = {
  async getCurrentUser(): Promise<User | null> {
    const client = checkSupabase();
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) return null;

    const { data, error: profileError } = await client
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) return null;
    return data;
  },

  async createUser(userData: Partial<User>): Promise<User | null> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }
    return data;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return null;
    }
    return data;
  },

  async getUserById(id: string): Promise<User | null> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },
};

// Deal Services
export const dealService = {
  async createDeal(dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal | null> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('deals')
      .insert([dealData])
      .select()
      .single();

    if (error) {
      console.error('Error creating deal:', error);
      return null;
    }
    return data;
  },

  async getDealsByBorrower(borrowerId: string): Promise<Deal[]> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('deals')
      .select('*')
      .eq('borrower_id', borrowerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching deals:', error);
      return [];
    }
    return data || [];
  },

  async getAllDeals(): Promise<Deal[]> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all deals:', error);
      return [];
    }
    return data || [];
  },

  async getDealById(id: string): Promise<Deal | null> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('deals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  async updateDeal(id: string, updates: Partial<Deal>): Promise<Deal | null> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('deals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating deal:', error);
      return null;
    }
    return data;
  },

  async deleteDeal(id: string): Promise<boolean> {
    const client = checkSupabase();
    const { error } = await client
      .from('deals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting deal:', error);
      return false;
    }
    return true;
  },
};

// Investment Services
export const investmentService = {
  async createInvestment(investmentData: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Investment | null> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('investments')
      .insert([investmentData])
      .select()
      .single();

    if (error) {
      console.error('Error creating investment:', error);
      return null;
    }
    return data;
  },

  async getInvestmentsByInvestor(investorId: string): Promise<Investment[]> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('investments')
      .select('*')
      .eq('investor_id', investorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching investments:', error);
      return [];
    }
    return data || [];
  },

  async getInvestmentsByDeal(dealId: string): Promise<Investment[]> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('investments')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching investments:', error);
      return [];
    }
    return data || [];
  },

  async updateInvestment(id: string, updates: Partial<Investment>): Promise<Investment | null> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('investments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating investment:', error);
      return null;
    }
    return data;
  },
};

// Document Services
export const documentService = {
  async uploadDocument(documentData: Omit<Document, 'id' | 'uploadedAt'>): Promise<Document | null> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('documents')
      .insert([documentData])
      .select()
      .single();

    if (error) {
      console.error('Error uploading document:', error);
      return null;
    }
    return data;
  },

  async getDocumentsByDeal(dealId: string): Promise<Document[]> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('documents')
      .select('*')
      .eq('deal_id', dealId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
    return data || [];
  },

  async deleteDocument(id: string): Promise<boolean> {
    const client = checkSupabase();
    const { error } = await client
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting document:', error);
      return false;
    }
    return true;
  },
};

// Notification Services
export const notificationService = {
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification | null> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('notifications')
      .insert([notificationData])
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }
    return data;
  },

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    return data || [];
  },

  async markNotificationAsRead(id: string): Promise<boolean> {
    const client = checkSupabase();
    const { error } = await client
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    return true;
  },

  async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    const client = checkSupabase();
    const { error } = await client
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
    return true;
  },
};

// Communication Services
export const communicationService = {
  async createCommunication(communicationData: Omit<Communication, 'id' | 'createdAt'>): Promise<Communication | null> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('communications')
      .insert([communicationData])
      .select()
      .single();

    if (error) {
      console.error('Error creating communication:', error);
      return null;
    }
    return data;
  },

  async getCommunicationsByDeal(dealId: string): Promise<Communication[]> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('communications')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching communications:', error);
      return [];
    }
    return data || [];
  },

  async getCommunicationsByUser(userId: string): Promise<Communication[]> {
    const client = checkSupabase();
    const { data, error } = await client
      .from('communications')
      .select('*')
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching communications:', error);
      return [];
    }
    return data || [];
  },

  async markCommunicationAsRead(id: string): Promise<boolean> {
    const client = checkSupabase();
    const { error } = await client
      .from('communications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking communication as read:', error);
      return false;
    }
    return true;
  },
};

