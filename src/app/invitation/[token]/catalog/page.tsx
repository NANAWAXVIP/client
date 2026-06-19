import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { NanawaxLogo } from '@/components/NanawaxLogo'
import { FavoriteButton } from '@/components/client/FavoriteButton'
import { formatPrice } from '@/lib/utils'

interface Props { params: Promise<{ token: string }> }

export const revalidate = 0

const PATTERN_POSITIONS = [1, 5]

export default async function CatalogPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  const { data: guest } = await supabase
    .from('guests')
    .select('*')
    .eq('token', token)
    .single()

  if (!guest) notFound()
  if (guest.status !== 'confirmed') redirect(`/invitation/${token}`)

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', guest.event_id)
    .single()

  const { data: items } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('event_id', guest.event_id)
    .order('created_at', { ascending: true })

  const { data: favRows } = await supabase
    .from('favorites')
    .select('catalog_item_id')
    .eq('guest_id', guest.id)

  const favoritedIds = new Set((favRows ?? []).map(f => f.catalog_item_id))
  const hasSlots = (event?.time_slots ?? []).length > 0

  return (
    <div className="min-h-screen bg-nw-white">
      <div className="sticky top-0 z-20 bg-nw-white/95 backdrop-blur-sm border-b border-nw-black/8">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href={`/invitation/${token}`} className="flex items-center gap-2 text-nw-black/40 hover:text-nw-black transition-colors">
            <ArrowLeft size={16} strokeWidth={1.5} />
          </Link>
          <NanawaxLogo size="sm" />
          <div className="w-8" />
        </div>
        <div className="px-4 pb-3">
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-black/35">
            Catalogue privé — {event?.name}
          </p>
        </div>
      </div>

      <div className="px-4 pt-5 pb-32 grid grid-cols-2 gap-3">
        {(items ?? []).map((item, index) => (
          <div key={item.id} className="group">
            <div className="relative aspect-[4/5] overflow-hidden">
              {item.image_url ? (
                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
              ) : (
                <div className={`absolute inset-0 flex items-center justify-center ${
                  PATTERN_POSITIONS.includes(index) ? 'pattern-wax-camel opacity-20' : 'bg-nw-black/5'
                }`}>
                  {!PATTERN_POSITIONS.includes(index) && (
                    <span className="text-[8px] font-display uppercase tracking-[0.2em] text-nw-black/20">Photo</span>
                  )}
                </div>
              )}
              <div className="absolute top-2 right-2">
                <FavoriteButton itemId={item.id} guestToken={token} initialFavorited={favoritedIds.has(item.id)} />
              </div>
            </div>
            <div className="pt-2.5 pb-1">
              <p className="text-xs font-display font-light leading-snug">{item.name}</p>
              <p className="text-xs text-nw-camel mt-0.5">{formatPrice(item.price)}</p>
            </div>
          </div>
        ))}

        {(items ?? []).length === 0 && (
          <div className="col-span-2 text-center py-16">
            <p className="text-sm text-nw-black/30 font-display font-light">Catalogue en cours de préparation.</p>
          </div>
        )}
      </div>

      {hasSlots && (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-nw-white/95 backdrop-blur-sm border-t border-nw-black/8 p-4">
          <Link href={`/invitation/${token}/schedule`} className="block w-full bg-nw-black text-nw-white text-center py-4 text-[11px] font-display uppercase tracking-[0.1em] hover:bg-[#333] transition-colors max-w-md mx-auto">
            Choisir mon créneau de passage →
          </Link>
        </div>
      )}
    </div>
  )
}
