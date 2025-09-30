import { useState } from 'react'
import { Link } from 'react-router-dom'

const Main = () => {
  const handleMegaPurchase = () => {
    console.log('메가밀리언 구매 버튼 클릭됨')
  }

  const handlePowerballPurchase = () => {
    console.log('파워볼 구매하기 클릭됨')
  }

  const handlePrizeInfo = (type: string) => {
    console.log(`${type} 당첨금 안내 클릭됨`)
  }

  const handleServiceClick = (service: string) => {
    console.log(`${service} 클릭됨`)
  }

  const handleQuickAction = (action: string) => {
    console.log(`${action} 클릭됨`)
  }

  // LotteryGameCard 컴포넌트
  const LotteryGameCard = ({
    gameType,
    logo,
    title,
    drawDate,
    drawTime,
    jackpot,
    jackpotAmount,
    previousNumbers,
    bonusNumber,
    countdown,
    onPurchase,
    onPrizeInfo
  }: {
    gameType: 'mega' | 'powerball'
    logo: string
    title: string
    drawDate: string
    drawTime: string
    jackpot: string
    jackpotAmount: string
    previousNumbers: number[]
    bonusNumber: number
    countdown: string
    onPurchase: () => void
    onPrizeInfo: () => void
  }) => {
    const isMega = gameType === 'mega'
    
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 h-full flex flex-col">
        {/* Game Logo and Data */}
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <img
              src={logo}
              alt={isMega ? 'Mega Millions' : 'Powerball'}
              className="h-8 w-auto object-contain mr-4"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-800 block">{title}</span>
              <p className="text-xs text-gray-600">{drawDate} {drawTime}</p>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-200 mb-4"></div>

        {/* Jackpot Title */}
        <div className="mb-2">
          <span className="text-sm text-gray-600">{jackpot.split(' ')[0]}</span>
          <p className="text-sm text-gray-600">{jackpot.split(' ').slice(1).join(' ')}</p>
        </div>

        {/* Jackpot Amount */}
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-800 mr-1">₩</span>
            <p className="text-4xl font-bold text-gray-800">{jackpotAmount}</p>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-200 mb-4"></div>

        {/* Previous Numbers Title */}
        <div className="mb-3">
          <span className="text-sm text-gray-600">직전회차 당첨번호</span>
          <p className="text-sm text-gray-600">이월</p>
        </div>

        {/* Previous Numbers */}
        <div className="mb-8 flex-1">
          <div className="flex items-center justify-center space-x-2">
            {previousNumbers.map((number, index) => (
              <div
                key={index}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold"
              >
                {number}
              </div>
            ))}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
                isMega ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            >
              {bonusNumber}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={onPrizeInfo}
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <p>당첨금안내</p>
          </button>
            {isMega ? (
              <Link
                to="/mega-millions"
                className="flex-1 px-3 py-2 rounded text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 text-center"
              >
                <p>메가밀리언 주문하기</p>
              </Link>
            ) : (
              <button
                onClick={onPurchase}
                className="flex-1 px-3 py-2 rounded text-sm font-medium text-white transition-colors bg-red-600 hover:bg-red-700"
              >
                <p>파워볼 주문하기</p>
              </button>
            )}
        </div>

        {/* Countdown */}
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-600">
            {countdown.split(' : ')[0]} : 
          </span>
          <span className="text-sm font-bold text-red-600">
            {countdown.split(' : ')[1]}
          </span>
        </div>
      </div>
    )
  }

  // ServiceCard 컴포넌트
  const ServiceCard = ({
    title,
    description,
    iconIndex,
    color,
    onClick
  }: {
    title: string
    description: string
    iconIndex: number
    color: 'blue' | 'sky' | 'pink' | 'yellow' | 'orange'
    onClick: () => void
  }) => {
    const colorClasses = {
      blue: 'bg-cyan-800 text-white',
      sky: 'bg-cyan-600 text-white',
      pink: 'bg-red-200 text-gray-800',
      yellow: 'bg-orange-300 text-gray-800',
      orange: 'bg-amber-300 text-gray-800'
    }

    return (
      <button
        onClick={onClick}
        className={`w-full p-6 rounded-2xl transition-all duration-200 text-left hover:shadow-lg hover:scale-105 ${colorClasses[color]}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-sm opacity-90" dangerouslySetInnerHTML={{ __html: description }}></p>
          </div>
          <div
            className={`${iconIndex === 0 ? 'w-16 h-16' : 'w-12 h-12'} flex-shrink-0 ml-4`}
            style={{
              backgroundImage: 'url(/icon_supoort.png)',
              backgroundPosition: `0px -${iconIndex * 48}px`,
              backgroundSize: iconIndex === 0 ? '64px 240px' : '48px 240px',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </div>
      </button>
    )
  }

  // GuideSection 컴포넌트
  const GuideSection = () => {
    const [activeTab, setActiveTab] = useState<'purchase' | 'winning'>('purchase')

    const purchaseSteps = [
      { id: 1, name: '회원가입', icon: './guide_01.png' },
      { id: 2, name: '캐시충전', icon: './guide_02.png' },
      { id: 3, name: '게임주문', icon: './guide_03.png' },
      { id: 4, name: '실물로또구매', icon: './guide_04.png' },
      { id: 5, name: '스캔/업로드', icon: './guide_05.png' },
      { id: 6, name: '번호확인', icon: './guide_06.png' },
      { id: 7, name: '추첨', icon: './guide_07.png' },
      { id: 8, name: '당첨확인', icon: './guide_08.png' }
    ]

    const winningSteps = [
      { id: 1, name: '추첨', icon: './guide_07.png' },
      { id: 2, name: '당첨확인', icon: './guide_08.png' },
      { id: 3, name: '당첨사실알림', icon: './guide2_03.png' },
      { id: 4, name: '공증서류작성', icon: './guide2_04.png' },
      { id: 5, name: '스케줄협의', icon: './guide2_05.png' },
      { id: 6, name: '미국방문', icon: './guide2_06.png' },
      { id: 7, name: '당첨금수령', icon: './guide2_07.png' }
    ]

    const currentSteps = activeTab === 'purchase' ? purchaseSteps : winningSteps

    return (
      <div className="mt-12">
        {/* Guide Title */}
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mr-2">럭키로또 가이드</h2>
          <span className="text-yellow-500 text-xl">👆</span>
        </div>

        {/* Guide Tabs */}
        <div className="flex space-x-2 mb-8">
          <button 
            onClick={() => setActiveTab('purchase')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'purchase' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            구매가이드
          </button>
          <button 
            onClick={() => setActiveTab('winning')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'winning' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            당첨가이드
          </button>
        </div>

        {/* Guide Steps */}
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="flex items-center justify-center space-x-4">
            {currentSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Step */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-2 shadow-sm">
                    <img src={step.icon} alt={step.name} className="w-10 h-10 object-contain" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{step.name}</span>
                </div>

                {/* Arrow (except for last step) */}
                {index < currentSteps.length - 1 && (
                  <div className="text-gray-400 ml-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side (fl) - Lottery Games and Quick Actions */}
        <div className="flex-1 flex flex-col">
          {/* Lottery Games */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
            {/* Mega Millions Card */}
            <LotteryGameCard
              gameType="mega"
              logo="./lotto_logo_mega.png"
              title="메가밀리언 추첨"
              drawDate="10월01일 수요일"
              drawTime="오후 12시"
              jackpot="1619회차 1등 당첨금"
              jackpotAmount="6,982억원"
              previousNumbers={[4, 21, 27, 33, 49]}
              bonusNumber={21}
              countdown="1619회 마감임박 : 0일 19시 2분 51초"
              onPurchase={handleMegaPurchase}
              onPrizeInfo={() => handlePrizeInfo('메가밀리언')}
            />

            {/* Powerball Card */}
            <LotteryGameCard
              gameType="powerball"
              logo="./lotto_logo_power.png"
              title="파워볼 추첨"
              drawDate="10월02일 목요일"
              drawTime="오후 12시"
              jackpot="4092회차 1등 당첨금"
              jackpotAmount="2,444억원"
              previousNumbers={[1, 3, 27, 60, 65]}
              bonusNumber={16}
              countdown="4092회 마감시간 : 1일 19시 2분 51초"
              onPurchase={handlePowerballPurchase}
              onPrizeInfo={() => handlePrizeInfo('파워볼')}
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            {/* 메가밀리언 구매 */}
            <Link
              to="/mega-millions"
              className="flex flex-col items-center space-y-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow active:scale-95 touch-manipulation min-h-[80px]"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="./nmi_02.png" alt="메가밀리언" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center whitespace-pre-line leading-tight">메가밀리언<br/>구매</span>
            </Link>

            {/* 파워볼 구매 */}
            <button
              onClick={() => handleQuickAction('파워볼 구매')}
              className="flex flex-col items-center space-y-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow active:scale-95 touch-manipulation min-h-[80px]"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="./nmi_01.png" alt="파워볼" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center whitespace-pre-line leading-tight">파워볼<br/>구매</span>
            </button>

            {/* 캐시 충전 */}
            <button
              onClick={() => handleQuickAction('캐시 충전')}
              className="flex flex-col items-center space-y-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow active:scale-95 touch-manipulation min-h-[80px]"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="./nmi_03.png" alt="캐시 충전" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center whitespace-pre-line leading-tight">캐시<br/>충전</span>
            </button>

            {/* 티켓 구매내역 */}
            <button
              onClick={() => handleQuickAction('티켓 구매내역')}
              className="flex flex-col items-center space-y-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow active:scale-95 touch-manipulation min-h-[80px]"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="./nmi_04.png" alt="티켓 구매내역" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center whitespace-pre-line leading-tight">티켓<br/>구매내역</span>
            </button>

            {/* 나의 이용내역 */}
            <button
              onClick={() => handleQuickAction('나의 이용내역')}
              className="flex flex-col items-center space-y-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow active:scale-95 touch-manipulation min-h-[80px]"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="./nmi_05.png" alt="나의 이용내역" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center whitespace-pre-line leading-tight">나의<br/>이용내역</span>
            </button>
          </div>
        </div>

        {/* Right Side (fr) - Service Cards */}
        <div className="w-full lg:w-80">
          <div className="space-y-4">
            <ServiceCard
              title="럭키로또 고객센터"
              description="상담시간<br/>평일 : 오전 10시 ~ 오후 7시 주말 및 공휴일 휴무"
              iconIndex={0}
              color="blue"
              onClick={() => handleServiceClick('고객센터')}
            />

            <ServiceCard
              title="구매가이드"
              description="메가밀리언, 파워볼 구매가이드"
              iconIndex={1}
              color="sky"
              onClick={() => handleServiceClick('구매가이드')}
            />

            <ServiceCard
              title="당첨자 안내"
              description="주인공은 바로 나! 당첨자 발표"
              iconIndex={2}
              color="pink"
              onClick={() => handleServiceClick('당첨자 안내')}
            />

            <ServiceCard
              title="출석체크"
              description="최대 30% 할인쿠폰 지급"
              iconIndex={3}
              color="yellow"
              onClick={() => handleServiceClick('출석체크')}
            />

            <ServiceCard
              title="럭키 스크래치"
              description="무조건 100% 당첨"
              iconIndex={4}
              color="orange"
              onClick={() => handleServiceClick('럭키 스크래치')}
            />
          </div>
        </div>
      </div>

      {/* Guide Section */}
      <GuideSection />
    </div>
  )
}

export default Main
