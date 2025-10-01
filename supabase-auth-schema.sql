-- Lucky Lotto Auth & Core Tables for Supabase
-- 복권 대행 구매 사이트 핵심 테이블 스키마

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. AUTH USERS (Supabase Auth 테이블 확장)
-- =============================================
-- Supabase Auth는 자동으로 auth.users 테이블을 생성합니다
-- 이 테이블에는 id, email, encrypted_password, email_confirmed_at 등이 포함됩니다

-- =============================================
-- 2. USER_PROFILES (사용자 프로필 확장)
-- =============================================
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username VARCHAR(30) UNIQUE, -- 사용자 아이디 (4-30자 영문 소문자, 숫자)
  full_name VARCHAR(100) NOT NULL, -- 실명
  phone VARCHAR(20), -- 휴대폰 번호
  birth_date DATE, -- 생년월일
  referral_code VARCHAR(20) UNIQUE, -- 추천인 코드 (자동 생성)
  referred_by VARCHAR(20), -- 추천받은 코드
  avatar_url TEXT, -- 프로필 이미지
  is_verified BOOLEAN DEFAULT FALSE, -- 본인인증 여부
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. WALLETS (지갑/계정 관리)
-- =============================================
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
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
CREATE TABLE public.lottery_games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL, -- 'mega_millions', 'powerball'
  display_name VARCHAR(100) NOT NULL, -- '메가밀리언', '파워볼'
  description TEXT,
  logo_url TEXT,
  price_per_ticket INTEGER NOT NULL, -- 티켓당 가격
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. LOTTERY_DRAWS (복권 추첨 회차)
-- =============================================
CREATE TABLE public.lottery_draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES public.lottery_games(id) ON DELETE CASCADE,
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
CREATE TABLE public.draw_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID REFERENCES public.lottery_draws(id) ON DELETE CASCADE,
  white_balls INTEGER[] NOT NULL, -- 흰색 공 번호들
  mega_ball INTEGER, -- 메가볼/파워볼 번호
  total_winners INTEGER DEFAULT 0, -- 총 당첨자 수
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. TICKETS (복권 티켓)
-- =============================================
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  draw_id UUID REFERENCES public.lottery_draws(id) ON DELETE CASCADE,
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
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'deposit', 'withdrawal', 'purchase', 'prize', 'referral_bonus'
  amount INTEGER NOT NULL, -- 거래 금액
  balance_after INTEGER NOT NULL, -- 거래 후 잔액
  description TEXT,
  status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'cancelled'
  payment_method VARCHAR(20), -- 'bank_transfer', 'credit_card', 'lucky_points'
  payment_reference VARCHAR(100), -- 결제 참조 번호
  related_user_id UUID REFERENCES auth.users(id), -- 관련 사용자 (추천인 보너스 등)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 9. REFERRAL_SYSTEM (추천인 시스템)
-- =============================================
CREATE TABLE public.referral_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- 추천인
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- 피추천인
  referral_code VARCHAR(20) NOT NULL, -- 사용된 추천 코드
  bonus_amount INTEGER DEFAULT 0, -- 지급된 보너스 금액
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referred_id) -- 한 사용자는 한 번만 추천받을 수 있음
);

