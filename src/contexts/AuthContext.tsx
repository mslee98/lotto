import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useUser, useLogout } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

interface User {
  id: string
  email: string
  username?: string
  full_name?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isLoginModalOpen: boolean
  openLoginModal: () => void
  closeLoginModal: () => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  
  // React Query 훅 사용
  const { data: user, isLoading, refetch } = useUser()
  const logoutMutation = useLogout()

  // Supabase Auth 상태 변경 감지
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth 상태 변경 감지:', event, session)
        
        if (event === 'SIGNED_OUT') {
          console.log('로그아웃 감지: 사용자 정보 갱신')
          // 로그아웃 시 사용자 정보 강제 갱신
          refetch()
        } else if (event === 'SIGNED_IN' && session?.user) {
          console.log('로그인 감지: 사용자 정보 갱신')
          // 로그인 시 사용자 정보 강제 갱신
          refetch()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [refetch])

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
  }

  const closeLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch (error) {
      console.error('로그아웃 실패:', error)
      throw error
    }
  }

  const value = {
    user: user || null,
    isLoading,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}