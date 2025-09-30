import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Main from './pages/Main'
import MegaMillionsPurchase from './pages/MegaMillionsPurchase'
import Results from './pages/Results'
import Charge from './pages/Charge'
import Events from './pages/Events'

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/mega-millions" element={<MegaMillionsPurchase />} />
          <Route path="/results" element={<Results />} />
          <Route path="/charge" element={<Charge />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
