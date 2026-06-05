import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [perfil, setPerfil] = useState('aluno')
  const [turmas, setTurmas] = useState([])
  const [turmaId, setTurmaId] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mostrarSenha1, setMostrarSenha1] = useState(false)
  const [mostrarSenha2, setMostrarSenha2] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    async function carregarTurmas() {
      const { data, error } = await supabase
        .from('turmas')
        .select('*')
        .not('nome', 'in', '(turma_admin,turma_coordenadores)')

      if (!error) {
        setTurmas(data)
      }
    }

    carregarTurmas()
  }, [])

  async function handleSignup(e) {
    e.preventDefault()

    const emailValido =
      email.includes('@') &&
      email.includes('.')

    if (!emailValido) {
      alert('Digite um email válido')
      return
    }

    if (password !== confirmPassword) {
      alert('As senhas não coincidem')
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    const userId = data.user.id

    let turmaSelecionada = turmaId

    if (perfil === 'coordenador') {
      turmaSelecionada =
        'e536e9cd-0269-4f78-b91c-55f394981917'
    }

    else if (perfil === 'administrador') {
      turmaSelecionada =
        '9fb15c93-7a97-424c-89aa-ea2f0c0aa12e'
    }

    const { error: dbError } = await supabase
      .from('usuarios')
      .insert([
        {
          id: userId,
          nome,
          email,
          perfil,
          turma_id: turmaSelecionada
        }
      ])

    if (dbError) {
      alert(dbError.message)
      return
    }

    alert('Usuário criado com sucesso')

    navigate('/login')
  }

  const emailValido =
    email.includes('@') &&
    email.includes('.com')

  const senhaValida =
    password.length >= 6

  const senhasIguais =
    password === confirmPassword

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
        <h1 style={{ textAlign: 'center' }}>Cadastro</h1>

        <form onSubmit={handleSignup}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Digite seu nome completo: </label>

          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ width: '95%', padding: '5px', marginBottom: '5px' }}
          />

          <br />

          <label style={{ display: 'block', marginBottom: '5px' }}>Digite seu email: </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '95%', padding: '5px', marginBottom: '5px' }}
          />

          {email.length > 0 && !emailValido && (
            <div
              style={{
                color: 'red',
                fontSize: '14px',
                marginTop: '5px'
              }}
            >
              Email deve conter @ e .com
            </div>
          )}

          <br />

          <label style={{ display: 'block', marginBottom: '5px' }}>Digite sua senha: </label>
          <input
            type={mostrarSenha1 ? 'text' : 'password'}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '82%', padding: '5px', marginBottom: '5px' }}
          />

          <button
            type="button"
            onClick={() => setMostrarSenha1(!mostrarSenha1)}
          >
            {mostrarSenha1 ? 'Ocultar' : 'Mostrar'}
          </button>

          {password.length > 0 && !senhaValida && (
            <div
              style={{
                color: 'red',
                fontSize: '14px'
              }}
            >
              A senha deve ter pelo menos 6 caracteres
            </div>
          )}

          <br />

          <label style={{ display: 'block', marginBottom: '5px' }}>Confirme sua senha: </label>
          <input
            type={mostrarSenha2 ? 'text' : 'password'}
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '82%', padding: '5px', marginBottom: '5px' }}
          />

          <button
            type="button"
            onClick={() => setMostrarSenha2(!mostrarSenha2)}
          >
            {mostrarSenha2 ? 'Ocultar' : 'Mostrar'}
          </button>

          {confirmPassword.length > 0 && !senhasIguais && (
            <div
              style={{
                color: 'red',
                fontSize: '14px'
              }}
            >
              As senhas não coincidem
            </div>
          )} 

          <br />

          <label style={{ display: 'block', marginBottom: '5px' }}>Selecione o seu perfil: </label>
          <select
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            style={{ width: '97%', padding: '5px', marginBottom: '5px' }}
          >
            <option value="aluno">Aluno</option>
            <option value="coordenador">Coordenador</option>
            <option value="administrador">Administrador</option>
          </select>

          {perfil === 'aluno' && (
            <>
              <br />
              <br />

              <label style={{ display: 'block', marginBottom: '5px' }}>Selecione sua turma: </label>
              <select
                value={turmaId}
                onChange={(e) => setTurmaId(e.target.value)}
                style={{ width: '97%', padding: '5px', marginBottom: '5px' }}
              >
                <option value="">Selecione uma turma</option>

                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome}
                  </option>
                ))}
              </select>
            </>
          )}
          <br />
          <br />

          <button type="submit"
            style={{ backgroundColor: '#263E5F', padding: '10px 226px', border: 'none', borderRadius: '5px', cursor: 'pointer', color: 'white' }}>
            Cadastrar
          </button>

          <h4>
            Já tem uma conta? <a href="/login">Faça login</a>
          </h4>
        </form>
      </div>
    </div>
  )
}

export default SignupPage