-- Lucky Lotto Database Schema for Supabase
-- 복권 대행 구매 사이트 데이터베이스 스키마

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USERS (사용자 관리)
-- =============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  birth_date DATE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. USER_PROFILES (사용자 프로필)
-- =============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  preferred_language VARCHAR(10) DEFAULT 'ko',
  notification_settings JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. WALLETS (지갑/계정 관리)
-- =============================================
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0, -- 잔액 (원 단위)
  lucky_points INTEGER DEFAULT 0, -- 럭키 포인트
  total_deposited INTEGER DEFAULT 0, -- 총 입금액
  total_withdrawn INTEGER DEFAULT 0, -- 총 출금액
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. LOTTERY_GAMES (복권 게임 종류)
-- =============================================
CREATE TABLE lottery_games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL, -- 'mega_millions', 'powerball'
  display_name VARCHAR(100) NOT NULL, -- '메가밀리언', '파워볼'
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. LOTTERY_DRAWS (복권 추첨 회차)
-- =============================================
CREATE TABLE lottery_draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES lottery_games(id) ON DELETE CASCADE,
  draw_number INTEGER NOT NULL, -- 회차 번호
  draw_date TIMESTAMP WITH TIME ZONE NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL, -- 구매 마감 시간
  jackpot_amount BIGINT NOT NULL, -- 1등 당첨금 (원)
  jackpot_amount_usd BIGINT, -- 1등 당첨금 (달러)
  is_drawn BOOLEAN DEFAULT FALSE, -- 추첨 완료 여부
  is_rollover BOOLEAN DEFAULT FALSE, -- 이월 여부
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_id, draw_number)
);

-- =============================================
-- 6. DRAW_RESULTS (추첨 결과)
-- =============================================
CREATE TABLE draw_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID REFERENCES lottery_draws(id) ON DELETE CASCADE,
  white_balls INTEGER[] NOT NULL, -- 흰색 공 번호들
  mega_ball INTEGER, -- 메가볼/파워볼 번호
  total_winners INTEGER DEFAULT 0, -- 총 당첨자 수
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. TICKETS (복권 티켓)
-- =============================================
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  draw_id UUID REFERENCES lottery_draws(id) ON DELETE CASCADE,
  ticket_number VARCHAR(20) NOT NULL, -- 티켓 번호
  white_balls INTEGER[] NOT NULL, -- 선택한 흰색 공 번호들
  mega_ball INTEGER, -- 선택한 메가볼/파워볼 번호
  game_method VARCHAR(20) DEFAULT 'manual', -- 'manual', 'auto', 'quick_pick'
  quantity INTEGER DEFAULT 1, -- 게임 수량
  total_price INTEGER NOT NULL, -- 총 구매 가격
  is_winner BOOLEAN DEFAULT FALSE, -- 당첨 여부
  prize_tier INTEGER, -- 당첨 등급 (1등, 2등, 3등...)
  prize_amount BIGINT DEFAULT 0, -- 당첨금액
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 8. TRANSACTIONS (거래 내역)
-- =============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'deposit', 'withdrawal', 'purchase', 'prize'
  amount INTEGER NOT NULL, -- 거래 금액
  balance_after INTEGER NOT NULL, -- 거래 후 잔액
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
  payment_method VARCHAR(20), -- 'bank_transfer', 'credit_card', 'lucky_points'
  payment_reference VARCHAR(100), -- 결제 참조 번호
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 9. COUPONS (쿠폰)
-- =============================================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL, -- 쿠폰 코드
  title VARCHAR(200) NOT NULL, -- 쿠폰 제목
  description TEXT,
  coupon_type VARCHAR(20) NOT NULL, -- 'points', 'discount', 'free_ticket'
  value INTEGER NOT NULL, -- 쿠폰 값 (포인트, 할인액 등)
  min_purchase_amount INTEGER DEFAULT 0, -- 최소 구매 금액
  max_discount_amount INTEGER, -- 최대 할인 금액
  usage_limit INTEGER, -- 사용 제한 횟수
  used_count INTEGER DEFAULT 0, -- 사용된 횟수
  is_active BOOLEAN DEFAULT TRUE,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 10. USER_COUPONS (사용자 쿠폰 사용 내역)
