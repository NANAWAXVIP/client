import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()

  const formData = await req.formData()
  const name  = formData.get('name') as string
  const price = Number(formData.get('price'))
  const imageFile = formData.get('image') as File | null

  if (!name || !price) {
    return NextResponse.json({ error: 'Nom et prix requis.' }, { status: 400 })
  }

  let image_url: string | null = null

  if (imageFile && imageFile.size > 0) {
    const ext    = imageFile.name.split('.').pop() ?? 'jpg'
    const path   = `${id}/${Date.now()}.${ext}`
    const buffer = Buffer.from(await imageFile.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from('catalog')
      .upload(path, buffer, { contentType: imageFile.type, upsert: false })

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('catalog').getPublicUrl(path)
      image_url = urlData.publicUrl
    }
  }

  const { data, error } = await supabase
    .from('catalog_items')
    .insert({ event_id: id, name: name.trim(), price, image_url })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
