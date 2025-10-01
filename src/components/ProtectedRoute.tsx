import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { showSuccessToast } from '../utils/toast'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  message?: string
}

// 로그인한 사용자만 접근 가능한 라우트
export const ProtectedRoute = ({ 
  children, 
  redirectTo = '/', 
  message = '이미 로그인되어 있습니다.' 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && user) {
      showSuccessToast(message)
      navigate(redirectTo)
    }
  }, [user, isLoading, navigate, redirectTo, message])

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 로그인한 사용자는 리다이렉트
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">메인 페이지로 이동 중...</p>
        </div>
      </div>
    )
  }

  // 로그인하지 않은 사용자만 접근 가능
  return <>{children}</>
}

// 로그인하지 않은 사용자만 접근 가능한 라우트 (회원가입 페이지용)
export const GuestRoute = ({ 
  children, 
  redirectTo = '/', 
  message = '이미 로그인되어 있습니다.' 
}: ProtectedRouteProps) => {
  return (
    <ProtectedRoute redirectTo={redirectTo} message={message}>
      {children}
    </ProtectedRoute>
  )
}
