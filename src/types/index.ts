// 복권 관련 타입 정의
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  birth_date?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  avatar_url?: string
  preferred_language: string
  notification_settings: {
    email: boolean
    sms: boolean
    push: boolean
  }
  created_at: string
  updated_at: string
}

export interface Wallet {
  id: string
  user_id: string
  balance: number
  lucky_points: number
  total_deposited: number
  total_withdrawn: number
  created_at: string
  updated_at: string
}

export interface LotteryGame {
  id: string
  name: string
  display_name: string
  description?: string
  logo_url?: string
  is_active: boolean
  created_at: string
}

export interface LotteryDraw {
  id: string
  game_id: string
  draw_number: number
  draw_date: string
  deadline: string
  jackpot_amount: number
  jackpot_amount_usd?: number
  is_drawn: boolean
  is_rollover: boolean
  created_at: string
}

export interface DrawResult {
  id: string
  draw_id: string
  white_balls: number[]
  mega_ball: number
  total_winners: number
  created_at: string
}

export interface Ticket {
  id: string
  user_id: string
  draw_id: string
  ticket_number: string
  white_balls: number[]
  mega_ball: number
  game_method: 'manual' | 'auto' | 'quick_pick'
  quantity: number
  total_price: number
  is_winner: boolean
  prize_tier?: number
  prize_amount: number
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'deposit' | 'withdrawal' | 'purchase' | 'prize'
  amount: number
  balance_after: number
  description?: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  payment_method?: 'bank_transfer' | 'credit_card' | 'lucky_points'
  payment_reference?: string
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  title: string
  description?: string
  coupon_type: 'points' | 'discount' | 'free_ticket'
  value: number
  min_purchase_amount: number
  max_discount_amount?: number
  usage_limit?: number
  used_count: number
  is_active: boolean
  valid_from: string
  valid_until: string
  created_at: string
}

export interface UserCoupon {
  id: string
  user_id: string
  coupon_id: string
  used_at?: string
  is_used: boolean
  created_at: string
}

export interface RechargeOption {
  id: string
  amount: number
  lucky_points: number
  scratch_cards: number
  bonus_percentage: number
  description: string
  game_info: string
  is_active: boolean
  created_at: string
}

export interface Attendance {
  id: string
  user_id: string
  attendance_date: string
  points_earned: number
  streak_count: number
  created_at: string
}

export interface ScratchCard {
  id: string
  user_id: string
  card_type: string
  is_scratched: boolean
  prize_amount: number
  scratched_at?: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  read_at?: string
  created_at: string
}

export interface SystemSetting {
  id: string
  key: string
  value: any
  description?: string
  updated_at: string
}

// API Response 타입
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

// Form 타입
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  name: string
  phone?: string
  birth_date?: string
}

export interface TicketPurchaseForm {
  draw_id: string
  white_balls: number[]
  mega_ball: number
  game_method: 'manual' | 'auto' | 'quick_pick'
  quantity: number
}

export interface RechargeForm {
  option_id: string
  payment_method: 'bank_transfer' | 'credit_card'
  amount: number
}

export interface Order {
  id: string
  userId: string
  tickets: Ticket[]
  totalAmount: number
  status: 'pending' | 'paid' | 'cancelled' | 'completed'
  paymentMethod: string
  createdAt: string
  updatedAt: string
}
