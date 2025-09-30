// 복권 관련 타입 정의
export interface LotteryTicket {
  id: string
  numbers: number[]
  bonusNumber?: number
  drawDate: string
  type: 'lotto' | 'lotto_plus' | 'auto_lotto'
  price: number
  isWinner: boolean
  createdAt: string
  updatedAt: string
}

export interface LotteryDraw {
  id: string
  drawNumber: number
  numbers: number[]
  bonusNumber: number
  drawDate: string
  totalWinners: number
  totalPrize: number
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  userId: string
  tickets: LotteryTicket[]
  totalAmount: number
  status: 'pending' | 'paid' | 'cancelled' | 'completed'
  paymentMethod: string
  createdAt: string
  updatedAt: string
}
