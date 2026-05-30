import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AdminPage from './pages/AdminPage'
import AlunoPage from './pages/AlunoPage'
import CoordenadorPage from './pages/CoordenadorPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/aluno" element={<AlunoPage />} />
        <Route path="/coordenador" element={<CoordenadorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App