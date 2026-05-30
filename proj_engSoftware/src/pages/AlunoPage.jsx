import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function AlunoPage() {
  const [user, setUser] = useState(null)
  const [dadosUsuario, setDadosUsuario] = useState(null)
  const [historico, setHistorico] = useState([])

  useEffect(() => {
    async function carregarDados() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('usuarios')
          .select(`
            *,
            turmas (
              nome
            )
          `)
          .eq('id', user.id)
          .single()

        setDadosUsuario(data)

        const { data: historicoData, error } = await supabase
            .from('historico_escolar')
            .select(`
                nota,
                disciplinas (
                nome,
                codigo
                )
            `)
            .eq('aluno_id', user.id)

            if (!error) {
            setHistorico(historicoData)
            }
      }
    }

    carregarDados()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
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
        <h1>Dashboard do aluno</h1>

        <p>Email Auth: {user?.email}</p>

        <hr />

        <p>Nome: {dadosUsuario?.nome}</p>
        <p>Perfil: {dadosUsuario?.perfil}</p>
        <p>Turma: {dadosUsuario?.turmas?.nome}</p>

        <br />

        <hr />

        <h2>Histórico Escolar</h2>

        {historico.map((item, index) => (
        <div key={index}>
            <p>
            {item.disciplinas?.nome} - Nota: {item.nota}
            </p>
        </div>
        ))}

        <button onClick={handleLogout}>
            Sair
        </button>
    </div>
  )
}

export default AlunoPage