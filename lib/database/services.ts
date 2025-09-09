import { User, Deal, Investment, Document, Notification, Communication } from '@/types';
import * as mockServices from './mockServices';
import * as productionServices from './productionServices';

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-key';
};

// Use production services if Supabase is configured, otherwise use mock services
const useProductionServices = isSupabaseConfigured();

// Export the appropriate services based on configuration
export const userService = useProductionServices ? productionServices.userService : mockServices.userService;
export const dealService = useProductionServices ? productionServices.dealService : mockServices.dealService;
export const investmentService = useProductionServices ? productionServices.investmentService : mockServices.investmentService;
export const documentService = useProductionServices ? productionServices.documentService : mockServices.documentService;
export const notificationService = useProductionServices ? productionServices.notificationService : mockServices.notificationService;
export const communicationService = useProductionServices ? productionServices.communicationService : mockServices.communicationService;