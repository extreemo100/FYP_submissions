import ChatInterface from '../components/ChatInterface'

export default function Home() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ 
          color: '#00ff41', 
          textAlign: 'center', 
          fontSize: '2.5rem',
          textShadow: '0 0 10px #00ff41'
        }}>
          🧪 Talk to Rick Sanchez
        </h1>
        <ChatInterface />
      </div>
    </main>
  )
}