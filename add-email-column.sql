-- user_profiles 테이블에 email 컬럼 추가
-- 이미 존재하는 경우 무시

DO $$ 
BEGIN
  -- email 컬럼이 존재하지 않는 경우에만 추가
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD COLUMN email VARCHAR(255);
    
    -- 기존 사용자들의 email을 auth.users에서 가져와서 업데이트
    UPDATE public.user_profiles 
    SET email = auth_users.email
    FROM auth.users AS auth_users
    WHERE user_profiles.user_id = auth_users.id;
    
    RAISE NOTICE 'email 컬럼이 추가되고 기존 데이터가 업데이트되었습니다.';
  ELSE
    RAISE NOTICE 'email 컬럼이 이미 존재합니다.';
  END IF;
END $$;

-- 결과 확인
SELECT 
  username,
  email,
  full_name,
  phone,
  created_at
FROM public.user_profiles 
ORDER BY created_at DESC 
LIMIT 5;
