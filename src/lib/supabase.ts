import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database helper functions
export const db = {
  // Users
  users: () => supabase.from('users'),
  
  // Lottery Games
  lotteryGames: () => supabase.from('lottery_games'),
  lotteryDraws: () => supabase.from('lottery_draws'),
  drawResults: () => supabase.from('draw_results'),
  
  // Tickets
  tickets: () => supabase.from('tickets'),
  
  // Wallets & Transactions
  wallets: () => supabase.from('wallets'),
  transactions: () => supabase.from('transactions'),
  
  // Coupons
  coupons: () => supabase.from('coupons'),
  userCoupons: () => supabase.from('user_coupons'),
  
  // Recharge
  rechargeOptions: () => supabase.from('recharge_options'),
  
  // Events
  attendance: () => supabase.from('attendance'),
  scratchCards: () => supabase.from('scratch_cards'),
  
  // Notifications
  notifications: () => supabase.from('notifications'),
  
  // Settings
  systemSettings: () => supabase.from('system_settings')
}

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },
  
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },
  
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },
  
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },

  // 비밀번호 재설정 이메일 발송
  resetPasswordForEmail: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { data, error }
  },

  // 비밀번호 업데이트 (현재 세션에서 비밀번호 변경)
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { data, error }
  },

  // 사용자 정보로 이메일 찾기 (아이디/비밀번호 찾기용)
  findUserByInfo: async (userId?: string, name?: string, phone?: string) => {
    console.log('findUserByInfo 호출:', { userId, name, phone })
    
    let query = supabase.from('user_profiles').select(`
      id, 
      username, 
      full_name, 
      phone, 
      created_at,
      user_id
    `)
    
    if (userId && phone) {
      // 비밀번호 찾기: 아이디 + 휴대폰번호
      console.log('비밀번호 찾기 쿼리:', { username: userId, phone })
      query = query.eq('username', userId).eq('phone', phone)
    } else if (name && phone) {
      // 아이디 찾기: 이름 + 휴대폰번호
      console.log('아이디 찾기 쿼리:', { full_name: name, phone })
      query = query.eq('full_name', name).eq('phone', phone)
    }
    
    console.log('Supabase 쿼리 실행 중...')
    const { data, error } = await query.maybeSingle()
    console.log('Supabase 쿼리 결과:', { data, error })
    
    if (error) {
      console.error('Supabase 에러:', error)
      return { data: null, error }
    }
    
    if (!data) {
      console.log('사용자 데이터 없음')
      return { 
        data: null, 
        error: { 
          message: '일치하는 사용자 정보를 찾을 수 없습니다.',
          code: 'USER_NOT_FOUND'
        } 
      }
    }
    
    // email 필드는 현재 user_profiles에 없으므로 null로 설정
    data.email = null
    console.log('email 필드 없음, null로 설정')
    
    console.log('사용자 찾기 성공:', data)
    return { data, error: null }
  }
}

// Real-time subscriptions
export const realtime = {
  subscribeToTickets: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('tickets')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tickets', filter: `user_id=eq.${userId}` },
        callback
      )
      .subscribe()
  },
  
  subscribeToNotifications: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('notifications')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        callback
      )
      .subscribe()
  },
  
  subscribeToDrawResults: (gameId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('draw_results')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'draw_results' },
        callback
      )
      .subscribe()
  }
}
