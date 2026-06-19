import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PreRegSender } from '@/components/admin/PreRegSender'

export const revalidate = 0

interface Props { params: Promise<{ id: string }> }

export default async function PreRegAdminPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event } = await supabase.from('events').select('*').eq('id', id).single()
  const { data: preRegs } = await supabase
    .from('pre_registrations')
    .select('*, guest:guests(name, email)')
    .eq('event_id', id)
    .order('created_at', { ascending: false })

  const list      = preRegs ?? []
  const pending    = list.filter(p => p.status === 'pending')
  const registered = list.filter(p => p.status === 'registered')

  return (
    <div className="min-h-screen bg-nw-black">

      {/* Header */}
      <header className="sticky top-0 z-20 bg-nw-black/95 backdrop-blur-sm border-b border-nw-white/8 px-5 py-4">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          <Link href="/admin" className="text-nw-white/40 hover:text-nw-white transition-colors">
            <ArrowLeft size={18} strokeWidth={1.5} />
          </Link>
          <Image src="/logo.png" alt="Nanawax" width={65} height={29} unoptimized className="invert" />
          <div className="w-6" />
        </div>
      </header>

      <div className="px-5 pt-8 pb-24 max-w-xl mx-auto space-y-8">

        {/* Titre */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-[0.3em] text-nw-camel mb-2">
            Liens d'inscription
          </p>
          <h1 className="font-display font-thin text-3xl text-nw-white leading-tight">
            {event?.name ?? 'Événement'}
          </h1>
          <p className="text-xs text-nw-white mt-2 leading-relaxed">
            Chaque lien est personnel et à usage unique.<br />
            La personne découvre la marque avant de s'inscrire.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-nw-white/4 border border-nw-camel/20 p-5">
            <p className="text-3xl font-display font-thin text-nw-camel mb-1">{pending.length}</p>
            <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-camel/50">Non utilisés</p>
          </div>
          <div className="bg-nw-white/4 border border-nw-sage/20 p-5">
            <p className="text-3xl font-display font-thin text-nw-sage mb-1">{registered.length}</p>
            <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-sage/50">Inscriptions complètes</p>
          </div>
        </div>

        {/* Générateur */}
        <div className="bg-nw-white/4 border border-nw-white/8 p-6">
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-white mb-6">
            Générer des liens
          </p>
          <PreRegSender eventId={id} />
        </div>

        {/* Historique */}
        {list.length > 0 && (
          <div>
            <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-white mb-4">
              Historique · {list.length}
            </p>
            <div className="divide-y divide-nw-white/6">
              {list.map(p => {
                const date  = new Date(p.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                const guest = (p as any).guest
                return (
                  <div key={p.id} className="flex items-center gap-3 py-3.5">
                    {p.status === 'registered'
                      ? <CheckCircle size={14} className="text-nw-sage shrink-0" />
                      : <Clock size={14} className="text-nw-camel/40 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      {guest
                        ? <p className="text-sm font-display font-light text-nw-white">{guest.name}</p>
                        : <p className="text-sm font-display font-light text-nw-white">Lien #{p.id.slice(0, 6)}</p>}
                      {guest?.email && (
                        <p className="text-xs text-nw-white truncate mt-0.5">{guest.email}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-nw-white shrink-0">{date}</span>
                    <span className={`text-[9px] font-display uppercase tracking-[0.1em] px-2 py-1 shrink-0 ${
                      p.status === 'registered'
                        ? 'bg-nw-sage/15 text-nw-sage'
                        : 'bg-nw-camel/10 text-nw-camel/60'
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
