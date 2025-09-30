import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MegaMillionsPurchase = () => {
  const navigate = useNavigate()
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [selectedMegaBall, setSelectedMegaBall] = useState<number | null>(null)

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number))
    } else if (selectedNumbers.length < 5) {
      setSelectedNumbers([...selectedNumbers, number])
    }
  }

  const handleMegaBallSelect = (number: number) => {
    setSelectedMegaBall(number)
  }

  const handleQuickPick = () => {
    // 1-70에서 5개 랜덤 선택
    const numbers: number[] = []
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 70) + 1
      if (!numbers.includes(num)) {
        numbers.push(num)
      }
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b))
    
    // 1-25에서 1개 랜덤 선택
    setSelectedMegaBall(Math.floor(Math.random() * 25) + 1)
  }

  const handleClear = () => {
    setSelectedNumbers([])
    setSelectedMegaBall(null)
  }

  const isPurchaseEnabled = selectedNumbers.length === 5 && selectedMegaBall !== null

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>뒤로가기</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <img
            src="./lotto_logo_mega.png"
            alt="Mega Millions"
            className="h-12 w-auto object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-800">메가밀리언 구매</h1>
        </div>
        
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Game Info */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">1619회차 메가밀리언</h2>
          <p className="text-gray-600 mb-4">추첨일: 10월 01일 수요일 오후 12시</p>
          <div className="flex items-baseline justify-center">
            <span className="text-2xl font-bold text-gray-800 mr-1">₩</span>
            <p className="text-4xl font-bold text-gray-800">6,982억원</p>
          </div>
        </div>
      </div>

      {/* Number Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Numbers (1-70) */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            메인 번호 선택 (5개)
          </h3>
          <div className="grid grid-cols-10 gap-2 mb-4">
            {Array.from({ length: 70 }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => handleNumberSelect(number)}
                className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors ${
                  selectedNumbers.includes(number)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {number}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            선택된 번호: {selectedNumbers.length}/5
          </p>
        </div>

        {/* Mega Ball (1-25) */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            메가볼 선택 (1개)
          </h3>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {Array.from({ length: 25 }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => handleMegaBallSelect(number)}
                className={`w-12 h-12 rounded-full text-sm font-semibold transition-colors ${
                  selectedMegaBall === number
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {number}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            선택된 메가볼: {selectedMegaBall || '없음'}
          </p>
        </div>
      </div>

      {/* Selected Numbers Display */}
      {(selectedNumbers.length > 0 || selectedMegaBall) && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">선택된 번호</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">메인 번호:</span>
              <div className="flex space-x-2">
                {selectedNumbers.map(number => (
                  <div
                    key={number}
                    className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold"
                  >
                    {number}
                  </div>
                ))}
              </div>
            </div>
            {selectedMegaBall && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">메가볼:</span>
                <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {selectedMegaBall}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={handleQuickPick}
          className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          빠른 선택
        </button>
        <button
          onClick={handleClear}
          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          초기화
        </button>
        <button
          disabled={!isPurchaseEnabled}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
            isPurchaseEnabled
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          구매하기
        </button>
      </div>

      {/* Purchase Info */}
      <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">구매 안내</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 메인 번호 5개와 메가볼 1개를 선택해주세요</li>
          <li>• 1회 구매 시 1,000원입니다</li>
          <li>• 추첨은 매주 화요일과 금요일 오후 12시에 진행됩니다</li>
          <li>• 당첨금은 세금 공제 후 지급됩니다</li>
        </ul>
      </div>
    </div>
  )
}

export default MegaMillionsPurchase
