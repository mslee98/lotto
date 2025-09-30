import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MegaMillionsPurchase = () => {
  const navigate = useNavigate()
  
  // 게임 설정 상태
  const [gameCount, setGameCount] = useState(5)
  const [gameMethod, setGameMethod] = useState<'manual' | 'auto' | 'load'>('manual')
  const [selectedWhiteBalls, setSelectedWhiteBalls] = useState<number[]>([])
  const [selectedMegaBall, setSelectedMegaBall] = useState<number | null>(null)
  const [savedGames, setSavedGames] = useState<Array<{whiteBalls: number[], megaBall: number}>>([])

  // 잔액 정보 (임시 데이터)
  const balance = {
    cash: 0,
    coupons: 0,
    winnings: 0,
    luckyPoints: 0
  }

  const handleWhiteBallSelect = (number: number) => {
    if (selectedWhiteBalls.includes(number)) {
      setSelectedWhiteBalls(selectedWhiteBalls.filter(n => n !== number))
    } else if (selectedWhiteBalls.length < 5) {
      setSelectedWhiteBalls([...selectedWhiteBalls, number])
    }
  }

  const handleMegaBallSelect = (number: number) => {
    setSelectedMegaBall(number)
  }

  const handleAddNumbers = () => {
    if (selectedWhiteBalls.length === 5 && selectedMegaBall) {
      const newGame = {
        whiteBalls: [...selectedWhiteBalls].sort((a, b) => a - b),
        megaBall: selectedMegaBall
      }
      setSavedGames([...savedGames, newGame])
      setSelectedWhiteBalls([])
      setSelectedMegaBall(null)
    }
  }

  const handleReset = () => {
    setSelectedWhiteBalls([])
    setSelectedMegaBall(null)
  }

  const handleGameReset = () => {
    setSavedGames([])
  }

  const handleRemoveGame = (index: number) => {
    setSavedGames(savedGames.filter((_, i) => i !== index))
  }

  const totalAmount = savedGames.length * 12000

  return (
    <div className="min-h-screen bg-white">
      {/* Header Info Widgets */}
      <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-2">
          {/* Jackpot Widget */}
          <div className="bg-blue-50 rounded-lg p-6 shadow-lg border border-blue-200">
            <h3 className="text-blue-700 font-bold text-lg mb-3">메가밀리언 1등 당첨금</h3>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-800 mr-1">₩</span>
              <span className="text-4xl font-bold text-red-600">6,967</span>
              <span className="text-2xl font-bold text-red-600 ml-1">억원</span>
            </div>
            <p className="text-gray-600 text-sm mt-2">$ 497,000,000</p>
          </div>

          {/* Draw Date Widget */}
          <div className="bg-green-50 rounded-lg p-6 shadow-lg border border-green-200">
            <h3 className="text-green-700 font-bold text-lg mb-3">제1619회 추첨일시</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2">KOR</span>
                <span className="text-gray-700">10월 01일 수요일 12:00</span>
              </div>
              <div className="flex items-center">
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full mr-2">USA</span>
                <span className="text-gray-700">09월 30일 화요일 20:00</span>
              </div>
            </div>
          </div>

          {/* Deadline Widget */}
          <div className="bg-red-50 rounded-lg p-6 shadow-lg border border-red-200">
            <h3 className="text-red-700 font-bold text-lg mb-3">마감일시</h3>
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-600 font-bold">남은시간 0일 14시 56분 17초</span>
            </div>
            <p className="text-gray-600 text-sm">10월 01일 (수) 09:00 주문마감 됩니다.</p>
          </div>
        </div>
      </div>

          {/* Banner Image */}
          <div className="max-w-7xl mx-auto px-6 mb-2">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/m-new-img-banner.jpg" 
                alt="메가밀리언 프로모션 배너" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

        {/* Main Content */}
        <div className='py-2 mb-2'>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section - Game Configuration */}
            <div className="bg-green-50 rounded-lg p-6 lg:col-span-2 border border-green-200">
              {/* STEP 01: Game Count Selection */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">
                    STEP 01
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">게임수량 선택</h2>
                </div>
                <div className="flex items-center mb-4">
                  <span className="text-sm text-gray-600">최대100게임</span>
                  <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
               <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                 {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                   <button
                     key={num}
                     onClick={() => setGameCount(num)}
                     className={`px-2 py-2 rounded text-xs font-medium transition-colors ${
                       gameCount === num
                         ? 'bg-blue-600 text-white border-2 border-blue-600'
                         : 'bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50'
                     }`}
                   >
                     {num}게임
                   </button>
                 ))}
               </div>
              </div>

              {/* STEP 02: Game Method Selection */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">
                    STEP 02
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">게임방법 선택</h2>
                  <span className="ml-2 text-lg">👋</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setGameMethod('manual')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      gameMethod === 'manual'
                        ? 'bg-blue-600 text-white border-2 border-blue-600'
                        : 'bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    수동선택
                  </button>
                  <button
                    onClick={() => setGameMethod('auto')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      gameMethod === 'auto'
                        ? 'bg-blue-600 text-white border-2 border-blue-600'
                        : 'bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    전체 자동선택
                  </button>
                  <button
                    onClick={() => setGameMethod('load')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      gameMethod === 'load'
                        ? 'bg-blue-600 text-white border-2 border-blue-600'
                        : 'bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    내 번호 불러오기
                  </button>
                </div>
              </div>

              {/* STEP 03 & 04: Number Selection */}
              <div className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* STEP 03: White Ball Selection */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">
                        STEP 03
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">화이트볼 5개 선택</h2>
                    </div>
                    
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="grid grid-cols-10 gap-2">
                        {Array.from({ length: 70 }, (_, i) => i + 1).map(number => (
                          <button
                            key={number}
                            onClick={() => handleWhiteBallSelect(number)}
                            className={`w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
                              selectedWhiteBalls.includes(number)
                                ? 'bg-blue-600 text-white border-2 border-blue-600'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {number}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* STEP 04: Mega Ball Selection */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">
                        STEP 04
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">메가볼 1개 선택</h2>
                    </div>
                    
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="grid grid-cols-6 gap-2">
                        {Array.from({ length: 24 }, (_, i) => i + 1).map(number => (
                          <button
                            key={number}
                            onClick={() => handleMegaBallSelect(number)}
                            className={`w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
                              selectedMegaBall === number
                                ? 'bg-blue-600 text-white border-2 border-blue-600'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {number}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 bg-white text-blue-600 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  리셋
                </button>
                <button
                  onClick={handleAddNumbers}
                  disabled={selectedWhiteBalls.length !== 5 || !selectedMegaBall}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                    selectedWhiteBalls.length === 5 && selectedMegaBall
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  번호 담기
                </button>
              </div>
            </div>

            {/* Right Section - Game Summary */}
            <div className="bg-blue-600 rounded-lg p-6 text-white shadow-lg">
              {/* Game Summary */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">메가밀리언 게임</h2>
                  <span className="text-blue-200 text-sm">1게임 12000캐시</span>
                </div>
                
                {savedGames.length > 0 ? (
                  <div className="space-y-3">
                    {savedGames.map((game, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-500 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium mr-2">{index + 1}게임</span>
                          {game.whiteBalls.map((ball, ballIndex) => (
                            <div
                              key={ballIndex}
                              className="w-6 h-6 bg-white text-blue-900 rounded-full flex items-center justify-center text-xs font-bold"
                            >
                              {ball}
                            </div>
                          ))}
                          <div className="w-6 h-6 bg-yellow-500 text-blue-900 rounded-full flex items-center justify-center text-xs font-bold">
                            {game.megaBall}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-xs text-blue-200 hover:text-white">재선택</button>
                          <button 
                            onClick={() => handleRemoveGame(index)}
                            className="text-xs text-blue-200 hover:text-white"
                          >
                            수정
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button className="w-full bg-white text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                      내 번호로 저장하기
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-blue-200 py-8">
                    <p>선택한 번호가 없습니다</p>
                    <p className="text-sm">좌측에서 번호를 선택해주세요</p>
                  </div>
                )}
              </div>

              {/* Balance Information */}
              <div className="mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">보유캐시</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{balance.cash.toLocaleString()} P</span>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-400 transition-colors">
                      캐시충전
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">쿠폰</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{balance.coupons}개</span>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-400 transition-colors">
                      쿠폰선택
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">당첨금</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{balance.winnings.toLocaleString()}원 중</span>
                    <input 
                      type="text" 
                      value="0 원" 
                      className="w-16 px-2 py-1 text-xs text-gray-600 rounded border"
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">럭키 포인트</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{balance.luckyPoints} P 중</span>
                    <input 
                      type="text" 
                      value="0 P" 
                      className="w-16 px-2 py-1 text-xs text-gray-600 rounded border"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-blue-500 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">주문금액</span>
                  <span className="text-2xl font-bold text-yellow-400">{totalAmount.toLocaleString()}</span>
                </div>
                
                <button
                  disabled={savedGames.length === 0}
                  className={`w-full py-3 rounded-lg text-lg font-bold transition-colors ${
                    savedGames.length > 0
                      ? 'bg-yellow-500 text-blue-900 hover:bg-yellow-400'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  구매하기
                </button>
                
                <button className="w-full mt-2 text-blue-200 text-sm hover:text-white transition-colors">
                  내가 구매한 번호 확인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Purchase Info Widget */}
       <div className="max-w-7xl mx-auto px-6 py-2">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Section: Purchase Deadline */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mr-2">구매대행 마감시간</h3>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-gray-800 font-medium">
                      당회차 주문 마감시간 <span className="text-blue-600 font-bold">AM 09:00</span>
                    </p>
                    <p className="text-red-500 text-sm mt-2">
                      ※ 추첨이 있는 날 AM 09:00 이후 주문건은 차회차로 구매 됩니다.
                    </p>
                  </div>
                </div>

                {/* Right Section: Scan Confirmation Time */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mr-2">스캔본 확인 가능시간</h3>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-800">00:00~09:00 &gt; 당일 12:00 이전</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-800">09:00~24:00 &gt; 익일 07:00 이후</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      
    </div>
  )
}

export default MegaMillionsPurchase