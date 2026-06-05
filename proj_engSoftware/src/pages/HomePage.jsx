import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#610127',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1100px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}
      >
        <div>
          <h1
            style={{
              color: 'white',
              fontSize: '3.5rem',
              marginBottom: '20px',
              lineHeight: '1.1'
            }}
          >
            Sistema de
            <br />
            Recomendação
            <br />
            Acadêmica
          </h1>

          <p
            style={{
              color: '#cbd5e1',
              fontSize: '1.2rem',
              lineHeight: '1.8'
            }}
          >
            Plataforma para gerenciamento acadêmico,
            acompanhamento do histórico escolar e
            recomendação inteligente de disciplinas para
            os alunos.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '15px',
              marginTop: '35px',
              flexWrap: 'wrap'
            }}
          >
            <button
              onClick={() => navigate('/login')}
              style={{
                background: '#ffffff',
                color: 'black',
                border: 'none',
                padding: '14px 30px',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: '0.3s'
              }}
            >
              Entrar
            </button>

            <button
              onClick={() => navigate('/signup')}
              style={{
                background: 'transparent',
                color: 'white',
                border: '1px solid #94a3b8',
                padding: '14px 30px',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Criar Conta
            </button>
          </div>
        </div>

        <div
          style={{
            background: '#263E5F',
            backdropFilter: 'blur(12px)',
            borderRadius: '20px',
            padding: '35px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <h2
            style={{
              color: 'white',
              marginBottom: '25px',
              textAlign: 'center'
            }}
          >
            Recursos do Sistema
          </h2>

          <div
            style={{
              display: 'grid',
              gap: '20px'
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '20px',
                borderRadius: '12px'
              }}
            >
              <h3 style={{ color: '#60a5fa' }}>
                Histórico Escolar
              </h3>

              <p style={{ color: '#cbd5e1' }}>
                Importação automática e consulta das
                disciplinas cursadas.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '20px',
                borderRadius: '12px'
              }}
            >
              <h3 style={{ color: '#60a5fa' }}>
                Recomendações
              </h3>

              <p style={{ color: '#cbd5e1' }}>
                Sugestão de disciplinas baseada no
                histórico acadêmico do aluno.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '20px',
                borderRadius: '12px'
              }}
            >
              <h3 style={{ color: '#60a5fa' }}>
                Gestão Acadêmica
              </h3>

              <p style={{ color: '#cbd5e1' }}>
                Administração de usuários, turmas e
                disciplinas em um único ambiente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage