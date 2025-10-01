import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

interface User {
  id: string
  email: string
  username?: string
  full_name?: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
  referralCode?: string
}

// 현재 사용자 정보 조회
export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null
      
      const userMetadata = user.user_metadata
      return {
        id: user.id,
        email: user.email || '',
        username: userMetadata?.username || null,
        full_name: userMetadata?.full_name || null
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
  })
}

// 로그인
export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        // 오류 메시지를 한글로 번역
        let errorMessage = error.message
        if (error.message === 'Invalid login credentials') {
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.'
        } else if (error.message === 'Email not confirmed') {
          errorMessage = '이메일 인증이 필요합니다. 이메일을 확인해주세요.'
        } else if (error.message === 'Too many requests') {
          errorMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.'
        } else if (error.message.includes('Invalid email')) {
          errorMessage = '올바른 이메일 형식을 입력해주세요.'
        }
        
        throw new Error(errorMessage)
      }

      return data
    },
    onSuccess: () => {
      // 로그인 성공 시 사용자 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

// 회원가입
export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (registerData: RegisterData) => {
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            full_name: registerData.name,
            phone: registerData.phone,
            username: registerData.email.split('@')[0], // 이메일에서 사용자명 추출
            referred_by: registerData.referralCode || null
          }
        }
      })

      if (error) {
        // 오류 메시지를 한글로 번역
        let errorMessage = error.message
        if (error.message === 'User already registered') {
          errorMessage = '이미 등록된 이메일입니다.'
        } else if (error.message === 'Password should be at least 6 characters') {
          errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.'
        } else if (error.message === 'Invalid email') {
          errorMessage = '올바른 이메일 형식을 입력해주세요.'
        } else if (error.message.includes('already registered')) {
          errorMessage = '이미 등록된 이메일입니다.'
        }
        
        throw new Error(errorMessage)
      }

      // user_profiles 테이블에 수동으로 데이터 추가
      if (data.user) {
        console.log('프로필 생성 시작, user_id:', data.user.id)
        try {
          const profileData = {
            user_id: data.user.id,
            username: registerData.email.split('@')[0],
            full_name: registerData.name,
            phone: registerData.phone,
            referred_by: registerData.referralCode || null
          }
          
          console.log('프로필 데이터:', profileData)
          
          const { data: profileResult, error: profileError } = await supabase
            .from('user_profiles')
            .insert(profileData)
            .select()

          if (profileError) {
            console.error('프로필 생성 오류:', profileError)
            // 프로필 생성 실패해도 회원가입은 성공으로 처리
          } else {
            console.log('프로필 생성 성공:', profileResult)
          }
        } catch (profileError) {
          console.error('프로필 생성 실패:', profileError)
        }
      } else {
        console.log('data.user가 없음:', data)
      }

      return data
    },
    onSuccess: () => {
      // 회원가입 성공 시 사용자 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

// 로그아웃
export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      // 로그아웃 성공 시 사용자 관련 캐시만 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['auth-state'] })
      
      // 사용자 관련 모든 쿼리 제거
      queryClient.removeQueries({ queryKey: ['user'] })
      queryClient.removeQueries({ queryKey: ['auth-state'] })
      
      console.log('로그아웃 성공: 캐시 무효화 완료')
    },
    onError: (error) => {
      console.error('로그아웃 실패:', error)
    }
  })
}

// 인증 상태 변경 감지
export const useAuthState = () => {
  return useQuery({
    queryKey: ['auth-state'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    },
    staleTime: 0, // 항상 최신 상태 확인
  })
}
