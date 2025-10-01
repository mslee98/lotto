-- 임시로 user_profiles 테이블의 RLS 비활성화 (개발 중에만 사용)
-- 주의: 프로덕션에서는 사용하지 마세요!

-- RLS 비활성화
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- 확인
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'user_profiles';
