import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function AdminPage() {
  const [usuarios, setUsuarios] = useState([])
  const [disciplinas, setDisciplinas] = useState([])
  const [turmas, setTurmas] = useState([])

  useEffect(() => {
    async function carregarDados() {

      const { data: listaUsuarios } = await supabase
        .from('usuarios')
        .select('*')

      const { data: listaDisciplinas } = await supabase
        .from('disciplinas')
        .select('*')

      const { data: listaTurmas } = await supabase
        .from('usuarios')
        .select(`
            *,
            turmas (
            nome
            )
        `)

      setUsuarios(listaUsuarios || [])
      setDisciplinas(listaDisciplinas || [])
      setTurmas(listaTurmas || [])

    }

    carregarDados()
  }, [])

  return (
    <div style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '20px'
    }}>
      <h1>Painel Administrativo</h1>

      <h2>Usuários</h2>
        {usuarios.map(usuario => (
          <div key={usuario.id}>
            {usuario.nome} - {usuario.email} - {usuario.perfil}
          </div>
        ))}

      <h2>Disciplinas</h2>
        {disciplinas.map(disciplina => (
          <div key={disciplina.id}>
            {disciplina.nome}
          </div>
        ))}

      <h2>Turmas</h2>
        {turmas.map(turma => (
          <div key={turma.id}>
            {turma.nome}
          </div>
        ))}
    </div>
  )
}

export default AdminPage