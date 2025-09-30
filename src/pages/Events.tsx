import { useState } from 'react'

interface Coupon {
  id: string
  title: string
  description: string
  expirationDate: string
  isAvailable: boolean
}

const Events = () => {
  const [activeTab, setActiveTab] = useState<'scratch' | 'coupon' | 'attendance'>('coupon')
  const [couponTab, setCouponTab] = useState<'available' | 'myCoupons'>('available')

  const availableCoupons: Coupon[] = [
    {
      id: 'new-member-30000',
      title: '신규회원 무료 30,000포인트 쿠폰',
      description: '신규 가입 회원을 위한 무료 포인트 쿠폰입니다.',
      expirationDate: '2025-09-30',
      isAvailable: true
    },
    {
      id: 'welcome-5000',
      title: '웰컴 5,000포인트 쿠폰',
      description: '첫 구매 시 사용 가능한 웰컴 쿠폰입니다.',
      expirationDate: '2025-10-15',
      isAvailable: true
    },
    {
      id: 'weekend-bonus',
      title: '주말 보너스 10,000포인트 쿠폰',
      description: '주말 구매 시 추가 혜택을 받을 수 있는 쿠폰입니다.',
      expirationDate: '2025-10-31',
      isAvailable: false
    }
  ]

  const myCoupons: Coupon[] = [
    {
      id: 'used-coupon-1',
      title: '신규회원 무료 30,000포인트 쿠폰',
      description: '사용 완료',
      expirationDate: '2025-09-30',
      isAvailable: false
    }
  ]

  const currentCoupons = couponTab === 'available' ? availableCoupons : myCoupons

  return (
    <div className="min-h-screen bg-white">
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
            <span className="text-gray-800 font-medium">이벤트&쿠폰</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6">이벤트</h1>

          {/* Main Tab Navigation */}
          <div className="flex justify-center space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('scratch')}
              className={`px-6 py-3 text-lg font-medium transition-colors relative ${
                activeTab === 'scratch'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              스크래치
              {activeTab === 'scratch' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('coupon')}
              className={`px-6 py-3 text-lg font-medium transition-colors relative ${
                activeTab === 'coupon'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              쿠폰발급
              {activeTab === 'coupon' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-6 py-3 text-lg font-medium transition-colors relative ${
                activeTab === 'attendance'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              출석체크
              {activeTab === 'attendance' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>

          {/* Coupon Sub-tabs */}
          {activeTab === 'coupon' && (
            <div className="flex justify-center space-x-1 mb-6">
              <button
                onClick={() => setCouponTab('available')}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  couponTab === 'available'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                발급가능한 쿠폰
                {couponTab === 'available' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setCouponTab('myCoupons')}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  couponTab === 'myCoupons'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                내 쿠폰함
                {couponTab === 'myCoupons' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'scratch' && (
          <div className="flex justify-center">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">스크래치 게임</h2>
              <p className="text-gray-600 mb-6">곧 출시될 스크래치 게임을 기대해주세요!</p>
              <button className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg cursor-not-allowed">
                준비중
              </button>
            </div>
          </div>
        )}

        {activeTab === 'coupon' && (
          <div className="flex justify-center">
            <div className="space-y-6">
              {currentCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  style={{ width: '500px', height: '150px' }}
                >
                  <div className="flex h-full">
                    {/* Left Side - Coupon Info */}
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {coupon.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        발급 유효기간: {coupon.expirationDate}
                      </p>
                    </div>

                    {/* Right Side - Coupon Visual */}
                    <div className="relative">
                      <img 
                        src="/event_coupon.png" 
                        alt="Coupon" 
                        className="h-full w-auto object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="flex justify-center">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">출석체크</h2>
              <p className="text-gray-600 mb-6">매일 출석하고 포인트를 받아보세요!</p>
              <button className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg cursor-not-allowed">
                준비중
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Events
