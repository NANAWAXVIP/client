import { NextRequest, NextResponse } from 'next/server'
import { MOCK_MESSAGES, getMockGuestByToken } from '@/lib/mock-data'

interface Params { params: Promise<{ id: string }> }

// Mark message as read — called when guest opens the messages page
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const { token } = await req.json()

  const guest = getMockGuestByToken(token)
  if (!guest) return NextResponse.json({ error: 'Invitée introuvable' }, { status: 404 })

  const message = MOCK_MESSAGES.find(m => m.id === id)
  if (!message) return NextResponse.json({ error: 'Message introuvable' }, { status: 404 })
  if (!message.recipient_ids.includes(guest.id)) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  // In production:
  // await supabase.from('message_recipients').update({ read_at: new Date().toISOString() })
  //   .eq('message_id', id).eq('guest_id', guest.id)

  return NextResponse.json({ success: true })
}