-- =============================================
-- 10. RECHARGE_OPTIONS (충전 옵션)
-- =============================================
CREATE TABLE public.recharge_options (
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
-- 11. COUPONS (쿠폰)
-- =============================================
CREATE TABLE public.coupons (
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
-- 12. USER_COUPONS (사용자 쿠폰 사용 내역)
-- =============================================
CREATE TABLE public.user_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 13. NOTIFICATIONS (알림)
-- =============================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'info', 'success', 'warning', 'error', 'winning'
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 14. SYSTEM_SETTINGS (시스템 설정)
-- =============================================
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES (인덱스)
-- =============================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_user_profiles_referral_code ON public.user_profiles(referral_code);
CREATE INDEX idx_user_profiles_referred_by ON public.user_profiles(referred_by);

-- Wallets indexes
CREATE INDEX idx_wallets_user_id ON public.wallets(user_id);

-- Tickets indexes
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_draw_id ON public.tickets(draw_id);
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at);
CREATE INDEX idx_tickets_is_winner ON public.tickets(is_winner);

-- Transactions indexes
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

-- Lottery draws indexes
CREATE INDEX idx_lottery_draws_game_id ON public.lottery_draws(game_id);
CREATE INDEX idx_lottery_draws_draw_date ON public.lottery_draws(draw_date);
CREATE INDEX idx_lottery_draws_is_drawn ON public.lottery_draws(is_drawn);

-- Referral system indexes
CREATE INDEX idx_referral_relationships_referrer_id ON public.referral_relationships(referrer_id);
CREATE INDEX idx_referral_relationships_referred_id ON public.referral_relationships(referred_id);
CREATE INDEX idx_referral_relationships_code ON public.referral_relationships(referral_code);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tickets" ON public.tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tickets" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own referrals" ON public.referral_relationships FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can view own coupons" ON public.user_coupons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coupons" ON public.user_coupons FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

-- Public read access for lottery games and draws
CREATE POLICY "Public can view lottery games" ON public.lottery_games FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view lottery draws" ON public.lottery_draws FOR SELECT USING (true);
CREATE POLICY "Public can view draw results" ON public.draw_results FOR SELECT USING (true);
CREATE POLICY "Public can view coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view recharge options" ON public.recharge_options FOR SELECT USING (is_active = true);

-- =============================================
-- FUNCTIONS (함수)
-- =============================================

-- Generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character random code
    new_code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE referral_code = new_code) INTO code_exists;
    
    -- If code doesn't exist, we can use it
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    generate_referral_code()
  );
  
  -- Create wallet for new user
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Process referral bonus
CREATE OR REPLACE FUNCTION process_referral_bonus(
  p_referred_user_id UUID,
  p_referral_code VARCHAR(20)
) RETURNS VOID AS $$
DECLARE
  referrer_user_id UUID;
  bonus_amount INTEGER := 5000; -- 5,000원 보너스
  current_balance INTEGER;
