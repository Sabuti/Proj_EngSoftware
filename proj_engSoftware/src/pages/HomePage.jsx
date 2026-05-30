import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function HomePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()

    navigate('/login')
  }

  async function handleSignup(e) {
    e.preventDefault()

    navigate('/signup')
  }

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px'
      }}
    >
      <h1>Bem-vindo!</h1>

      <p>Entre ou cadastre-se para continuar.</p>

      <button onClick={handleLogin}>
        Entrar
      </button>

      <button onClick={handleSignup}>
        Cadastrar
      </button>
    </div>
  )
}

export default HomePage