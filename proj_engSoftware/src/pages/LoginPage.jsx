import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    const {
      data: { user }
    } = await supabase.auth.getUser()

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single()

    if (usuario.perfil === 'administrador') {
      navigate('/admin')
    }
    else if (usuario.perfil === 'coordenador') {
      navigate('/coordenador')
    }
    else {
      navigate('/aluno')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#610127',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          margin: '40px auto',
          padding: '30px',
          borderRadius: '15px',
          background: '#ffffff',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
        }}
      >
        <h1 style={{ textAlign: 'center' }}>Login</h1>

        <form onSubmit={handleLogin}>

          <label style={{ display: 'block', marginBottom: '5px' }}>Digite seu email: </label>
          <input style={{ width: '95%', padding: '5px', marginBottom: '5px' }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />
          <br />

          <label style={{ display: 'block', marginBottom: '5px' }}>Digite sua senha: </label>
          <input style={{ width: '95%', padding: '5px', marginBottom: '5px' }}
            type={mostrarSenha ? 'text' : 'password'}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
          >
            {mostrarSenha ? 'Ocultar' : 'Mostrar'}
          </button>

          <br />
          <br />

          <button type="submit" 
            style={{ backgroundColor: '#263E5F', padding: '10px 226px', border: 'none', borderRadius: '5px', cursor: 'pointer', color: 'white' }}>
            Entrar
          </button>

          <h4>
            Não tem uma conta? <a href="/signup">Cadastre-se</a>
          </h4>
        </form>
      </div>
    </div>
  )
}

export default LoginPage