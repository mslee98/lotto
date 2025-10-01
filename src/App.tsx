import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Main from './pages/Main'
import MegaMillionsPurchase from './pages/MegaMillionsPurchase'
import Results from './pages/Results'
import Charge from './pages/Charge'
import Events from './pages/Events'
import Register from './pages/Register'
import MyPage from './pages/MyPage'
import ForgotId from './pages/ForgotId'

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분 (v5에서 cacheTime -> gcTime으로 변경)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/mega-millions" element={<MegaMillionsPurchase />} />
              <Route path="/results" element={<Results />} />
              <Route path="/charge" element={<Charge />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/mypage" element={<MyPage />} />
                  <Route path="/forgot-id" element={<ForgotId />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </QueryClientProvider>
  )
}

export default App
