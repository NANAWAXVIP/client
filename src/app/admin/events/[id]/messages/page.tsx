import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { NanawaxLogo } from '@/components/NanawaxLogo'
import { MessageComposer } from '@/components/admin/MessageComposer'
import { MOCK_GUESTS, MOCK_MESSAGES, MOCK_EVENT } from '@/lib/mock-data'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminMessagesPage({ params }: Props) {
  const { id } = await params

  const guests = MOCK_GUESTS.filter(g => g.event_id === 'evt-1' || id === 'evt-1')
  const messages = MOCK_MESSAGES

  return (
    <div className="min-h-screen bg-nw-white">
      <div className="border-b border-nw-black/8 px-5 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-nw-black/40 hover:text-nw-black transition-colors">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </Link>
        <NanawaxLogo size="sm" />
        <div className="w-8" />
      </div>

      <div className="px-5 pt-6 pb-16 max-w-xl mx-auto space-y-8">
        <div>
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-camel mb-1">Messagerie</p>
          <h1 className="font-display font-light text-xl">{MOCK_EVENT.name}</h1>
          <p className="text-xs text-nw-black/40 mt-1">
            Envoyez des cadeaux, billets et messages exclusifs à vos VIP.
          </p>
        </div>

        {/* Composer */}
        <MessageComposer eventId={id} guests={guests} />

        {/* Sent messages history */}
        {messages.length > 0 && (
          <div>
            <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/40 mb-4">
              Envois précédents
            </p>
            <div className="space-y-3">
              {messages.map(msg => {
                const recipientCount = msg.recipient_ids.length
                const date = new Date(msg.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long',
                })
                return (
                  <div key={msg.id} className="border border-nw-black/8 p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm font-display font-light leading-snug flex-1">
                        {msg.content.length > 80 ? msg.content.slice(0, 80) + '…' : msg.content}
                      </p>
                      <span className="text-[10px] font-display text-nw-black/30 whitespace-nowrap shrink-0">{date}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {msg.file_name && (
                        <span className="text-[10px] font-display uppercase tracking-[0.1em] bg-nw-camel/10 text-nw-camel px-2 py-0.5">
                          📎 {msg.file_name}
                        </span>
                      )}
                      <span className="text-[10px] text-nw-black/35">
                        Envoyé à {recipientCount} VIP
                      </span>
                    </div>
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