-- =============================================
CREATE TABLE user_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 11. RECHARGE_OPTIONS (충전 옵션)
-- =============================================
CREATE TABLE recharge_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount INTEGER NOT NULL, -- 충전 금액
  lucky_points INTEGER DEFAULT 0, -- 지급되는 럭키 포인트
  scratch_cards INTEGER DEFAULT 0, -- 지급되는 스크래치 카드 수
  bonus_percentage INTEGER DEFAULT 0, -- 보너스 퍼센트
  description TEXT,
  game_info TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 12. ATTENDANCE (출석체크)
-- =============================================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  points_earned INTEGER DEFAULT 0, -- 획득한 포인트
  streak_count INTEGER DEFAULT 1, -- 연속 출석 일수
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, attendance_date)
);

-- =============================================
-- 13. SCRATCH_CARDS (스크래치 카드)
-- =============================================
CREATE TABLE scratch_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  card_type VARCHAR(50) NOT NULL, -- 카드 종류
  is_scratched BOOLEAN DEFAULT FALSE,
  prize_amount INTEGER DEFAULT 0, -- 당첨 금액
  scratched_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 14. NOTIFICATIONS (알림)
-- =============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 15. SYSTEM_SETTINGS (시스템 설정)
-- =============================================
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES (인덱스)
-- =============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Tickets indexes
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_draw_id ON tickets(draw_id);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_tickets_is_winner ON tickets(is_winner);

-- Transactions indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Lottery draws indexes
CREATE INDEX idx_lottery_draws_game_id ON lottery_draws(game_id);
CREATE INDEX idx_lottery_draws_draw_date ON lottery_draws(draw_date);
CREATE INDEX idx_lottery_draws_is_drawn ON lottery_draws(is_drawn);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE scratch_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Similar policies for other user-related tables
CREATE POLICY "Users can view own tickets" ON tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own coupons" ON user_coupons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own attendance" ON attendance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own scratch cards" ON scratch_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- Public read access for lottery games and draws
CREATE POLICY "Public can view lottery games" ON lottery_games FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view lottery draws" ON lottery_draws FOR SELECT USING (true);
CREATE POLICY "Public can view draw results" ON draw_results FOR SELECT USING (true);
CREATE POLICY "Public can view coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view recharge options" ON recharge_options FOR SELECT USING (is_active = true);

-- =============================================
-- FUNCTIONS (함수)
-- =============================================

-- Update wallet balance function
CREATE OR REPLACE FUNCTION update_wallet_balance(
  p_user_id UUID,
  p_amount INTEGER,
  p_transaction_type VARCHAR(20)
) RETURNS VOID AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT balance INTO current_balance FROM wallets WHERE user_id = p_user_id;
  
  -- Update balance based on transaction type
  IF p_transaction_type = 'deposit' OR p_transaction_type = 'prize' THEN
    UPDATE wallets SET balance = balance + p_amount WHERE user_id = p_user_id;
  ELSIF p_transaction_type = 'withdrawal' OR p_transaction_type = 'purchase' THEN
    UPDATE wallets SET balance = balance - p_amount WHERE user_id = p_user_id;
  END IF;
  
  -- Insert transaction record
  INSERT INTO transactions (user_id, type, amount, balance_after, status)
  VALUES (p_user_id, p_transaction_type, p_amount, current_balance + p_amount, 'completed');
END;
$$ LANGUAGE plpgsql;

-- Check lottery ticket winning function
CREATE OR REPLACE FUNCTION check_ticket_winning(
  p_ticket_id UUID
) RETURNS VOID AS $$
DECLARE
  ticket_record RECORD;
  draw_result_record RECORD;
  white_matches INTEGER;
  mega_match BOOLEAN;
  prize_tier INTEGER;
