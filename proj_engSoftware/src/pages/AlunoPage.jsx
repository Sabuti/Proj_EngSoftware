import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Papa from 'papaparse'

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
                sigla
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

        <hr />

        <h2>Importar Grade Curricular</h2>

        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
        />

        <br />

        <hr />

        <h2>Importar Histórico Escolar</h2>

        <input
          type="file"
          accept=".csv"
          onChange={handleHistoricoUpload}
        />
        <br />

        <button onClick={handleLogout}>
            Sair
        </button>
    </div>
  )
}

export default AlunoPage