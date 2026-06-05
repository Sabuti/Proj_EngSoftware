import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function AdminPage() {
  const [aba, setAba] = useState('usuarios')
  const [alunos, setAlunos] = useState([])
  const [alunoSelecionado, setAlunoSelecionado] = useState(null)
  const [dadosUsuario, setDadosUsuario] = useState(null)
  const [desempenho, setDesempenho] = useState([])
  const [disciplinas, setDisciplinas] = useState([])
  const [historico, setHistorico] = useState([])
  const [historicoAluno, setHistoricoAluno] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [turmas, setTurmas] = useState([])
  const [turmaSelecionada, setTurmaSelecionada] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function carregarDados() {

      const {
        data: { user }
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

      const { data: listaUsuarios } = await supabase
        .from('usuarios')
        .select('*')

      const { data: listaDisciplinas } = await supabase
        .from('disciplinas')
        .select('*')

      const { data: listaTurmas } = await supabase
        .from('turmas')
        .select(`
            *,
            usuarios (
            nome
            )
        `)

      setUsuarios(listaUsuarios || [])
      setDisciplinas(listaDisciplinas || [])
      setTurmas(listaTurmas || [])

    }

    carregarDados()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const estiloBotao = {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  }

  const estiloBotaoSair = {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    marginTop: 'auto'
  }

  const estiloTabela={
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #ddd'
  }

  return (
      <div
        style={{
          display: 'flex',
          minHeight: '100vh'
        }}
      >
  
        {/* Sidebar */}
        <div
          style={{
            width: '250px',
            backgroundColor: '#610127',
            color: 'white', 
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxHeight: '92vh',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}
          >
  
            <div>
              <div
                style={{
                  fontWeight: 'bold'
                }}
              >
                {dadosUsuario?.nome}
              </div>
  
              <div
                style={{
                  fontSize: '12px',
                  opacity: 0.8
                }}
              >
                Administrador
              </div>
            </div>
          </div>
  
          <button 
            style={estiloBotao}
            onClick={() => setAba('usuarios')}>
            Usuários
          </button>
  
          <button 
            style={estiloBotao}
            onClick={() => setAba('disciplinas')}>
            Disciplinas
          </button>
  
          <button 
            style={estiloBotao}
            onClick={() => setAba('turmas')}>
            Turmas
          </button>
  
          <button 
            style={estiloBotaoSair}
            onClick={handleLogout}>
            Sair
          </button>
        </div>
  
          {/* Conteúdo */}
          <div
            style={{
              flex: 1,
              padding: '30px',
              backgroundColor: '#263E5F'
            }} 
          >
  
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              minHeight: '80vh'
            }}
          >
          
          {aba === 'usuarios' && (
            <>
              <h1>Usuários</h1>

              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '20px'
                }}>
                <thead>
                  <tr>
                    <th style={estiloTabela}>Nome</th>
                    <th style={estiloTabela}>Email</th>
                    <th style={estiloTabela}>Perfil</th>
                  </tr>
                </thead>

                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td style={estiloTabela}>{usuario.nome}</td>
                      <td style={estiloTabela}>{usuario.email}</td>
                      <td style={estiloTabela}>{usuario.perfil}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
  
          {aba === 'disciplinas' && (
            <>
              <h1>Disciplinas</h1>

              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '20px'
                }}>
                <thead>
                  <tr>
                    <th style={estiloTabela}>Sigla</th>
                    <th style={estiloTabela}>Nome</th>
                    <th style={estiloTabela}>Período</th>
                  </tr>
                </thead>

                <tbody>
                  {disciplinas.map((disciplina) => (
                    <tr key={disciplina.id}>
                      <td style={estiloTabela}>{disciplina.sigla}</td>
                      <td style={estiloTabela}>{disciplina.nome}</td>
                      <td style={estiloTabela}>{disciplina.periodo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
  
          {aba === 'turmas' && (
            <>
              <h1>Turmas</h1>

              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '20px'
                }}>
                <thead>
                  <tr>
                    <th style={estiloTabela}>Turma</th>
                    <th style={estiloTabela}>Quantidade de alunos</th>
                  </tr>
                </thead>

                <tbody>
                  {turmas.map((turma) => (
                    <tr key={turma.id}>
                      <td style={estiloTabela}>{turma.nome}</td>

                      <td style={estiloTabela}>
                        {turma.usuarios?.length || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          </div>
        </div>
  
      </div>
  )
}

export default AdminPage