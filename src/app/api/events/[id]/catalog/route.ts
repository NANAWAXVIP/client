import { NextRequest, NextResponse } from 'next/server'
import { MOCK_CATALOG } from '@/lib/mock-data'
import { generateToken } from '@/lib/utils'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const items = MOCK_CATALOG.filter(i => i.event_id === id || id === 'evt-1')
  return NextResponse.json(items)
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  const formData = await req.formData()
  const name = formData.get('name') as string
  const price = Number(formData.get('price'))
  const imageFile = formData.get('image') as File | null

  if (!name || !price) {
    return NextResponse.json({ error: 'Nom et prix requis' }, { status: 400 })
  }

  let image_url: string | undefined
  if (imageFile) {
    // In production: upload to Supabase Storage
    // const supabase = await createClient()
    // const { data } = await supabase.storage.from('catalog').upload(`${id}/${generateToken()}`, imageFile)
    // image_url = supabase.storage.from('catalog').getPublicUrl(data!.path).data.publicUrl
    image_url = undefined
  }

  const newItem = {
    id: generateToken().slice(0, 12),
    event_id: id,
    name, price, image_url,
    created_at: new Date().toISOString(),
  }

  // In production:
  // const supabase = await createClient()
  // const { data } = await supabase.from('catalog_items').insert(newItem).select().single()

  return NextResponse.json(newItem, { status: 201 })
}
