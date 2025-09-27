import { Routes, Route } from 'react-router-dom'
import Layout from './components/organisms/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Character from './pages/Character'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/character" element={<Character />} />
      </Route>
    </Routes>
  )
}

export default App
