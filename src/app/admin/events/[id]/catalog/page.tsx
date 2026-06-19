import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { NanawaxLogo } from '@/components/NanawaxLogo'
import { CatalogManager } from '@/components/admin/CatalogManager'
import { MOCK_CATALOG, MOCK_EVENT } from '@/lib/mock-data'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CatalogAdminPage({ params }: Props) {
  const { id } = await params

  // In production: query Supabase
  const items = MOCK_CATALOG.filter(i => i.event_id === id || id === 'evt-1')

  return (
    <div className="min-h-screen bg-nw-white">
      <div className="border-b border-nw-black/8 px-5 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-nw-black/40 hover:text-nw-black transition-colors">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </Link>
        <NanawaxLogo size="sm" />
        <div className="w-8" />
      </div>

      <div className="px-5 pt-6 pb-16 max-w-md mx-auto">
        <div className="mb-6">
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-camel mb-1">Catalogue</p>
          <h1 className="font-display font-light text-xl">{MOCK_EVENT.name}</h1>
          <p className="text-xs text-nw-black/40 mt-1">
            {items.length} pièce{items.length > 1 ? 's' : ''} au catalogue
          </p>
        </div>

        <CatalogManager eventId={id} items={items} />
      </div>
    </div>
  )
}
