import { useAuth } from '../contexts/AuthContext'
import { useLogout } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { showSuccessToast, showErrorToast } from '../utils/toast'

const MyPage = () => {
  const { user } = useAuth()
  const logoutMutation = useLogout()
  const navigate = useNavigate()

  const handleLogout = async () => {
    // 로그아웃 확인 다이얼로그
    const confirmed = window.confirm('정말 로그아웃하시겠습니까?')
    if (!confirmed) return

    try {
      await logoutMutation.mutateAsync()
      
      showSuccessToast('로그아웃되었습니다!')
      
      // 로그아웃 성공 시 메인 페이지로 리다이렉트
      navigate('/')
    } catch (error) {
      console.error('로그아웃 실패:', error)
      showErrorToast('로그아웃에 실패했습니다. 다시 시도해주세요.')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-600">마이페이지를 보려면 로그인해주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-800">마이페이지</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* User Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">회원 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사용자명</label>
                <p className="text-gray-900">{user.username || '설정되지 않음'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <p className="text-gray-900">{user.full_name || '설정되지 않음'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">회원 ID</label>
                <p className="text-gray-900 text-sm font-mono">{user.id}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">계정 관리</h3>
            <div className="space-y-4">
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  logoutMutation.isPending
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPage
