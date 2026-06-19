import { notFound } from 'next/navigation'
import { MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NanawaxLogo } from '@/components/NanawaxLogo'
import { InvitationActions } from '@/components/client/InvitationActions'
import { formatDate, formatTime } from '@/lib/utils'

interface Props { params: Promise<{ token: string }> }

export const revalidate = 0

export default async function InvitationPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  const { data: guest } = await supabase
    .from('guests')
    .select('*')
    .eq('token', token)
    .single()

  if (!guest) notFound()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', guest.event_id)
    .single()

  if (!event) notFound()

  const { count: confirmedCount } = await supabase
    .from('guests')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event.id)
    .eq('status', 'confirmed')

  const { count: messageCount } = await supabase
    .from('message_recipients')
    .select('*', { count: 'exact', head: true })
    .eq('guest_id', guest.id)

  const confirmed = confirmedCount ?? 0
  const remaining = Math.max(0, event.capacity - confirmed)
  const pct = Math.round((confirmed / event.capacity) * 100)
  const unreadCount = messageCount ?? 0
  const isConfirmed = guest.status === 'confirmed'
  const isDeclined  = guest.status === 'declined'

  return (
    <div className="min-h-screen bg-nw-white flex flex-col">
      <div className="relative overflow-hidden bg-nw-black">
        <div className="absolute inset-0 pattern-wax opacity-[0.04]" />
        <div className="relative z-10 px-6 pt-8 pb-10">
          <div className="flex justify-center mb-10">
            <NanawaxLogo size="md" inverted />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-display font-light tracking-[0.3em] uppercase text-nw-camel mb-4">
              Invitation privée
            </p>
            <h1 className="font-display font-thin text-4xl text-nw-white leading-none mb-3">
              Vous êtes<br />invitée
            </h1>
            <p className="text-sm font-display font-light text-nw-white/60 tracking-wide">
              {guest.name}
            </p>
          </div>
        </div>
        <div className="h-px bg-nw-camel/40" />
      </div>

      <div className="flex-1 px-5 py-8 max-w-md mx-auto w-full space-y-6">
        <div className="text-center py-2">
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-black/35 mb-1">Événement</p>
          <p className="font-display font-light text-lg">{event.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="border border-black p-4">
            <Calendar size={14} className="text-nw-camel mb-3" strokeWidth={1.5} />
            <p className="font-display font-light text-sm leading-snug">
              {formatDate(event.date).split(' ').slice(0, 3).join(' ')}
            </p>
            <p className="text-xs text-nw-black/45 mt-1">{formatTime(event.date)}</p>
          </div>
          <div className="border border-black p-4">
            <MapPin size={14} className="text-nw-camel mb-3" strokeWidth={1.5} />
            <p className="font-display font-light text-sm leading-snug">
              {event.location.split('—')[0].trim()}
            </p>
            <p className="text-xs text-nw-black/45 mt-1 truncate">
              {event.location.split('—')[1]?.trim()}
            </p>
          </div>
        </div>

        <div className="border border-black p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/40">
              Places disponibles
            </p>
            <p className="text-[10px] font-display uppercase tracking-[0.1em] text-nw-camel">
              {remaining} / {event.capacity}
            </p>
          </div>
          <div className="h-1 bg-nw-black/8 rounded-full overflow-hidden">
            <div className="h-full bg-nw-camel rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[10px] text-nw-black/35 mt-2">
            {confirmed} personne{confirmed > 1 ? 's' : ''} ont déjà confirmé
          </p>
        </div>

        <div className="pt-2">
          {isConfirmed ? (
            <div className="space-y-3">
              <div className="border border-nw-sage/30 bg-nw-sage/8 p-4 text-center">
                <p className="text-sm font-display font-light text-nw-sage">Votre venue est confirmée ✓</p>
              </div>
              <Link href={`/invitation/${token}/catalog`} className="block w-full bg-nw-camel text-nw-white text-center py-4 text-[11px] font-display uppercase tracking-[0.08em] hover:bg-[#a3744e] transition-colors">
                Voir le catalogue privé →
              </Link>
              {event.time_slots?.length > 0 && (
                <Link href={`/invitation/${token}/schedule`} className="block w-full text-center text-[11px] font-display uppercase tracking-[0.08em] text-nw-black/40 hover:text-nw-camel transition-colors py-2">
                  Choisir mon créneau horaire
                </Link>
              )}
              <Link href={`/invitation/${token}/messages`} className="flex items-center justify-between border border-black px-4 py-3.5 hover:border-nw-camel/30 transition-colors mt-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎁</span>
                  <div>
                    <p className="text-xs font-display font-light">Cadeaux & messages</p>
                    <p className="text-[10px] text-nw-black/35 mt-0.5">Vos exclusivités Nanawax</p>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-nw-camel text-nw-white text-[10px] flex items-center justify-center font-display">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>
          ) : isDeclined ? (
            <div className="border border-black p-5 text-center">
              <p className="text-sm font-display font-light text-nw-black/50">Vous avez décliné cette invitation.</p>
              <p className="text-xs text-nw-black/30 mt-1">Nous espérons vous retrouver bientôt.</p>
            </div>
          ) : (
            <InvitationActions token={token} />
          )}
        </div>
      </div>
    </div>
  )
}
