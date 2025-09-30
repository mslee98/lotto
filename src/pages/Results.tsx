import { useState } from 'react'

interface DrawResult {
  id: string
  drawDate: string
  drawNumber: number
  whiteBalls: number[]
  megaBall: number
  jackpotWon: number
  jackpotUsd: number
  isRollover: boolean
}

const Results = () => {
  const [activeTab, setActiveTab] = useState<'mega' | 'powerball'>('mega')

  // 메가밀리언 당첨 결과 데이터
  const megaMillionsResults: DrawResult[] = [
    {
      id: 'mega-1618',
      drawDate: '2025-09-27',
      drawNumber: 1618,
      whiteBalls: [4, 21, 27, 33, 49],
      megaBall: 21,
      jackpotWon: 665496000000,
      jackpotUsd: 474000000,
      isRollover: true
    },
    {
      id: 'mega-1617',
      drawDate: '2025-09-24',
      drawNumber: 1617,
      whiteBalls: [13, 24, 41, 42, 70],
      megaBall: 18,
      jackpotWon: 633204000000,
      jackpotUsd: 451000000,
      isRollover: false
    },
    {
      id: 'mega-1616',
      drawDate: '2025-09-20',
      drawNumber: 1616,
      whiteBalls: [2, 22, 27, 42, 58],
      megaBall: 8,
      jackpotWon: 593892000000,
      jackpotUsd: 423000000,
      isRollover: true
    },
    {
      id: 'mega-1615',
      drawDate: '2025-09-17',
      drawNumber: 1615,
      whiteBalls: [10, 14, 34, 40, 43],
      megaBall: 5,
      jackpotWon: 561600000000,
      jackpotUsd: 400000000,
      isRollover: false
    },
    {
      id: 'mega-1614',
      drawDate: '2025-09-13',
      drawNumber: 1614,
      whiteBalls: [17, 18, 21, 42, 64],
      megaBall: 7,
      jackpotWon: 534924000000,
      jackpotUsd: 381000000,
      isRollover: true
    },
    {
      id: 'mega-1613',
      drawDate: '2025-09-10',
      drawNumber: 1613,
      whiteBalls: [6, 43, 52, 64, 65],
      megaBall: 22,
      jackpotWon: 502632000000,
      jackpotUsd: 358000000,
      isRollover: true
    }
  ]

  // 파워볼 당첨 결과 데이터 (임시)
  const powerballResults: DrawResult[] = [
    {
      id: 'power-1618',
      drawDate: '2025-09-27',
      drawNumber: 1618,
      whiteBalls: [8, 15, 23, 31, 42],
      megaBall: 12,
      jackpotWon: 445000000000,
      jackpotUsd: 317000000,
      isRollover: true
    },
    {
      id: 'power-1617',
      drawDate: '2025-09-24',
      drawNumber: 1617,
      whiteBalls: [3, 19, 28, 35, 47],
      megaBall: 8,
      jackpotWon: 423000000000,
      jackpotUsd: 301000000,
      isRollover: true
    },
    {
      id: 'power-1616',
      drawDate: '2025-09-20',
      drawNumber: 1616,
      whiteBalls: [12, 25, 33, 41, 56],
      megaBall: 15,
      jackpotWon: 401000000000,
      jackpotUsd: 286000000,
      isRollover: true
    },
    {
      id: 'power-1615',
      drawDate: '2025-09-17',
      drawNumber: 1615,
      whiteBalls: [7, 22, 29, 38, 51],
      megaBall: 3,
      jackpotWon: 379000000000,
      jackpotUsd: 270000000,
      isRollover: false
    },
    {
      id: 'power-1614',
      drawDate: '2025-09-13',
      drawNumber: 1614,
      whiteBalls: [14, 26, 34, 45, 58],
      megaBall: 9,
      jackpotWon: 357000000000,
      jackpotUsd: 255000000,
      isRollover: true
    },
    {
      id: 'power-1613',
      drawDate: '2025-09-10',
      drawNumber: 1613,
      whiteBalls: [5, 18, 32, 44, 59],
      megaBall: 6,
      jackpotWon: 335000000000,
      jackpotUsd: 239000000,
      isRollover: true
    }
  ]

  const currentResults = activeTab === 'mega' ? megaMillionsResults : powerballResults

  const formatJackpot = (amount: number) => {
    return (amount / 100000000).toFixed(0) + '억원'
  }

  const formatUsdJackpot = (amount: number) => {
    return '$' + (amount / 1000000).toFixed(0) + ',000,000'
  }

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
            <span>당첨 결과</span>
            <span>&gt;</span>
            <span className="text-gray-800 font-medium">
              {activeTab === 'mega' ? '메가밀리언' : '파워볼'}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6">당첨 결과</h1>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('mega')}
                className={`px-4 py-2 text-lg font-medium transition-colors relative ${
                  activeTab === 'mega'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                메가밀리언
                {activeTab === 'mega' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('powerball')}
                className={`px-4 py-2 text-lg font-medium transition-colors relative ${
                  activeTab === 'powerball'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                파워볼
                {activeTab === 'powerball' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            </div>

            {/* Official Site Button */}
            <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              {activeTab === 'mega' ? '메가밀리언' : '파워볼'} 공식사이트 &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentResults.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow relative"
            >
              {/* Rollover/Win Flag */}
              <div className="absolute -top-1 -left-2 z-10">
                <div className={`relative w-12 h-6 ${result.isRollover ? 'bg-yellow-300' : 'bg-orange-500'} rounded-full shadow-sm`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xs font-bold ${result.isRollover ? 'text-yellow-800' : 'text-white'}`}>
                      {result.isRollover ? '이월' : '당첨'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Draw Date */}
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  {activeTab === 'mega' ? '메가밀리언' : '파워볼'} 추첨일 {result.drawDate}
                </p>
                
                {/* Game Logo */}
                <div className="flex justify-center mb-4">
                  <img
                    src={activeTab === 'mega' ? '/lotto_logo_mega.png' : '/lotto_logo_power.png'}
                    alt={activeTab === 'mega' ? 'Mega Millions' : 'Powerball'}
                    className="h-8 w-auto"
                  />
                </div>

                {/* Winning Numbers */}
                <div className="flex items-center justify-center space-x-2 mb-4">
                  {result.whiteBalls.map((number, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-800"
                    >
                      {number}
                    </div>
                  ))}
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-800 ml-2">
                    {result.megaBall}
                  </div>
                </div>

                {/* Jackpot Amount */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">
                    {result.drawNumber}회차 1등 당첨금
                  </p>
                  <p className="text-xl font-bold text-gray-800 mb-1">
                    {formatJackpot(result.jackpotWon)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatUsdJackpot(result.jackpotUsd)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Results