BEGIN
  -- Get ticket information
  SELECT * INTO ticket_record FROM tickets WHERE id = p_ticket_id;
  
  -- Get draw result
  SELECT * INTO draw_result_record FROM draw_results 
  WHERE draw_id = ticket_record.draw_id;
  
  -- Count matching white balls
  SELECT COUNT(*) INTO white_matches
  FROM unnest(ticket_record.white_balls) AS ticket_ball
  WHERE ticket_ball = ANY(draw_result_record.white_balls);
  
  -- Check mega ball match
  mega_match := (ticket_record.mega_ball = draw_result_record.mega_ball);
  
  -- Determine prize tier
  IF white_matches = 5 AND mega_match THEN
    prize_tier := 1; -- 1등
  ELSIF white_matches = 5 THEN
    prize_tier := 2; -- 2등
  ELSIF white_matches = 4 AND mega_match THEN
    prize_tier := 3; -- 3등
  ELSIF white_matches = 4 THEN
    prize_tier := 4; -- 4등
  ELSIF white_matches = 3 AND mega_match THEN
    prize_tier := 5; -- 5등
  ELSIF white_matches = 3 THEN
    prize_tier := 6; -- 6등
  ELSIF white_matches = 2 AND mega_match THEN
    prize_tier := 7; -- 7등
  ELSIF white_matches = 1 AND mega_match THEN
    prize_tier := 8; -- 8등
  ELSIF mega_match THEN
    prize_tier := 9; -- 9등
  ELSE
    prize_tier := 0; -- 미당첨
  END IF;
  
  -- Update ticket with winning information
  UPDATE tickets 
  SET is_winner = (prize_tier > 0),
      prize_tier = prize_tier
  WHERE id = p_ticket_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS (트리거)
-- =============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INITIAL DATA (초기 데이터)
-- =============================================

-- Insert lottery games
INSERT INTO lottery_games (name, display_name, description, is_active) VALUES
('mega_millions', '메가밀리언', '미국 메가밀리언 복권', true),
('powerball', '파워볼', '미국 파워볼 복권', true);

-- Insert system settings
INSERT INTO system_settings (key, value, description) VALUES
('purchase_deadline_hours', '2', '구매 마감 시간 (추첨 전 몇 시간)'),
('min_purchase_amount', '1000', '최소 구매 금액'),
('max_purchase_amount', '1000000', '최대 구매 금액'),
('lucky_points_rate', '0.1', '럭키 포인트 적립률'),
('scratch_card_prize_amounts', '[1000, 5000, 10000, 50000, 100000]', '스크래치 카드 당첨 금액들');

-- Insert sample recharge options
INSERT INTO recharge_options (amount, lucky_points, scratch_cards, bonus_percentage, description, game_info) VALUES
(5000, 0, 0, 0, '5,000 캐시', '=파워볼 1게임 가능'),
(12000, 0, 0, 0, '12,000 캐시', '=메가밀리언 1게임 가능'),
(25000, 0, 0, 0, '25,000 캐시', '=파워볼 5게임/메가밀리언 2게임 가능'),
(30000, 0, 0, 0, '30,000 캐시', '=파워볼 6게임 가능'),
(50000, 0, 0, 0, '50,000 캐시', '=파워볼 10게임'),
(60000, 0, 0, 0, '60,000 캐시', '=메가밀리언 5게임'),
(120000, 12000, 0, 10, '120,000 캐시 + 12,000 럭키 포인트(bonus)', '=10% BONUS'),
(300000, 45000, 0, 15, '300,000 캐시 + 45,000 럭키 포인트(bonus)', '=15% BONUS'),
(600000, 120000, 0, 20, '600,000 캐시 + 120,000 럭키 포인트(bonus)', '=20% BONUS');

-- Insert sample coupons
INSERT INTO coupons (code, title, description, coupon_type, value, valid_from, valid_until) VALUES
('NEW_MEMBER_30000', '신규회원 무료 30,000포인트 쿠폰', '신규 가입 회원을 위한 무료 포인트 쿠폰입니다.', 'points', 30000, NOW(), NOW() + INTERVAL '1 year'),
('WELCOME_5000', '웰컴 5,000포인트 쿠폰', '첫 구매 시 사용 가능한 웰컴 쿠폰입니다.', 'points', 5000, NOW(), NOW() + INTERVAL '6 months'),
('WEEKEND_BONUS', '주말 보너스 10,000포인트 쿠폰', '주말 구매 시 추가 혜택을 받을 수 있는 쿠폰입니다.', 'points', 10000, NOW(), NOW() + INTERVAL '3 months');
