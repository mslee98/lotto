import { type ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
        <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Lucky Lotto
                </h1>
                <p className="text-sm text-gray-500">럭키로또</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors">
                서비스 안내
              </Link>
              <Link to="/mega-millions" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors">
                메가밀리언 구매
              </Link>
              <Link to="/powerball" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors">
                파워볼 구매
              </Link>
              <Link to="/results" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors">
                당첨 결과
              </Link>
              <Link to="/charge" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors">
                캐시 충전
              </Link>
              <Link to="/events" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors">
                이벤트&쿠폰
              </Link>
            </nav>

            {/* Desktop Login/Signup Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                로그인
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                회원가입
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              aria-label="메뉴 열기"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                  서비스 안내
                </Link>
                <Link to="/mega-millions" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                  메가밀리언 구매
                </Link>
                <Link to="/powerball" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                  파워볼 구매
                </Link>
                <Link to="/results" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                  당첨 결과
                </Link>
                <Link to="/charge" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                  캐시 충전
                </Link>
                <Link to="/events" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                  이벤트&쿠폰
                </Link>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <button className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                        로그인
                      </button>
                      <button className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors mt-2">
                        회원가입
                      </button>
                    </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </main>

          {/* Footer */}
          <footer className="bg-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              {/* Top Section - Logo and Navigation */}
              <div className="flex justify-between items-start mb-6">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">L</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Lucky Lotto</h3>
                    <p className="text-sm text-gray-500">럭키로또</p>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-wrap gap-6">
                  <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">서비스안내</a>
                  <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">개인정보처리방침</a>
                  <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">이용약관</a>
                  <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">1:1문의</a>
                  <a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">고객센터</a>
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>와이제이하이테크 대표이사 : 이동근 서울 강남구 테헤란로 123</p>
                <p>사업자등록번호: 875-81-02965</p>
                <p>통신판매등록번호 : 제2023-서울강남-03548호</p>
                <p>서비스 및 제휴문의 E-MAIL: support@luckylottokorea.co.kr</p>
              </div>

              {/* Disclaimers */}
              <div className="space-y-1 text-sm text-red-600 mb-4">
                <p>19세 미만 청소년은 복권을 구매하거나 당첨금을 수령할 수 없습니다.</p>
                <p>과도한 복권 구매는 사행성 중독으로 인한 경제적 부담을 불러 올 수 있습니다.</p>
              </div>

              {/* Copyright */}
              <div>
                <p className="text-gray-600 text-sm">COPYRIGHT © MELOKO ALL RIGHTS RESERVED.</p>
              </div>
            </div>
          </footer>
    </div>
  )
}

export default Layout
