import { NextResponse } from 'next/server'
import { Session, TTSRequest } from 'fish-audio-sdk'

const fish_session = new Session(process.env.FISH_AUDIO_API_KEY)
const fish_model_id = process.env.RICK_MODEL_ID

export async function POST(request) {
  try {
    const { text } = await request.json()

    const ttsRequest = new TTSRequest({
      text: text,
      reference_id: fish_model_id
    })

    const chunks = []
    for await (const chunk of fish_session.tts(ttsRequest)) {
      chunks.push(chunk)
    }

    const audioBuffer = Buffer.concat(chunks)

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('TTS error:', error)
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    )
  }
}