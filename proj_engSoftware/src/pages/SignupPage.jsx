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
        maxWidth: '500px',
        margin: '40px auto',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 0 20px rgba(0,0,0,0.1)'
      }}
    >
      <h1 style={{ textAlign: 'center' }}>Cadastro</h1>

      <form onSubmit={handleSignup}>
        <label>Nome completo: </label>

        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <br />
        <br />

        <label>Email: </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <br />

        <label>Senha: </label>
        <input
          type={mostrarSenha1 ? 'text' : 'password'}
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {password.length > 0 && !senhaValida && (
          <div
            style={{
              color: 'red',
              fontSize: '14px',
              marginTop: '5px'
            }}
          >
            A senha deve ter pelo menos 6 caracteres
          </div>
        )}

        <button
          type="button"
          onClick={() => setMostrarSenha1(!mostrarSenha1)}
        >
          {mostrarSenha1 ? 'Ocultar' : 'Mostrar'}
        </button>

        <br />
        <br />

        <label>Confirmar senha: </label>
        <input
          type={mostrarSenha2 ? 'text' : 'password'}
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {confirmPassword.length > 0 && !senhasIguais && (
          <div
            style={{
              color: 'red',
              fontSize: '14px',
              marginTop: '5px'
            }}
          >
            As senhas não coincidem
          </div>
        )} 

        <button
          type="button"
          onClick={() => setMostrarSenha2(!mostrarSenha2)}
        >
          {mostrarSenha2 ? 'Ocultar' : 'Mostrar'}
        </button>

        <br />
        <br />

        <label>Perfil: </label>
        <select
          value={perfil}
          onChange={(e) => setPerfil(e.target.value)}
        >
          <option value="aluno">Aluno</option>
          <option value="coordenador">Coordenador</option>
          <option value="administrador">Administrador</option>
        </select>

        {perfil === 'aluno' && (
          <>
            <br />
            <br />

            <label>Selecione sua turma: </label>
            <select
              value={turmaId}
              onChange={(e) => setTurmaId(e.target.value)}
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

        <button type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  )
}

export default SignupPage