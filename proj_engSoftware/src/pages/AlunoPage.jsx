import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Papa from 'papaparse'
import userIcon from '../assets/user.png'

function AlunoPage() {
  const [aba, setAba] = useState('historico')
  const [dadosUsuario, setDadosUsuario] = useState(null)
  const [historico, setHistorico] = useState([])
  const [pendentes, setPendentes] = useState([])
  const [quantidade, setQuantidade] = useState(5)
  const [recomendadas, setRecomendadas] = useState([])
  const [user, setUser] = useState(null)

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
                sigla
                )
            `)
            .eq('aluno_id', user.id)

            if (!error) {
            setHistorico(historicoData)
            }

        const { data: pendentesData, error: pendentesError } = await supabase
          .from('historico_escolar')
          .select(`
            aprovado,
            disciplinas (
              nome,
              sigla,
              periodo,
              horasAula
            )
          `)
          .eq('aluno_id', user.id)
          .eq('aprovado', false)

        if (!pendentesError) {
          setPendentes(pendentesData)
        }
      }
    }

    carregarDados()
  }, [])

  async function handleFile(event) {
    const file = event.target.files[0]

    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: async (results) => {
        console.log(results.data)
        const { error } = await supabase
          .from('disciplinas')
          .upsert(results.data, {
            onConflict: 'sigla'
          })

        if (error) {
          console.log(error)
          alert('Erro ao importar o arquivo.')
        } else {
          alert('Grade curricular importada com sucesso')
        }
      }
    })
  }

  async function handleHistoricoUpload(event) {
    const file = event.target.files[0]

    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: async (results) => {

        const {
          data: { user }
        } = await supabase.auth.getUser()

        const registros = []

        for (const linha of results.data) {

          const { data: disciplina } = await supabase
            .from('disciplinas')
            .select('id')
            .eq('sigla', linha.sigla)
            .single()

          if (!disciplina) continue

          registros.push({
            aluno_id: user.id,
            disciplina_id: disciplina.id,
            nota: Number(linha.nota),
            aprovado: linha.aprovado === 'true'
          })
        }

        console.log(registros)

        await supabase
          .from('historico_escolar')
          .delete()
          .eq('aluno_id', user.id)

        const { error } = await supabase
          .from('historico_escolar')
          .insert(registros)

        if (error) {
          console.log(error)
          alert('Erro ao importar o arquivo.')
        } else {
          alert('Histórico escolar importado com sucesso')
        }
      }
    })
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  function gerarRecomendacoes() {
    const ordenadas = [...pendentes]
      .sort(
        (a, b) =>
          a.disciplinas.periodo -
          b.disciplinas.periodo
      )

    setRecomendadas(
      ordenadas.slice(0, quantidade)
    )
  }

  const estiloBotao = {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer'
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
          <img
            src={userIcon}
            alt="User Icon"
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%'
            }}
          />

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
              Aluno
            </div>
          </div>
        </div>

        <button 
          style={estiloBotao}
          onClick={() => setAba('historico')}>
          Histórico
        </button>

        <button 
          style={estiloBotao}
          onClick={() => setAba('recomendacoes')}>
          Recomendações
        </button>

        <button 
          style={estiloBotao}
          onClick={() => setAba('imports')}>
          Import de arquivos
        </button>

        <button 
          style={estiloBotao}
          onClick={() => setAba('perfil')}>
          Perfil
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

        {aba === 'historico' && (
          <>
            <table
              style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '20px'
                }}>
              <thead>
                <tr>
                  <th style={estiloTabela}>Disciplina</th>
                  <th style={estiloTabela}>Nota</th>
                </tr>
              </thead>

              <tbody>
                {historico.map((item, index) => (
                  <tr key={index}>
                    <td style={estiloTabela}>{item.disciplinas?.nome}</td>
                    <td style={estiloTabela}>{item.nota.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {aba === 'recomendacoes' && (
          <>
            <h1>Recomendação de Disciplinas</h1>

            <p>
              Escolha quantas disciplinas deseja cursar.
            </p>

            <select
              value={quantidade}
              onChange={(e) =>
                setQuantidade(Number(e.target.value))
              }
            >
              <option value={5}>5 disciplinas</option>
              <option value={6}>6 disciplinas</option>
              <option value={7}>7 disciplinas</option>
            </select>

            <br />
            <br />

            <button onClick={gerarRecomendacoes}>
              Gerar Recomendações
            </button>

            <hr />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}
            >
              {recomendadas.map((item, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    padding: '15px'
                  }}
                >
                  <h3>
                    {item.disciplinas?.sigla}
                  </h3>

                  <p>
                    {item.disciplinas?.nome}
                  </p>

                  <p>
                    Período: {item.disciplinas?.periodo}
                  </p>

                  <p>
                    Carga Horária: {item.disciplinas?.horasAula}h
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {aba === 'imports' && (
          <>
            <h1>Importações</h1>

            <h2>Grade Curricular</h2>

            <input
              type="file"
              accept=".csv"
              onChange={handleFile}
            />

            <br />
            <br />

            <h2>Histórico Escolar</h2>

            <input
              type="file"
              accept=".csv"
              onChange={handleHistoricoUpload}
            />
          </>
        )}

        {aba === 'perfil' && (
          <>
            <h1>Perfil</h1>

            <p>Email: {user?.email}</p>
            <p>Nome: {dadosUsuario?.nome}</p>
            <p>Perfil: {dadosUsuario?.perfil}</p>
            <p>Turma: {dadosUsuario?.turmas?.nome}</p>
          </>
        )}
        
        </div>
      </div>

    </div>
  )
}

export default AlunoPage