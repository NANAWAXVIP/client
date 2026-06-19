'use client'

import { useState } from 'react'
import { Link2, Check, Plus, Minus } from 'lucide-react'

interface GeneratedLink {
  id: string
  token: string
  link: string
  status: 'pending'
  created_at: string
}

interface Props { eventId: string }

export function PreRegSender({ eventId }: Props) {
  const [count,   setCount]   = useState(1)
  const [loading, setLoading] = useState(false)
  const [links,   setLinks]   = useState<GeneratedLink[]>([])
  const [copied,  setCopied]  = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    try {
      const res = await fetch(`/api/events/${eventId}/pre-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      })
      if (res.ok) {
        const newLinks = await res.json()
        setLinks(prev => [...newLinks, ...prev])
      }
    } finally {
      setLoading(false)
    }
  }

  async function copyLink(link: string) {
    await navigator.clipboard.writeText(link)
    setCopied(link)
    setTimeout(() => setCopied(null), 2000)
  }

  async function copyAll() {
    await navigator.clipboard.writeText(links.map(l => l.link).join('\n'))
    setCopied('all')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">

      {/* Compteur + bouton */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-nw-white/15">
          <button
            onClick={() => setCount(c => Math.max(1, c - 1))}
            className="w-10 h-10 flex items-center justify-center text-nw-white/40 hover:text-nw-white transition-colors"
          >
            <Minus size={13} />
          </button>
          <span className="w-10 text-center font-display font-thin text-xl text-nw-white">{count}</span>
          <button
            onClick={() => setCount(c => Math.min(50, c + 1))}
            className="w-10 h-10 flex items-center justify-center text-nw-white/40 hover:text-nw-white transition-colors"
          >
            <Plus size={13} />
          </button>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 bg-nw-camel text-nw-white text-[11px] font-display uppercase tracking-[0.15em] py-3.5 hover:bg-[#a3744e] transition-colors disabled:opacity-50"
        >
          {loading ? 'Génération…' : `Générer ${count} lien${count > 1 ? 's' : ''}`}
        </button>
      </div>

      <p className="text-[10px] text-nw-white/20 leading-relaxed">
        Chaque lien est unique — une seule personne peut s'inscrire par lien.
      </p>

      {/* Liens générés */}
      {links.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-white/30">
              {links.length} lien{links.length > 1 ? 's' : ''} prêt{links.length > 1 ? 's' : ''}
            </p>
            <button
              onClick={copyAll}
              className="flex items-center gap-1.5 text-[10px] font-display uppercase tracking-[0.1em] text-nw-camel hover:text-nw-white transition-colors"
            >
              <Link2 size={10} />
              {copied === 'all' ? 'Copiés ✓' : 'Tout copier'}
            </button>
          </div>

          <div className="space-y-2">
            {links.map(l => (
              <div key={l.id} className="flex items-center gap-3 bg-nw-white/4 border border-nw-white/8 px-4 py-3">
                <span className="text-xs font-body text-nw-white/30 flex-1 min-w-0 truncate">
                  {l.link}
                </span>
                <button
                  onClick={() => copyLink(l.link)}
                  className="flex items-center gap-1.5 text-[10px] font-display uppercase tracking-[0.1em] shrink-0 transition-colors text-nw-camel hover:text-nw-white"
                >
                  {copied === l.link
                    ? <><Check size={10} />Copié</>
                    : <><Link2 size={10} />Copier</>}
                </button>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-nw-white/15 leading-relaxed">
            Envoyez chaque lien à une personne différente — WhatsApp, DM Instagram, email…
          </p>
        </div>
      )}

    </div>
  )
}
