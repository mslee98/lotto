import { useState } from 'react'
import { useRegister } from '../hooks/useAuth'
import { useAuth } from '../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../utils/toast'
import { GuestRoute } from '../components/ProtectedRoute'

const Register = () => {
  const registerMutation = useRegister()
  const { openLoginModal } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone1: '',
    phone2: '',
    phone3: '',
    referralCode: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // 휴대폰번호 조합 함수
  const getFullPhone = () => {
    return `${formData.phone1}${formData.phone2}${formData.phone3}`
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
    if (errors.phone) {
      setErrors(prev => ({
        ...prev,
        phone: ''
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
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let filteredValue = value

    // 이메일과 아이디 필드에서 한글 입력 방지
    if (name === 'email' || name === 'userId') {
      // 한글, 특수문자 제거 (영문, 숫자, @, ., -만 허용)
      filteredValue = value.replace(/[^a-zA-Z0-9@.-]/g, '')
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.'
    } else if (/[가-힣]/.test(formData.email)) {
      newErrors.email = '이메일에는 한글이 포함될 수 없습니다.'
    }

    // ID validation (4-30 characters, lowercase letters and numbers)
    if (!formData.userId) {
      newErrors.userId = '아이디를 입력해주세요.'
    } else if (!/^[a-z0-9]{4,30}$/.test(formData.userId)) {
      newErrors.userId = '4~30자의 영문 소문자, 숫자만 사용 가능합니다.'
    } else if (/[가-힣]/.test(formData.userId)) {
      newErrors.userId = '아이디에는 한글이 포함될 수 없습니다.'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호를 다시 입력해주세요.'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.'
    }

    // Phone validation
    const fullPhone = getFullPhone()
    if (!formData.phone1 || !formData.phone2 || !formData.phone3) {
      newErrors.phone = '휴대폰번호를 모두 입력해주세요.'
    } else if (!/^010\d{4}\d{4}$/.test(fullPhone)) {
      newErrors.phone = '올바른 휴대폰번호 형식을 입력해주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: getFullPhone(),
        referralCode: formData.referralCode
      })
      
      showSuccessToast('회원가입이 완료되었습니다! 이제 로그인해주세요.', 3000)
      // 로그인 모달 열기
    //   openLoginModal()
    
    } catch (error: any) {
      showErrorToast(error.message || '회원가입에 실패했습니다. 다시 시도해주세요.')
      setErrors({ 
        general: error.message || '회원가입에 실패했습니다. 다시 시도해주세요.' 
      })
    }
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
            <span className="text-gray-800 font-medium">회원가입</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl font-bold text-gray-800">회원가입</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
                src="./logo.gif"
              alt="럭키 로또"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">계정정보</h3>
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 <span className="text-red-500">[필수]</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력해주세요"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* User ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    아이디 <span className="text-red-500">[필수]</span>
                  </label>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    placeholder="4~30자의 영문 소문자 숫자"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.userId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.userId && (
                    <p className="mt-1 text-sm text-red-500">{errors.userId}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    비밀번호 <span className="text-red-500">[필수]</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="비밀번호"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    비밀번호 재확인 <span className="text-red-500">[필수]</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="비밀번호 재입력"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">개인정보</h3>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 <span className="text-red-500">[필수]</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="성함"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    휴대폰번호 <span className="text-red-500">[필수]</span>
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
                  <p className="mt-1 text-xs text-gray-500">
                    본인인증 및 당첨시 꼭 필요하므로 정확한 휴대폰 번호를 입력해주세요.
                  </p>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Referral Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    추천인(코드) <span className="text-gray-500">[선택]</span>
                  </label>
                  <input
                    type="text"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleInputChange}
                    placeholder="추천인 코드"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className={`w-full py-4 rounded-lg text-lg font-semibold transition-colors ${
                  registerMutation.isPending
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {registerMutation.isPending ? '회원가입 중...' : '회원가입'}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                이미 계정이 있으신가요?{' '}
                <button 
                  onClick={openLoginModal}
                  className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  로그인하기
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
    </GuestRoute>
  )
}

export default Register
