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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    const userId = data.user.id

    const { error: dbError } = await supabase
      .from('usuarios')
      .insert([
        {
          id: userId,
          nome,
          email,
          perfil,
          turma_id: turmaId
        }
      ])

    if (dbError) {
      alert(dbError.message)
      return
    }

    alert('Usuário criado com sucesso')

    navigate('/login')
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
      <h1>Cadastro</h1>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <br />
        <br />

        <select
          value={perfil}
          onChange={(e) => setPerfil(e.target.value)}
        >
          <option value="aluno">Aluno</option>
          <option value="coordenador">Coordenador</option>
          <option value="administrador">Administrador</option>
        </select>

        <br />
        <br />

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

        <button type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  )
}

export default SignupPage