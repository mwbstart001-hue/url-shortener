import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Result from './pages/Result'
import NotFound from './pages/NotFound'
import { ToastProvider } from './components/Toast'

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result" element={<Result />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  )
}

export default App