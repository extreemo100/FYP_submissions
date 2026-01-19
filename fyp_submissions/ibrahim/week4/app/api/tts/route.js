import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { text } = await request.json()

    // Use Fish Audio REST API directly
    const response = await fetch('https://api.fish.audio/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        reference_id: process.env.RICK_MODEL_ID,
        format: 'mp3',
        latency: 'balanced'
      })
    })

    if (!response.ok) {
      throw new Error(`Fish Audio API error: ${response.status}`)
    }

    // Get the audio buffer
    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('TTS error:', error)
    return NextResponse.json(
      { error: 'Failed to generate audio: ' + error.message },
      { status: 500 }
    )
  }
}
