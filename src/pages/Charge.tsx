import { useState, useRef } from 'react'

interface RechargeOption {
  id: string
  amount: number
  luckyPoints: number
  scratchCards: number
  bonus: string
  description: string
  gameInfo: string
}

const Charge = () => {
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'card'>('bank')
  const [selectedOption, setSelectedOption] = useState<string>('120000')
  const paymentButtonRef = useRef<HTMLDivElement>(null)

  const bankRechargeOptions: RechargeOption[] = [
    {
      id: '600000',
      amount: 600000,
      luckyPoints: 180000,
      scratchCards: 3,
      bonus: '30% BONUS',
      description: '600,000 캐시 + 180,000 럭키 포인트(bonus)',
      gameInfo: '=30% BONUS + 럭키 스크래치 3장'
    },
    {
      id: '300000',
      amount: 300000,
      luckyPoints: 60000,
      scratchCards: 2,
      bonus: '20% BONUS',
      description: '300,000 캐시 + 60,000 럭키 포인트(bonus)',
      gameInfo: '=20% BONUS + 럭키 스크래치 2장'
    },
    {
      id: '120000',
      amount: 120000,
      luckyPoints: 12000,
      scratchCards: 2,
      bonus: '10% BONUS',
      description: '120,000 캐시 + 12,000 럭키 포인트(bonus)',
      gameInfo: '=10% BONUS 가능 + 럭키 스크래치 2장'
    },
    {
      id: '60000',
      amount: 60000,
      luckyPoints: 6000,
      scratchCards: 0,
      bonus: '10% BONUS',
      description: '60,000 캐시 + 6,000 럭키 포인트(bonus)',
      gameInfo: '= 메가밀리언5게임 가능'
    },
    {
      id: '50000',
      amount: 50000,
      luckyPoints: 5000,
      scratchCards: 1,
      bonus: '10% BONUS',
      description: '50,000 캐시 + 5,000 럭키 포인트(bonus)',
      gameInfo: '=파워볼 10게임 가능 + 럭키 스크래치 1장'
    },
    {
      id: '25000',
      amount: 25000,
      luckyPoints: 0,
      scratchCards: 0,
      bonus: '0% BONUS',
      description: '25,000 캐시',
      gameInfo: '=메가밀리언 2게임/파워볼 5게임 가능'
    },
    {
      id: '15000',
      amount: 15000,
      luckyPoints: 0,
      scratchCards: 0,
      bonus: '0% BONUS',
      description: '15,000 캐시',
      gameInfo: '= 파워볼3게임 가능'
    },
    {
      id: '12000',
      amount: 12000,
      luckyPoints: 0,
      scratchCards: 0,
      bonus: '0% BONUS',
      description: '12,000 캐시',
      gameInfo: '= 메가밀리언 1게임 가능'
    },
    {
      id: '5000',
      amount: 5000,
      luckyPoints: 0,
      scratchCards: 0,
      bonus: '0% BONUS',
      description: '5,000 캐시',
      gameInfo: '=파워볼 1게임 가능'
    }
  ]

  const cardRechargeOptions: RechargeOption[] = [
    {
      id: '600000',
      amount: 600000,
      luckyPoints: 120000,
      scratchCards: 0,
      bonus: '20% BONUS',
      description: '600,000 캐시 + 120,000 럭키 포인트(bonus)',
      gameInfo: '=20% BONUS'
    },
    {
      id: '300000',
      amount: 300000,
      luckyPoints: 45000,
      scratchCards: 0,
      bonus: '15% BONUS',
      description: '300,000 캐시 + 45,000 럭키 포인트(bonus)',
      gameInfo: '=15% BONUS'
    },
    {
      id: '120000',
      amount: 120000,
      luckyPoints: 12000,
      scratchCards: 0,
      bonus: '10% BONUS',
      description: '120,000 캐시 + 12,000 럭키 포인트(bonus)',
      gameInfo: '=10% BONUS'
    },
    {
      id: '60000',
      amount: 60000,
      luckyPoints: 0,
      scratchCards: 0,
      bonus: '0% BONUS',
      description: '60,000 캐시',
      gameInfo: '=메가밀리언 5게임'
    },
    {
      id: '50000',
      amount: 50000,
      luckyPoints: 0,
      scratchCards: 0,
      bonus: '0% BONUS',
      description: '50,000 캐시',
      gameInfo: '=파워볼 10게임'
    },
    {
      id: '30000',
      amount: 30000,
      luckyPoints: 0,
      scratchCards: 0,
      bonus: '0% BONUS',
      description: '30,000 캐시',
      gameInfo: '=파워볼 6게임 가능'
    },
    {
      id: '25000',
      amount: 25000,
      luckyPoints: 0,
      scratchCards: 0,
      bonus: '0% BONUS',
      description: '25,000 캐시',
      gameInfo: '=파워볼 5게임/메가밀리언 2게임 가능'
    },
    {
      id: '12000',
      amount: 12000,
      luckyPoints: 0,
      scratchCards: 0,
      bonus: '0% BONUS',
      description: '12,000 캐시',
      gameInfo: '=메가밀리언 1게임 가능'
    },
    {
      id: '5000',
      amount: 5000,
      luckyPoints: 0,
      scratchCards: 0,
      bonus: '0% BONUS',
      description: '5,000 캐시',
      gameInfo: '=파워볼 1게임 가능'
    }
  ]

  const currentOptions = paymentMethod === 'bank' ? bankRechargeOptions : cardRechargeOptions

  const formatAmount = (amount: number) => {
    return amount.toLocaleString() + '원'
  }

  const formatPoints = (points: number) => {
    return points.toLocaleString() + 'P'
  }

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
    // 결제하기 버튼으로 스크롤
    setTimeout(() => {
      paymentButtonRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }, 100)
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
            <span className="text-gray-800 font-medium">캐시 충전</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6">캐시 충전</h1>

          {/* Payment Method Tabs */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setPaymentMethod('bank')}
              className={`px-6 py-3 text-lg font-medium transition-colors relative ${
                paymentMethod === 'bank'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              계좌이체
              {paymentMethod === 'bank' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`px-6 py-3 text-lg font-medium transition-colors relative ${
                paymentMethod === 'card'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              신용카드
              {paymentMethod === 'card' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>

          {/* Instruction */}
          <div className="flex items-center space-x-2 text-gray-600 mb-6">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p>충전할 금액을 선택해 주세요.</p>
          </div>
        </div>
      </div>

      {/* Recharge Options */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-2">
          {currentOptions.map((option) => (
            <div
              key={option.id}
              className={`bg-white border rounded-lg p-4 cursor-pointer transition-all ${
                selectedOption === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleOptionSelect(option.id)}
            >
              <div className="flex items-start justify-between">
                {/* Left Side - Amount and Benefits */}
                <div className="flex-1 mr-6">
                  <h3 className="text-xl font-bold text-red-600 mb-3">
                    {formatAmount(option.amount)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {option.luckyPoints > 0 && (
                      <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
                        럭키 포인트 {formatPoints(option.luckyPoints)}
                      </div>
                    )}
                    {option.scratchCards > 0 && (
                      <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
                        럭키 스크래치 {option.scratchCards}장
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Description and Checkbox */}
                <div className="flex items-start justify-between flex-1">
                  <div className="text-sm text-gray-600 flex-1 mr-4">
                    <p className="mb-1">{option.description}</p>
                    <p className="text-blue-600 font-medium">{option.gameInfo}</p>
                  </div>
                  
                  {/* Checkbox */}
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedOption === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedOption === option.id && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Summary */}
        {selectedOption && (
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">결제상품</span>
                <span className="font-bold text-gray-800">
                  {formatAmount(currentOptions.find(opt => opt.id === selectedOption)?.amount || 0)}캐시
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">입금금액</span>
                <span className="font-bold text-gray-800">
                  {formatAmount(Math.round((currentOptions.find(opt => opt.id === selectedOption)?.amount || 0) * 1.1))}원 (VAT포함)
                </span>
              </div>
              <p className="text-sm text-gray-500">
                입금금액과 입금자명이 일치해야 실시간으로 충전이 완료됩니다.
              </p>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <div ref={paymentButtonRef} className="mt-8 text-center">
          <button
            disabled={!selectedOption}
            className={`w-full py-4 rounded-lg text-xl font-bold transition-colors ${
              selectedOption
                ? 'bg-yellow-500 text-gray-800 hover:bg-yellow-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default Charge
