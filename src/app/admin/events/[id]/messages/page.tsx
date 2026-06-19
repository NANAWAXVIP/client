import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MessageComposer } from '@/components/admin/MessageComposer'

export const revalidate = 0

interface Props { params: Promise<{ id: string }> }

export default async function AdminMessagesPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: event }, { data: guests }, { data: messages }] = await Promise.all([
    supabase.from('events').select('name').eq('id', id).single(),
    supabase.from('guests').select('*').eq('event_id', id).order('created_at', { ascending: false }),
    supabase.from('messages').select('*').eq('event_id', id).order('created_at', { ascending: false }),
  ])

  return (
    <div className="min-h-screen bg-white">

      {/* Header noir */}
      <header className="sticky top-0 z-20 bg-black border-b border-white/10 px-5 py-4">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          <Link href="/admin" className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={18} strokeWidth={1.5} />
          </Link>
          <a href="/admin"><Image src="/logo.png" alt="Nanawax" width={65} height={29} unoptimized className="invert" /></a>
          <div className="w-6" />
        </div>
      </header>

      <div className="px-5 pt-8 pb-16 max-w-xl mx-auto space-y-8">

        {/* Titre */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-[0.3em] text-nw-camel mb-2">
            Messagerie & cadeaux
          </p>
          <h1 className="font-display font-thin text-3xl text-black leading-tight">
            {event?.name ?? 'Événement'}
          </h1>
          <p className="text-xs text-black mt-2 leading-relaxed">
            Envoyez des cadeaux, billets et messages exclusifs à vos VIP.
          </p>
        </div>

        {/* Composer */}
        <MessageComposer eventId={id} guests={guests ?? []} />

        {/* Historique */}
        {(messages ?? []).length > 0 && (
          <div>
            <p className="text-[10px] font-display uppercase tracking-[0.15em] text-black mb-4">
              Envois précédents
            </p>
            <div className="space-y-3">
              {(messages ?? []).map(msg => {
                const date = new Date(msg.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long',
                })
                return (
                  <div key={msg.id} className="border border-black/15 p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm font-display font-light leading-snug flex-1 text-black">
                        {msg.content.length > 80 ? msg.content.slice(0, 80) + '…' : msg.content}
                      </p>
                      <span className="text-[10px] font-display text-black whitespace-nowrap shrink-0">{date}</span>
                    </div>
                    {msg.file_name && (
                      <span className="text-[10px] font-display uppercase tracking-[0.1em] bg-nw-camel/10 text-nw-camel px-2 py-0.5">
                        📎 {msg.file_name}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
