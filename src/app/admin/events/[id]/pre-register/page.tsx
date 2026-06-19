import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { NanawaxLogo } from '@/components/NanawaxLogo'
import { PreRegSender } from '@/components/admin/PreRegSender'

interface Props { params: Promise<{ id: string }> }

export const revalidate = 0

export default async function PreRegAdminPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event } = await supabase.from('events').select('*').eq('id', id).single()
  const { data: preRegs } = await supabase
    .from('pre_registrations')
    .select('*, guest:guests(name, email)')
    .eq('event_id', id)
    .order('created_at', { ascending: false })

  const list = preRegs ?? []
  const pending    = list.filter(p => p.status === 'pending')
  const registered = list.filter(p => p.status === 'registered')

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
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-camel mb-1">Liens d'inscription</p>
          <h1 className="font-display font-light text-xl">{event?.name ?? 'Événement'}</h1>
          <p className="text-xs text-nw-black/40 mt-1">
            Générez des liens uniques et envoyez-les à vos contacts — chaque lien ne peut être utilisé qu'une seule fois.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="border border-nw-camel/25 bg-nw-camel/5 p-4">
            <p className="text-2xl font-display font-light text-nw-camel">{pending.length}</p>
            <p className="text-[10px] font-display uppercase tracking-[0.12em] text-nw-camel/60 mt-1">Liens en attente</p>
          </div>
          <div className="border border-nw-sage/25 bg-nw-sage/5 p-4">
            <p className="text-2xl font-display font-light text-nw-sage">{registered.length}</p>
            <p className="text-[10px] font-display uppercase tracking-[0.12em] text-nw-sage/60 mt-1">Inscriptions complètes</p>
          </div>
        </div>

        <div className="border border-nw-black/10 p-5">
          <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/40 mb-5">Générer des liens</p>
          <PreRegSender eventId={id} />
        </div>

        {list.length > 0 && (
          <div>
            <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/40 mb-3">Historique</p>
            <div className="divide-y divide-nw-black/6">
              {list.map(p => {
                const date = new Date(p.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                const guest = (p as any).guest
                return (
                  <div key={p.id} className="flex items-center gap-3 py-3">
                    {p.status === 'registered'
                      ? <CheckCircle size={14} className="text-nw-sage shrink-0" />
                      : <Clock size={14} className="text-nw-camel/60 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      {guest
                        ? <p className="text-sm font-display font-light">{guest.name}</p>
                        : <p className="text-sm font-display font-light text-nw-black/30">Lien #{p.id.slice(0, 6)}</p>}
                    </div>
                    <span className="text-[10px] text-nw-black/30">{date}</span>
                    <span className={`text-[9px] font-display uppercase tracking-[0.1em] px-1.5 py-0.5 ${
                      p.status === 'registered' ? 'bg-nw-sage/12 text-nw-sage' : 'bg-nw-camel/10 text-nw-camel/70'
                    }`}>
                      {p.status === 'registered' ? 'Inscrite' : 'En attente'}
                    </span>
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
