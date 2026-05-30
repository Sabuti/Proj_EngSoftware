import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function AlunoPage() {
  const [user, setUser] = useState(null)
  const [dadosUsuario, setDadosUsuario] = useState(null)

  useEffect(() => {
    async function carregarDados() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single()

        setDadosUsuario(data)
      }
    }

    carregarDados()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div>
      <h1>Dashboard do aluno</h1>

      <p>Email Auth: {user?.email}</p>

      <hr />

      <p>Nome: {dadosUsuario?.nome}</p>
      <p>Perfil: {dadosUsuario?.perfil}</p>
      <p>Turma: {dadosUsuario?.turma}</p>

      <br />

      <button onClick={handleLogout}>
        Sair
      </button>
    </div>
  )
}

export default AlunoPage