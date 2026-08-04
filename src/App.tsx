import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Game from './pages/Game'

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </div>
  )
}

export default App
