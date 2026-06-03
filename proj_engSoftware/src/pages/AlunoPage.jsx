import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Papa from 'papaparse'
import userIcon from '../assets/user.png'

function AlunoPage() {
  const [user, setUser] = useState(null)
  const [dadosUsuario, setDadosUsuario] = useState(null)
  const [historico, setHistorico] = useState([])
  const [aba, setAba] = useState('historico')
  const [pendentes, setPendentes] = useState([])
  const [quantidade, setQuantidade] = useState(5)
  const [recomendadas, setRecomendadas] = useState([])

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
          alert(error.message)
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
          alert(error.message)
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
          backgroundColor: '#187488da',
          color: 'white', 
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
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
          onClick={() => setAba('perfil')}>
          Perfil
        </button>

        <button 
          style={estiloBotao}
          onClick={handleLogout}>
          Sair
        </button>
      </div>

        {/* Conteúdo */}
        <div
          style={{
            flex: 1,
            padding: '30px'
          }}
        >
        
        {aba === 'historico' && (
          <>
            <h1>Histórico Escolar</h1>

            {historico.map((item, index) => (
              <div key={index}>
                <p>
                  {item.disciplinas?.nome}
                  {' - '}
                  Nota: {item.nota}
                </p>
              </div>
            ))}
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
      </div>

    </div>
  )
}

export default AlunoPage