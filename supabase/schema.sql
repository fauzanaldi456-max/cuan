-- ============================================
-- Cuanterus Trading Portfolio Database Schema
-- Supabase PostgreSQL Database
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: users (for multi-user support later)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_id TEXT UNIQUE,
  telegram_username TEXT,
  email TEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: balance (RDN account balance)
-- ============================================
CREATE TABLE IF NOT EXISTS balance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'IDR',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- TABLE: holdings (portfolio holdings)
-- ============================================
CREATE TABLE IF NOT EXISTS holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  avg_price DECIMAL(18, 2) NOT NULL,
  current_price DECIMAL(18, 2) NOT NULL,
  lots INTEGER NOT NULL,
  shares INTEGER GENERATED ALWAYS AS (lots * 100) STORED,
  total_value DECIMAL(18, 2) GENERATED ALWAYS AS (current_price * (lots * 100)) STORED,
  pl_amount DECIMAL(18, 2) GENERATED ALWAYS AS ((current_price - avg_price) * (lots * 100)) STORED,
  pl_percent DECIMAL(8, 4) GENERATED ALWAYS AS (((current_price - avg_price) / avg_price) * 100) STORED,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_holdings_user_id ON holdings(user_id);
CREATE INDEX idx_holdings_symbol ON holdings(symbol);

-- ============================================
-- TABLE: transactions (buy, sell, top-up history)
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('BUY', 'SELL', 'TOP_UP', 'WITHDRAW')),
  symbol TEXT,
  amount DECIMAL(18, 2) NOT NULL,
  price DECIMAL(18, 2),
  lots INTEGER,
  payment_method TEXT,
  status TEXT DEFAULT 'SUCCESS' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- ============================================
-- TABLE: history (stock analysis history)
-- ============================================
CREATE TABLE IF NOT EXISTS history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(18, 2) NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  verdict TEXT CHECK (verdict IN ('BULLISH', 'BEARISH', 'TO THE MOON', 'BERDARAH', 'SIDEWAYS')),
  status TEXT,
  
  -- AI Analysis Details
  fundamental_score INTEGER,
  technical_score INTEGER,
  momentum_score INTEGER,
  sentiment_score INTEGER,
  risk_score INTEGER,
  insight TEXT,
  recommendation TEXT,
  
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_history_user_id ON history(user_id);
CREATE INDEX idx_history_symbol ON history(symbol);
CREATE INDEX idx_history_analyzed_at ON history(analyzed_at DESC);

-- ============================================
-- TABLE: settings (user preferences)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, key)
);

-- Index for faster queries
CREATE INDEX idx_settings_user_id ON settings(user_id);

-- ============================================
-- TABLE: webhooks_log (for debugging)
-- ============================================
CREATE TABLE IF NOT EXISTS webhooks_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL, -- 'tradingview', 'telegram', 'frontend', 'n8n'
  event_type TEXT NOT NULL,
  payload JSONB,
  status TEXT DEFAULT 'received',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_webhooks_log_source ON webhooks_log(source);
CREATE INDEX idx_webhooks_log_created_at ON webhooks_log(created_at DESC);

-- ============================================
-- FUNCTIONS: Auto-update timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_holdings_updated_at
  BEFORE UPDATE ON holdings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for balance
CREATE POLICY "Users can view their own balance"
  ON balance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own balance"
  ON balance FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own balance"
  ON balance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for holdings
CREATE POLICY "Users can view their own holdings"
  ON holdings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own holdings"
  ON holdings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own holdings"
  ON holdings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own holdings"
  ON holdings FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for history
CREATE POLICY "Users can view their own history"
  ON history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history"
  ON history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history"
  ON history FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for settings
CREATE POLICY "Users can view their own settings"
  ON settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON settings FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for webhooks_log (admin only)
CREATE POLICY "Service role can access webhooks log"
  ON webhooks_log FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- SEED DATA (untuk testing)
-- ============================================

-- Insert default user (for single-user prototype)
INSERT INTO users (id, telegram_id, telegram_username, full_name, email)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479', -- Fixed UUID for testing
  '123456789',
  '@fauzan_trader',
  'Fauzan Aldi',
  'fauzan@example.com'
) ON CONFLICT DO NOTHING;

-- Insert default balance
INSERT INTO balance (user_id, balance)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  45230000.00
) ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- VIEWS: Convenient queries
-- ============================================

-- Portfolio summary view
CREATE OR REPLACE VIEW portfolio_summary AS
SELECT 
  user_id,
  COUNT(*) as total_holdings,
  SUM(total_value) as total_portfolio_value,
  SUM(pl_amount) as total_pl_amount,
  AVG(pl_percent) as avg_pl_percent
FROM holdings
GROUP BY user_id;

-- Recent transactions view
CREATE OR REPLACE VIEW recent_transactions AS
SELECT 
  t.*,
  u.full_name,
  u.telegram_username
FROM transactions t
JOIN users u ON t.user_id = u.id
ORDER BY t.created_at DESC
LIMIT 50;

-- Recent analysis view
CREATE OR REPLACE VIEW recent_analysis AS
SELECT 
  h.*,
  u.full_name,
  u.telegram_username
FROM history h
JOIN users u ON h.user_id = u.id
ORDER BY h.analyzed_at DESC
LIMIT 50;

-- ============================================
-- COMMENTS (for documentation)
-- ============================================

COMMENT ON TABLE users IS 'User accounts with Telegram integration';
COMMENT ON TABLE balance IS 'RDN account balance for each user';
COMMENT ON TABLE holdings IS 'Portfolio holdings with auto-calculated P/L';
COMMENT ON TABLE transactions IS 'All financial transactions (buy, sell, top-up, withdraw)';
COMMENT ON TABLE history IS 'Stock analysis history with AI scores';
COMMENT ON TABLE settings IS 'User preferences and configuration';
COMMENT ON TABLE webhooks_log IS 'Webhook events log for debugging';

COMMENT ON COLUMN holdings.shares IS 'Auto-calculated: lots * 100';
COMMENT ON COLUMN holdings.total_value IS 'Auto-calculated: current_price * shares';
COMMENT ON COLUMN holdings.pl_amount IS 'Auto-calculated: (current_price - avg_price) * shares';
COMMENT ON COLUMN holdings.pl_percent IS 'Auto-calculated: ((current_price - avg_price) / avg_price) * 100';
