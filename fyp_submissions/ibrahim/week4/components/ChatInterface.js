'use client'

import { useState, useRef, useEffect } from 'react'

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef(null)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const { reply } = await chatResponse.json()
      const assistantMessage = { role: 'assistant', content: reply }
      setMessages([...newMessages, assistantMessage])

      const ttsResponse = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reply }),
      })

      const audioBlob = await ttsResponse.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Ah geez, something went wrong with the multiverse connection!' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '15px',
      padding: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 255, 65, 0.3)',
    }}>
      <div style={{
        height: '500px',
        overflowY: 'auto',
        marginBottom: '20px',
        padding: '10px',
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '15px',
              textAlign: msg.role === 'user' ? 'right' : 'left',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '10px 15px',
                borderRadius: '10px',
                maxWidth: '70%',
                background: msg.role === 'user' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #00ff41 0%, #00b8a9 100%)',
                color: msg.role === 'user' ? 'white' : '#000',
                fontWeight: msg.role === 'assistant' ? 'bold' : 'normal',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ textAlign: 'left', color: '#00ff41' }}>
            Rick is thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Talk to Rick..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '2px solid #00ff41',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            fontSize: '16px',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          style={{
            padding: '12px 30px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #00ff41 0%, #00b8a9 100%)',
            color: '#000',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          Send
        </button>
        <button
          onClick={() => setMessages([])}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: '2px solid #ff4141',
            background: 'transparent',
            color: '#ff4141',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Clear
        </button>
      </div>

      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  )
}
