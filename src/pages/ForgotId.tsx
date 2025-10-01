import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../utils/toast'
import { GuestRoute } from '../components/ProtectedRoute'
import { auth } from '../lib/supabase'

const ForgotId = () => {
  const { openLoginModal } = useAuth()
  const [activeTab, setActiveTab] = useState<'id' | 'password'>('id')
  const [formData, setFormData] = useState({
    name: '',
    phone1: '',
    phone2: '',
    phone3: '',
    userId: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [foundUserId, setFoundUserId] = useState<string | null>(null)
  const [isPasswordReset, setIsPasswordReset] = useState(false)

  // 휴대폰번호 조합 함수
  const getFullPhone = () => {
    return `${formData.phone1}${formData.phone2}${formData.phone3}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let filteredValue = value

    // 휴대폰번호 필드는 별도 함수로 처리
    if (name.startsWith('phone')) {
      return // handlePhoneInput에서 처리
    }

    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // 휴대폰번호 필드 포커스 이동
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentField: string) => {
    if (e.key === 'Tab') {
      // 탭 키 처리 - 첫 번째 칸에서 탭하면 마지막 칸으로
      if (currentField === 'phone1') {
        e.preventDefault()
        document.getElementById('phone3')?.focus()
      }
      // phone2, phone3에서는 기본 탭 동작 유지
    } else if (e.key === 'Backspace' && e.currentTarget.value === '') {
      // 백스페이스로 이전 필드로 이동
      if (currentField === 'phone2') {
        document.getElementById('phone1')?.focus()
      } else if (currentField === 'phone3') {
        document.getElementById('phone2')?.focus()
      }
    } else if (e.key !== 'Backspace' && e.currentTarget.value.length >= (currentField === 'phone1' ? 3 : 4)) {
      // 다음 필드로 자동 이동
      if (currentField === 'phone1') {
        document.getElementById('phone2')?.focus()
      } else if (currentField === 'phone2') {
        document.getElementById('phone3')?.focus()
      }
    }
  }

  // 휴대폰번호 입력 시 자동 이동 처리
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>, currentField: string) => {
    const { name, value } = e.target
    let filteredValue = value.replace(/[^0-9]/g, '')
    
    // 각 필드별 길이 제한
    if (name === 'phone1' && filteredValue.length > 3) {
      filteredValue = filteredValue.slice(0, 3)
    } else if (name === 'phone2' && filteredValue.length > 4) {
      filteredValue = filteredValue.slice(0, 4)
    } else if (name === 'phone3' && filteredValue.length > 4) {
      filteredValue = filteredValue.slice(0, 4)
    }

    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // 자동 이동 로직
    if (currentField === 'phone1' && filteredValue.length === 3) {
      // 3자리 입력 완료 시 다음 필드로 이동
      setTimeout(() => {
        document.getElementById('phone2')?.focus()
      }, 0)
    } else if (currentField === 'phone2' && filteredValue.length === 4) {
      // 4자리 입력 완료 시 다음 필드로 이동
      setTimeout(() => {
        document.getElementById('phone3')?.focus()
      }, 0)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const fullPhone = getFullPhone()

    if (activeTab === 'id') {
      // 아이디 찾기 검증
      if (!formData.name) {
        newErrors.name = '이름을 입력해주세요.'
      }
      if (!formData.phone1 || !formData.phone2 || !formData.phone3) {
        newErrors.phone = '휴대폰번호를 모두 입력해주세요.'
      } else if (!/^010\d{4}\d{4}$/.test(fullPhone)) {
        newErrors.phone = '올바른 휴대폰번호 형식을 입력해주세요.'
      }
    } else if (isPasswordReset) {
      // 비밀번호 초기화 검증
      if (!formData.email) {
        newErrors.email = '이메일 주소를 입력해주세요.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = '올바른 이메일 형식을 입력해주세요.'
      }
      
      if (!formData.currentPassword) {
        newErrors.currentPassword = '현재 비밀번호를 입력해주세요.'
      }
      
      if (!formData.newPassword) {
        newErrors.newPassword = '새 비밀번호를 입력해주세요.'
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = '비밀번호는 최소 6자 이상이어야 합니다.'
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
      }
    } else {
      // 비밀번호 찾기 검증
      if (!formData.userId) {
        newErrors.userId = '아이디를 입력해주세요.'
      }
      if (!formData.phone1 || !formData.phone2 || !formData.phone3) {
        newErrors.phone = '휴대폰번호를 모두 입력해주세요.'
      } else if (!/^010\d{4}\d{4}$/.test(fullPhone)) {
        newErrors.phone = '올바른 휴대폰번호 형식을 입력해주세요.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('handleSubmit 시작, activeTab:', activeTab, 'isPasswordReset:', isPasswordReset)
    
    if (!validateForm()) {
      console.log('폼 검증 실패')
      return
    }

    setIsLoading(true)
    
    try {
      const fullPhone = getFullPhone()
      console.log('전화번호:', fullPhone)
      
      if (activeTab === 'id') {
        console.log('아이디 찾기 시작')
        // 아이디 찾기
        const { data, error } = await auth.findUserByInfo(undefined, formData.name, fullPhone)
        
        if (error) {
          showErrorToast(error.message || '일치하는 정보를 찾을 수 없습니다. 이름과 휴대폰번호를 확인해주세요.')
          return
        }
        
        if (!data) {
          showErrorToast('일치하는 정보를 찾을 수 없습니다. 이름과 휴대폰번호를 확인해주세요.')
          return
        }
        
        setFoundUserId(data.username)
        showSuccessToast('아이디를 찾았습니다!')
      } else if (isPasswordReset) {
        // 비밀번호 초기화
        if (!formData.email) {
          showErrorToast('이메일 주소를 입력해주세요.')
          return
        }
        
        // 현재 비밀번호로 로그인하여 세션 생성
        console.log('로그인 시도:', formData.email)
        const { data: signInData, error: signInError } = await auth.signIn(formData.email, formData.currentPassword)
        
        if (signInError) {
          console.error('로그인 에러:', signInError)
          showErrorToast('현재 비밀번호가 올바르지 않습니다.')
          return
        }
        
        if (!signInData.user) {
          console.error('사용자 데이터 없음:', signInData)
          showErrorToast('로그인에 실패했습니다.')
          return
        }
        
        console.log('로그인 성공, 비밀번호 업데이트 시도')
        // 로그인된 상태에서 비밀번호 업데이트
        const { error: updateError } = await auth.updatePassword(formData.newPassword)
        
        if (updateError) {
          console.error('비밀번호 업데이트 에러:', updateError)
          showErrorToast('비밀번호 변경에 실패했습니다. 다시 시도해주세요.')
          return
        }
        
        console.log('비밀번호 업데이트 성공')
        
        showSuccessToast('비밀번호가 성공적으로 변경되었습니다!')
        
        // 비밀번호 변경 완료 후 로그아웃
        await auth.signOut()
        
        handleReset()
      } else {
        console.log('비밀번호 찾기 시작, userId:', formData.userId)
        // 비밀번호 찾기 - 사용자 정보 확인
        const { data, error } = await auth.findUserByInfo(formData.userId, undefined, fullPhone)
        
        console.log('비밀번호 찾기 결과:', { data, error })
        
        if (error) {
          console.error('비밀번호 찾기 에러:', error)
          showErrorToast(error.message || '일치하는 정보를 찾을 수 없습니다. 아이디와 휴대폰번호를 확인해주세요.')
          return
        }
        
        if (!data) {
          console.log('사용자 데이터 없음')
          showErrorToast('일치하는 정보를 찾을 수 없습니다. 아이디와 휴대폰번호를 확인해주세요.')
          return
        }
        
        console.log('사용자 정보 확인 성공, email:', (data as any).email)
        
        // 사용자 정보만 저장하고, 비밀번호 변경 시에 이메일을 입력받도록 함
        setIsPasswordReset(true)
        showSuccessToast('사용자 정보가 확인되었습니다. 비밀번호를 변경해주세요.')
      }
    } catch (error: any) {
      showErrorToast('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({ name: '', phone1: '', phone2: '', phone3: '', userId: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '' })
    setErrors({})
    setFoundUserId(null)
    setIsPasswordReset(false)
  }

  return (
    <GuestRoute>
      <div className="min-h-screen">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>홈</span>
              <span>&gt;</span>
              <span className="text-gray-800 font-medium">
                {activeTab === 'id' ? '아이디 찾기' : '비밀번호 찾기'}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl font-bold text-gray-800">
              {activeTab === 'id' ? '아이디 찾기' : '비밀번호 찾기'}
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => {
                setActiveTab('id')
                handleReset()
              }}
              className={`px-6 py-4 text-lg font-semibold border-b-2 transition-colors ${
                activeTab === 'id'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              아이디 찾기
            </button>
            <button
              onClick={() => {
                setActiveTab('password')
                handleReset()
              }}
              className={`px-6 py-4 text-lg font-semibold border-b-2 transition-colors ${
                activeTab === 'password'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              비밀번호 찾기
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-8 text-center">
            {activeTab === 'id' 
              ? '이름, 휴대폰번호로 가입된 정보를 조회하여 아이디 찾기가 가능합니다.'
              : '아이디, 휴대폰번호로 가입된 정보를 조회하여 비밀번호 찾기가 가능합니다.'
            }
          </p>

          {/* Form Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img
                  src="./logo.gif"
                  alt="럭키 로또"
                  className="h-16 w-auto object-contain"
                />
              </div>
              <p className="text-gray-600">꿈과 행복을 드립니다</p>
            </div>

            {!foundUserId && !isPasswordReset ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'id' ? (
                  <>
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        이름
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="이름을 입력해주세요"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        휴대폰번호
                      </label>
                      <div className="flex items-center space-x-1">
                        <input
                          type="tel"
                          id="phone1"
                          name="phone1"
                          value={formData.phone1}
                          onChange={(e) => handlePhoneInput(e, 'phone1')}
                          onKeyDown={(e) => handlePhoneKeyDown(e, 'phone1')}
                          placeholder="010"
                          maxLength={3}
                          className={`w-44 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <span className="text-gray-500 font-medium">-</span>
                        <input
                          type="tel"
                          id="phone2"
                          name="phone2"
                          value={formData.phone2}
                          onChange={(e) => handlePhoneInput(e, 'phone2')}
                          onKeyDown={(e) => handlePhoneKeyDown(e, 'phone2')}
                          placeholder="1234"
                          maxLength={4}
                          className={`w-44 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <span className="text-gray-500 font-medium">-</span>
                        <input
                          type="tel"
                          id="phone3"
                          name="phone3"
                          value={formData.phone3}
                          onChange={(e) => handlePhoneInput(e, 'phone3')}
                          onKeyDown={(e) => handlePhoneKeyDown(e, 'phone3')}
                          placeholder="5678"
                          maxLength={4}
                          className={`w-44 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* User ID Field */}
                    <div>
                      <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                        아이디
                      </label>
                      <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleInputChange}
                        placeholder="아이디를 입력해주세요"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.userId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.userId && (
                        <p className="mt-1 text-sm text-red-500">{errors.userId}</p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        휴대폰번호
                      </label>
                      <div className="flex items-center space-x-1">
                        <input
                          type="tel"
                          id="phone1"
                          name="phone1"
                          value={formData.phone1}
                          onChange={(e) => handlePhoneInput(e, 'phone1')}
                          onKeyDown={(e) => handlePhoneKeyDown(e, 'phone1')}
                          placeholder="010"
                          maxLength={3}
                          className={`w-44 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <span className="text-gray-500 font-medium">-</span>
                        <input
                          type="tel"
                          id="phone2"
                          name="phone2"
                          value={formData.phone2}
                          onChange={(e) => handlePhoneInput(e, 'phone2')}
                          onKeyDown={(e) => handlePhoneKeyDown(e, 'phone2')}
                          placeholder="1234"
                          maxLength={4}
                          className={`w-44 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <span className="text-gray-500 font-medium">-</span>
                        <input
                          type="tel"
                          id="phone3"
                          name="phone3"
                          value={formData.phone3}
                          onChange={(e) => handlePhoneInput(e, 'phone3')}
                          onKeyDown={(e) => handlePhoneKeyDown(e, 'phone3')}
                          placeholder="5678"
                          maxLength={4}
                          className={`w-44 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 rounded-lg text-lg font-semibold transition-colors ${
                      isLoading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isLoading 
                      ? (activeTab === 'id' ? '아이디 찾는 중...' : '비밀번호 변경 중...')
                      : (activeTab === 'id' ? '아이디 찾기' : '비밀번호 변경')
                    }
                  </button>
                </div>
              </form>
            ) : isPasswordReset ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password Reset Form */}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">비밀번호 변경</h3>
                  <p className="text-gray-600">이메일 주소, 현재 비밀번호, 새 비밀번호를 입력해주세요.</p>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 주소
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    placeholder="이메일 주소를 입력해주세요"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Current Password Field */}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    현재 비밀번호
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="현재 비밀번호를 입력해주세요"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
                  )}
                </div>

                {/* New Password Field */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    새 비밀번호
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="새 비밀번호를 입력해주세요 (최소 6자)"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="새 비밀번호를 다시 입력해주세요"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 rounded-lg text-lg font-semibold transition-colors ${
                      isLoading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? '비밀번호 변경 중...' : '비밀번호 변경'}
                  </button>
                </div>

                {/* Back Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPasswordReset(false)
                      setFormData(prev => ({ ...prev, email: '', currentPassword: '', newPassword: '', confirmPassword: '' }))
                    }}
                    className="w-full py-3 rounded-lg text-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    이전으로
                  </button>
                </div>
              </form>
            ) : foundUserId ? (
              <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                {/* Success Message */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">아이디를 찾았습니다!</h3>
                  <p className="text-gray-600 mb-4">가입하신 아이디는 다음과 같습니다.</p>
                  
                  {/* Found User ID */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 mb-1">아이디</p>
                    <p className="text-lg font-mono font-semibold text-gray-800">{foundUserId}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={openLoginModal}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    로그인하기
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    다시 찾기
                  </button>
                </div>
              </div>
            ) : null}

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-700 font-medium">가입된 정보가 조회되지 않는다면?</p>
                  <p className="text-gray-600 mt-1">1:1고객센터으로 문의 주세요!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestRoute>
  )
}

export default ForgotId