BEGIN
  -- Find referrer by referral code
  SELECT user_id INTO referrer_user_id 
  FROM public.user_profiles 
  WHERE referral_code = p_referral_code;
  
  IF referrer_user_id IS NULL THEN
    RETURN; -- Invalid referral code
  END IF;
  
  -- Check if user was already referred
  IF EXISTS(SELECT 1 FROM public.referral_relationships WHERE referred_id = p_referred_user_id) THEN
    RETURN; -- Already referred
  END IF;
  
  -- Create referral relationship
  INSERT INTO public.referral_relationships (referrer_id, referred_id, referral_code, bonus_amount)
  VALUES (referrer_user_id, p_referred_user_id, p_referral_code, bonus_amount);
  
  -- Update referred user's profile
  UPDATE public.user_profiles 
  SET referred_by = p_referral_code 
  WHERE user_id = p_referred_user_id;
  
  -- Give bonus to referred user
  SELECT balance INTO current_balance FROM public.wallets WHERE user_id = p_referred_user_id;
  UPDATE public.wallets 
  SET balance = balance + bonus_amount 
  WHERE user_id = p_referred_user_id;
  
  -- Record transaction for referred user
  INSERT INTO public.transactions (user_id, type, amount, balance_after, description, related_user_id)
  VALUES (p_referred_user_id, 'referral_bonus', bonus_amount, current_balance + bonus_amount, '추천인 보너스', referrer_user_id);
  
  -- Give bonus to referrer (optional)
  SELECT balance INTO current_balance FROM public.wallets WHERE user_id = referrer_user_id;
  UPDATE public.wallets 
  SET balance = balance + bonus_amount 
  WHERE user_id = referrer_user_id;
  
  -- Record transaction for referrer
  INSERT INTO public.transactions (user_id, type, amount, balance_after, description, related_user_id)
  VALUES (referrer_user_id, 'referral_bonus', bonus_amount, current_balance + bonus_amount, '추천인 보너스', p_referred_user_id);
  
  -- Send notifications
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES 
    (p_referred_user_id, '추천인 보너스 지급', '추천인 보너스 5,000원이 지급되었습니다.', 'success'),
    (referrer_user_id, '추천인 보너스 지급', '추천인 보너스 5,000원이 지급되었습니다.', 'success');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
  SELECT balance INTO current_balance FROM public.wallets WHERE user_id = p_user_id;
  
  -- Update balance based on transaction type
  IF p_transaction_type = 'deposit' OR p_transaction_type = 'prize' OR p_transaction_type = 'referral_bonus' THEN
    UPDATE public.wallets SET balance = balance + p_amount WHERE user_id = p_user_id;
  ELSIF p_transaction_type = 'withdrawal' OR p_transaction_type = 'purchase' THEN
    UPDATE public.wallets SET balance = balance - p_amount WHERE user_id = p_user_id;
  END IF;
  
  -- Insert transaction record
  INSERT INTO public.transactions (user_id, type, amount, balance_after, status)
  VALUES (p_user_id, p_transaction_type, p_amount, current_balance + p_amount, 'completed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS (트리거)
-- =============================================

-- Create user profile after signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INITIAL DATA (초기 데이터)
-- =============================================

-- Insert lottery games
INSERT INTO public.lottery_games (name, display_name, description, price_per_ticket, is_active) VALUES
('mega_millions', '메가밀리언', '미국 메가밀리언 복권', 2000, true),
('powerball', '파워볼', '미국 파워볼 복권', 2500, true);

-- Insert system settings
INSERT INTO public.system_settings (key, value, description) VALUES
('purchase_deadline_hours', '2', '구매 마감 시간 (추첨 전 몇 시간)'),
('min_purchase_amount', '1000', '최소 구매 금액'),
('max_purchase_amount', '1000000', '최대 구매 금액'),
('lucky_points_rate', '0.1', '럭키 포인트 적립률'),
('referral_bonus_amount', '5000', '추천인 보너스 금액'),
('ticket_prices', '{"mega_millions": 2000, "powerball": 2500}', '복권 티켓 가격');

-- Insert sample recharge options
INSERT INTO public.recharge_options (amount, lucky_points, scratch_cards, bonus_percentage, description, game_info) VALUES
(5000, 0, 0, 0, '5,000 캐시', '=파워볼 2게임 가능'),
(12000, 0, 0, 0, '12,000 캐시', '=메가밀리언 6게임 가능'),
(25000, 0, 0, 0, '25,000 캐시', '=파워볼 10게임/메가밀리언 12게임 가능'),
(50000, 0, 0, 0, '50,000 캐시', '=파워볼 20게임'),
(120000, 12000, 0, 10, '120,000 캐시 + 12,000 럭키 포인트(bonus)', '=10% BONUS'),
(300000, 45000, 0, 15, '300,000 캐시 + 45,000 럭키 포인트(bonus)', '=15% BONUS'),
(600000, 120000, 0, 20, '600,000 캐시 + 120,000 럭키 포인트(bonus)', '=20% BONUS');

-- Insert sample coupons
INSERT INTO public.coupons (code, title, description, coupon_type, value, valid_from, valid_until) VALUES
('NEW_MEMBER_30000', '신규회원 무료 30,000포인트 쿠폰', '신규 가입 회원을 위한 무료 포인트 쿠폰입니다.', 'points', 30000, NOW(), NOW() + INTERVAL '1 year'),
('WELCOME_5000', '웰컴 5,000포인트 쿠폰', '첫 구매 시 사용 가능한 웰컴 쿠폰입니다.', 'points', 5000, NOW(), NOW() + INTERVAL '6 months'),
('WEEKEND_BONUS', '주말 보너스 10,000포인트 쿠폰', '주말 구매 시 추가 혜택을 받을 수 있는 쿠폰입니다.', 'points', 10000, NOW(), NOW() + INTERVAL '3 months');
