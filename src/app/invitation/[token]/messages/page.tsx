import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, Gift } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { NanawaxLogo } from '@/components/NanawaxLogo'

interface Props { params: Promise<{ token: string }> }

export const revalidate = 0

function FileIcon({ type }: { type?: string }) {
  if (!type) return <Gift size={18} className="text-nw-camel" />
  if (type.startsWith('image/')) return <span className="text-lg">🖼️</span>
  return <FileText size={18} className="text-nw-camel" />
}

export default async function GuestMessagesPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  const { data: guest } = await supabase
    .from('guests')
    .select('*')
    .eq('token', token)
    .single()

  if (!guest) notFound()
  if (guest.status !== 'confirmed') redirect(`/invitation/${token}`)

  const { data: rows } = await supabase
    .from('message_recipients')
    .select('*, message:messages(*)')
    .eq('guest_id', guest.id)
    .order('created_at', { ascending: false })

  const messages = (rows ?? []).map(r => ({ ...r.message, read_at: r.read_at }))

  // Mark all as read
  await supabase
    .from('message_recipients')
    .update({ read_at: new Date().toISOString() })
    .eq('guest_id', guest.id)
    .is('read_at', null)

  return (
    <div className="min-h-screen bg-nw-white">
      <div className="sticky top-0 z-10 bg-nw-white/95 backdrop-blur-sm border-b border-black">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href={`/invitation/${token}`} className="text-nw-black/40 hover:text-nw-black transition-colors">
            <ArrowLeft size={16} strokeWidth={1.5} />
          </Link>
          <NanawaxLogo size="sm" />
          <div className="w-5" />
        </div>
        <div className="px-4 pb-3">
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-black/35">Vos cadeaux & messages</p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-20 max-w-md mx-auto">
        {messages.length === 0 ? (
          <div className="mt-16 text-center">
            <div className="w-full h-32 pattern-wax-camel opacity-[0.06] mb-8 mx-auto" />
            <p className="font-display font-light text-lg text-nw-black/50">Aucun message pour l'instant</p>
            <p className="text-sm text-nw-black/30 mt-2">Nanawax vous enverra ici vos cadeaux exclusifs.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg: any) => {
              const date = new Date(msg.created_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
              return (
                <div key={msg.id} className="border border-black overflow-hidden">
                  <div className="bg-nw-black px-4 py-3 flex items-center justify-between">
                    <NanawaxLogo size="sm" inverted />
                    <span className="text-[10px] font-display text-nw-white/40">{date}</span>
                  </div>
                  <div className="px-4 py-5">
                    <p className="text-sm font-body leading-relaxed text-nw-black/80">{msg.content}</p>
                  </div>
                  {msg.file_name && (
                    <div className="border-t border-black px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-nw-camel/10 flex items-center justify-center shrink-0">
                        <FileIcon type={msg.file_type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-display font-light truncate">{msg.file_name}</p>
                        <p className="text-[10px] text-nw-black/35 mt-0.5">Fichier joint</p>
                      </div>
                      {msg.file_url && (
                        <a href={msg.file_url} download={msg.file_name} target="_blank" rel="noreferrer"
                          className="w-9 h-9 bg-nw-camel flex items-center justify-center hover:bg-[#a3744e] transition-colors">
                          <Download size={14} className="text-nw-white" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
