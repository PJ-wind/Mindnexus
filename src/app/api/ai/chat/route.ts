import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MODE_PROMPTS: Record<string, string> = {
  general:   'You are in general support mode. Provide warm, empathetic emotional support.',
  grief:     'You are in grief support mode. Be especially gentle and compassionate. Acknowledge the pain of loss.',
  breathing: 'You are in breathing & calm mode. Guide the user through breathing exercises and grounding techniques.',
  career:    'You are in career counselling mode. Help the user explore career concerns, values, and direction.',
  addiction: 'You are in addiction support mode. Be non-judgmental, supportive, and encourage professional help.',
  guided:    'You are in guided therapy mode. Use CBT-inspired techniques to help the user identify and challenge unhelpful thoughts.',
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { message, mode = 'general', history = [] } = await req.json()
    const modeInstructions = MODE_PROMPTS[mode] || MODE_PROMPTS.general

    const systemPrompt = `You are Nexus, a compassionate AI mental health companion on the MindNexus platform — Nigeria's leading virtual counselling platform.

${modeInstructions}

Your approach:
- Always respond with genuine warmth, empathy, and care
- Use active listening — reflect what the person says before offering thoughts
- Never diagnose, prescribe, or replace a licensed therapist
- Keep responses to 3-5 sentences — conversational, not clinical
- Ask one gentle, open follow-up question at the end of each response
- Speak in plain, accessible English — no clinical jargon
- Be aware this platform primarily serves clients from Nigeria and Africa
- If someone expresses suicidal thoughts or immediate danger, gently direct them to the crisis button and professional emergency services
- You are supportive but clear that you supplement, not replace, professional therapy

Remember: You are a companion, not a clinician.`

    const messages = [
      ...history.slice(-10).map((h: any) => ({ role: h.role, content: h.content })),
      { role: 'user' as const, content: message }
    ]

    const response = await anthropic.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 400,
      system:     systemPrompt,
      messages
    })

    const reply = response.content[0].type === 'text'
      ? response.content[0].text
      : 'I am here with you. Please tell me more about what you are experiencing.'

    return NextResponse.json({ reply })

  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json({
      reply: 'I am here with you. There was a brief connection issue — please try again in a moment.'
    })
  }
}
