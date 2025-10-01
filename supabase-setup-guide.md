# Supabase 설정 가이드

## 1. Supabase 대시보드에서 스키마 확인

### 테이블 존재 확인
1. Supabase 대시보드 → Table Editor
2. 다음 테이블들이 있는지 확인:
   - `user_profiles`
   - `wallets`
   - `referral_relationships`
   - `lottery_games`
   - `tickets`
   - `transactions`

### RLS 정책 확인
1. Supabase 대시보드 → Authentication → Policies
2. `user_profiles` 테이블에 RLS 정책이 있는지 확인

## 2. 수동으로 스키마 적용 (필요시)

### SQL Editor에서 실행
```sql
-- 1. user_profiles 테이블 생성
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username VARCHAR(30) UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  birth_date DATE,
  referral_code VARCHAR(20) UNIQUE,
  referred_by VARCHAR(20),
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. wallets 테이블 생성
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance INTEGER DEFAULT 0,
  lucky_points INTEGER DEFAULT 0,
  total_deposited INTEGER DEFAULT 0,
  total_withdrawn INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS 활성화
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 생성
CREATE POLICY "Users can view own profile" ON public.user_profiles 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own wallet" ON public.wallets 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet" ON public.wallets 
FOR UPDATE USING (auth.uid() = user_id);

-- 5. 트리거 함수 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 트리거 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 3. 테스트 방법

### 회원가입 테스트
1. 회원가입 페이지에서 테스트 계정 생성
2. Supabase 대시보드 → Table Editor → `user_profiles` 확인
3. 데이터가 정상적으로 삽입되었는지 확인

### 수동 데이터 삽입 (테스트용)
```sql
-- 기존 사용자에 대해 수동으로 프로필 생성
INSERT INTO public.user_profiles (user_id, username, full_name, phone)
SELECT 
  id,
  'testuser',
  '테스트 사용자',
  '010-1234-5678'
FROM auth.users 
WHERE email = 'test@example.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_profiles WHERE user_id = auth.users.id
);
```

## 4. 문제 해결

### 트리거가 작동하지 않는 경우
- Supabase 대시보드 → Database → Functions에서 `handle_new_user` 함수 확인
- 트리거가 제대로 생성되었는지 확인

### RLS 정책 문제
- Supabase 대시보드 → Authentication → Policies에서 정책 확인
- 사용자 권한 확인

### 수동 프로필 생성
- 위의 코드를 사용하여 기존 사용자에 대해 수동으로 프로필 생성
