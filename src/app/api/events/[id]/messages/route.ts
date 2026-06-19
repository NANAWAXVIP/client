import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWhatsAppGift } from '@/lib/whatsapp'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('messages')
    .select('*, recipients:message_recipients(guest_id)')
    .eq('event_id', id)
    .order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const formData = await req.formData()

  const content       = formData.get('content') as string
  const recipientMode = formData.get('recipient_mode') as string
  const recipientIds  = formData.get('recipient_ids') as string
  const file          = formData.get('file') as File | null

  if (!content?.trim()) return NextResponse.json({ error: 'Message requis' }, { status: 400 })

  // Résoudre les destinataires
  let query = supabase.from('guests').select('*').eq('event_id', id)
  if (recipientMode === 'confirmed') query = query.eq('status', 'confirmed')
  else if (recipientMode === 'ids' && recipientIds) {
    const ids = JSON.parse(recipientIds) as string[]
    query = query.in('id', ids)
  }
  const { data: guests } = await query

  // Upload fichier vers Supabase Storage
  let file_url: string | undefined
  let file_name: string | undefined
  let file_type: string | undefined

  if (file && file.size > 0) {
    file_name = file.name
    file_type = file.type
    const path = `${id}/${Date.now()}-${file.name}`
    const { data: upload } = await supabase.storage.from('gifts').upload(path, file, { upsert: true })
    if (upload) {
      const { data: pub } = supabase.storage.from('gifts').getPublicUrl(upload.path)
      file_url = pub.publicUrl
    }
  }

  // Insérer le message
  const { data: message, error } = await supabase
    .from('messages')
    .insert({ event_id: id, content: content.trim(), file_url, file_name, file_type })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Insérer les destinataires
  if ((guests ?? []).length > 0) {
    await supabase.from('message_recipients').insert(
      (guests ?? []).map(g => ({ message_id: message.id, guest_id: g.id }))
    )
  }

  // Notifications WhatsApp
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  await Promise.allSettled(
    (guests ?? [])
      .filter(g => g.phone)
      .map(g => sendWhatsAppGift(g, content.trim(), file_name, file_url, baseUrl))
  )

  return NextResponse.json({ ...message, recipient_count: (guests ?? []).length }, { status: 201 })
}
