import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Main from './pages/Main'
import MegaMillionsPurchase from './pages/MegaMillionsPurchase'

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/mega-millions" element={<MegaMillionsPurchase />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
