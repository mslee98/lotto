-- 기존 사용자들의 user_profiles에 email 업데이트
-- auth.users에서 email을 가져와서 user_profiles에 업데이트

UPDATE public.user_profiles 
SET email = auth_users.email
FROM auth.users AS auth_users
WHERE user_profiles.user_id = auth_users.id
AND user_profiles.email IS NULL;

-- 업데이트 결과 확인
SELECT 
  up.username,
  up.email,
  up.full_name,
  up.phone
FROM public.user_profiles up
WHERE up.email IS NOT NULL
ORDER BY up.created_at DESC
LIMIT 10;
