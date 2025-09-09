-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('borrower', 'investor', 'admin');
CREATE TYPE deal_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'funded');
CREATE TYPE investment_status AS ENUM ('pending', 'approved', 'rejected', 'funded');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');
CREATE TYPE property_type AS ENUM ('single_family', 'multi_family', 'commercial', 'land', 'other');
CREATE TYPE loan_purpose AS ENUM ('purchase', 'refinance', 'construction', 'bridge');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'borrower',
  phone VARCHAR(20),
  company VARCHAR(255),
  experience TEXT,
  avatar_url TEXT,
  is_email_verified BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{"theme": "system", "notifications": {"email": true, "sms": false, "push": true}}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Deals table
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  borrower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_address VARCHAR(255) NOT NULL,
  property_city VARCHAR(100) NOT NULL,
  property_state VARCHAR(50) NOT NULL,
  property_zip VARCHAR(10) NOT NULL,
  property_type property_type NOT NULL,
  purchase_price DECIMAL(15,2) NOT NULL,
  arv DECIMAL(15,2) NOT NULL,
  loan_amount DECIMAL(15,2) NOT NULL,
  loan_purpose loan_purpose NOT NULL,
  timeline INTEGER NOT NULL, -- months
  exit_strategy TEXT NOT NULL,
  borrower_experience TEXT NOT NULL,
  financial_details TEXT NOT NULL,
  status deal_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  funded_at TIMESTAMP WITH TIME ZONE
);

-- Investments table
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  status investment_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  funded_at TIMESTAMP WITH TIME ZONE
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communications table
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_deals_borrower_id ON deals(borrower_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_created_at ON deals(created_at);
CREATE INDEX idx_investments_investor_id ON investments(investor_id);
CREATE INDEX idx_investments_deal_id ON investments(deal_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_documents_deal_id ON documents(deal_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_communications_deal_id ON communications(deal_id);
CREATE INDEX idx_communications_to_user_id ON communications(to_user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Borrowers can view their own deals
CREATE POLICY "Borrowers can view own deals" ON deals FOR SELECT USING (auth.uid() = borrower_id);
CREATE POLICY "Borrowers can create deals" ON deals FOR INSERT WITH CHECK (auth.uid() = borrower_id);
CREATE POLICY "Borrowers can update own deals" ON deals FOR UPDATE USING (auth.uid() = borrower_id);

-- Investors can view all deals
CREATE POLICY "Investors can view all deals" ON deals FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'investor')
);

-- Admins can view and update all deals
CREATE POLICY "Admins can view all deals" ON deals FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all deals" ON deals FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Investment policies
CREATE POLICY "Investors can view own investments" ON investments FOR SELECT USING (auth.uid() = investor_id);
CREATE POLICY "Investors can create investments" ON investments FOR INSERT WITH CHECK (auth.uid() = investor_id);
CREATE POLICY "Borrowers can view investments on their deals" ON investments FOR SELECT USING (
  EXISTS (SELECT 1 FROM deals WHERE id = deal_id AND borrower_id = auth.uid())
);

-- Document policies
CREATE POLICY "Users can view documents on their deals" ON documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM deals WHERE id = deal_id AND borrower_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM investments WHERE deal_id = documents.deal_id AND investor_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can upload documents to their deals" ON documents FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM deals WHERE id = deal_id AND borrower_id = auth.uid())
);

-- Notification policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Communication policies
CREATE POLICY "Users can view communications on their deals" ON communications FOR SELECT USING (
  EXISTS (SELECT 1 FROM deals WHERE id = deal_id AND borrower_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM investments WHERE deal_id = communications.deal_id AND investor_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can create communications on their deals" ON communications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM deals WHERE id = deal_id AND (borrower_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM investments WHERE deal_id = communications.deal_id AND investor_id = auth.uid())))
);

