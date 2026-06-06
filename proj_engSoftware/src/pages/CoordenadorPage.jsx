import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function CoordenadorPage() {
  const [aba, setAba] = useState('alunos')
  const [alunos, setAlunos] = useState([])
  const [alunoSelecionado, setAlunoSelecionado] = useState(null)
  const [dadosUsuario, setDadosUsuario] = useState(null)
  const [desempenho, setDesempenho] = useState([])
  const [historicoAluno, setHistoricoAluno] = useState([])
  const [mediaGeral, setMediaGeral] = useState(0)
  const [turmas, setTurmas] = useState([])
  const [turmaSelecionada, setTurmaSelecionada] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function carregarAlunos() {

      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          turmas (
            nome
          )
        `)
        .eq('perfil', 'aluno')

      if (!error) {
        setAlunos(data)
      }

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
      }
    }

    async function carregarTurmas() {
      const { data, error } = await supabase
        .from('turmas')
        .select('*')

      if (!error) {

        setTurmas(
          data.filter(
            turma =>
              turma.nome !== 'turma_admin' &&
              turma.nome !== 'turma_coordenadores'
          )
        )
      }
    }

    carregarAlunos()
    carregarTurmas()
  }, [])

  async function verHistorico(aluno) {
    if (alunoSelecionado?.id === aluno.id) {
      setAlunoSelecionado(null)
      setHistoricoAluno([])
      return
    }

    setAlunoSelecionado(aluno)

    const { data, error } = await supabase
      .from('historico_escolar')
      .select(`
        nota,
        aprovado,
        disciplinas (
          nome,
          sigla
        )
      `)
      .eq('aluno_id', aluno.id)

    if (!error) {
      setHistoricoAluno(data)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  async function carregarDesempenho() {
    if (!turmaSelecionada) {
      alert('Selecione uma turma')
      return
    }

    const {
      data: alunosTurma,
      error: alunosError
    } = await supabase
      .from('usuarios')
      .select('id')
      .eq('turma_id', turmaSelecionada)

    if (alunosError) {
      console.log(alunosError)
      return
    }

    if (!alunosTurma) {
      return
    }

    const idsAlunos = alunosTurma.map(a => a.id)

    const { data } = await supabase
      .from('historico_escolar')
      .select(`
        nota,
        disciplinas (
          nome,
          sigla
        )
      `)
      .in('aluno_id', idsAlunos)

    const medias = {}

    data.forEach((item) => {

      const sigla = item.disciplinas?.sigla

      if (!sigla) return

      if (!medias[sigla]) {
        medias[sigla] = {
          nome: item.disciplinas.nome,
          sigla,
          soma: 0,
          quantidade: 0
        }
      }

      medias[sigla].soma += item.nota
      medias[sigla].quantidade += 1
    })

    const resultado = Object.values(medias).map((disc) => ({
      nome: disc.nome,
      sigla: disc.sigla,
      media:
        disc.soma /
        disc.quantidade
    }))

    setDesempenho(resultado)

    const somaMedias = resultado.reduce(
      (acc, item) => acc + item.media,
      0
    )

    setMediaGeral(
      somaMedias / resultado.length
    )
  }

  const estiloBotao = {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
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
      <div
        style={{
          width: '250px',
          backgroundColor: '#610127',
          color: 'white',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginBottom: '20px' // Repensar
        }}
      > 
      {/* Barra lateral de navegação */}
        <h2>Coordenador</h2>

        <button
          style={estiloBotao}
          onClick={() => setAba('alunos')}
        >
          Alunos
        </button>

        <button
          style={estiloBotao}
          onClick={() => setAba('desempenho')}
        >
          Desempenho da Turma
        </button>

        <button
          style={estiloBotao}
          onClick={() => setAba('perfil')}
        >
          Perfil
        </button>

        <div style={{ flex: 1 }} />

        <button
          style={estiloBotao}
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>

      <div
        style={{
          flex: 1,
          padding: '40px',
          backgroundColor: '#263E5F'
        }}
      >

        <div
          style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >

          {aba === 'alunos' && (
            <>
              <h1>Alunos</h1>

              {alunos.map((aluno) => (
                <div
                  key={aluno.id}
                  style={{
                    border: '1px solid #ccc',
                    padding: '15px',
                    marginBottom: '15px',
                    borderRadius: '10px'
                  }}
                >
                  <strong>{aluno.nome}</strong>

                  <br />

                  {aluno.email}

                  <br />

                  Turma: {aluno.turmas?.nome}

                  <br />
                  <br />

                  <button
                    onClick={() => verHistorico(aluno)}
                  >
                    {alunoSelecionado?.id === aluno.id
                      ? 'Ocultar histórico'
                      : 'Ver histórico'}
                  </button>

                  {alunoSelecionado?.id === aluno.id && (
                    <div
                      style={{
                        marginTop: '15px',
                        padding: '10px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px'
                      }}
                    >
                      <h4>Histórico Escolar</h4>

                      <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginTop: '20px'
                          }}>
                        <thead>
                          <tr>
                            <th style={estiloTabela}>Sigla</th>
                            <th style={estiloTabela}>Disciplina</th>
                            <th style={estiloTabela}>Nota</th>
                          </tr>
                        </thead>

                        <tbody>
                          {historicoAluno.map((item, index) => (
                            <tr key={index}>
                              <td style={estiloTabela}>{item.disciplinas?.sigla}</td>
                              <td style={estiloTabela}>{item.disciplinas?.nome}</td>
                              <td style={estiloTabela}>{item.nota.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {aba === 'desempenho' && (
            <>
              <label>
                Turma:
              </label>

              <select
                value={turmaSelecionada}
                onChange={(e) =>
                  setTurmaSelecionada(e.target.value)
                }
              >
                <option value="">
                  Selecione uma turma
                </option>

                {turmas.map((turma) => (
                  <option
                    key={turma.id}
                    value={turma.id}
                  >
                    {turma.nome}
                  </option>
                ))}
              </select>

              <button onClick={carregarDesempenho}>
                Carregar desempenho
              </button>

              <br />
              <br />

              <h1>Desempenho da Turma</h1>

              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '20px'
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        borderBottom: '2px solid #ddd'
                      }}
                    >
                      Sigla
                    </th>

                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        borderBottom: '2px solid #ddd'
                      }}
                    >
                      Disciplina
                    </th>

                    <th
                      style={{
                        textAlign: 'center',
                        padding: '12px',
                        borderBottom: '2px solid #ddd',
                        width: '120px'
                      }}
                    >
                      Média
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {desempenho.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: '10px' }}>
                        {item.sigla}
                      </td>

                      <td style={{ padding: '10px' }}>
                        {item.nome}
                      </td>

                      <td
                        style={{
                          padding: '10px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                      >
                        {item.media.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>
                Média Geral da Turma: {mediaGeral.toFixed(2)}
              </h3>
            </>
          )}

          {aba === 'perfil' && (
            <>
              <h1>Perfil</h1>

              <p>Nome: {dadosUsuario?.nome}</p>
              <p>Email: {user?.email}</p>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default CoordenadorPage