import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [perfil, setPerfil] = useState('aluno')
  const [turma, setTurma] = useState('')

  const navigate = useNavigate()

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
          turma
        }
      ])

    if (dbError) {
      alert(dbError.message)
      return
    }

    alert('Usuário criado com sucesso')

    navigate('/')
  }

  return (
    <div>
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

        <input
          type="text"
          placeholder="Turma"
          value={turma}
          onChange={(e) => setTurma(e.target.value)}
        />

        <button type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  )
}

export default SignupPage