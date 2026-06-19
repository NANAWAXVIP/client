import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CatalogManager } from '@/components/admin/CatalogManager'

export const revalidate = 0

interface Props { params: Promise<{ id: string }> }

export default async function CatalogAdminPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: event }, { data: items }] = await Promise.all([
    supabase.from('events').select('name').eq('id', id).single(),
    supabase.from('catalog_items').select('*').eq('event_id', id).order('created_at', { ascending: false }),
  ])

  const list = items ?? []

  return (
    <div className="min-h-screen bg-white">

      <header className="sticky top-0 z-20 bg-black border-b border-white/10 px-5 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Link href="/admin" className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={18} strokeWidth={1.5} />
          </Link>
          <a href="/"><Image src="/logo.png" alt="Nanawax" width={65} height={29} unoptimized className="invert" /></a>
          <div className="w-6" />
        </div>
      </header>

      <div className="px-5 pt-8 pb-24 max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-[10px] font-display uppercase tracking-[0.3em] text-nw-camel mb-2">
            Catalogue privé
          </p>
          <h1 className="font-display font-thin text-3xl text-black leading-tight">
            {event?.name ?? '—'}
          </h1>
          <p className="text-xs text-black/50 mt-1">
            {list.length} pièce{list.length !== 1 ? 's' : ''} au catalogue
          </p>
        </div>

        <CatalogManager eventId={id} items={list} />
      </div>

    </div>
  )
}
