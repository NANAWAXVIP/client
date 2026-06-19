'use client'

import { useState } from 'react'
import { Link2, Check, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface GeneratedLink {
  id: string
  token: string
  link: string
  status: 'pending'
  created_at: string
}

interface Props {
  eventId: string
}

export function PreRegSender({ eventId }: Props) {
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [links, setLinks] = useState<GeneratedLink[]>([])
  const [copied, setCopied] = useState<string | null>(null)

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
    const text = links.map(l => l.link).join('\n')
    await navigator.clipboard.writeText(text)
    setCopied('all')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-5">
      {/* Générateur */}
      <div>
        <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-3">
          Nombre de liens à générer
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-nw-black/15">
            <button
              onClick={() => setCount(c => Math.max(1, c - 1))}
              className="w-10 h-10 flex items-center justify-center text-nw-black/40 hover:text-nw-black hover:bg-nw-black/4 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center font-display font-light text-lg">{count}</span>
            <button
              onClick={() => setCount(c => Math.min(50, c + 1))}
              className="w-10 h-10 flex items-center justify-center text-nw-black/40 hover:text-nw-black hover:bg-nw-black/4 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <Button
            variant="primary"
            size="md"
            loading={loading}
            onClick={handleGenerate}
            className="flex-1"
          >
            Générer {count} lien{count > 1 ? 's' : ''}
          </Button>
        </div>
        <p className="text-[10px] text-nw-black/30 mt-2">
          Chaque lien est unique et à usage unique — une seule personne peut s'inscrire par lien.
        </p>
      </div>

      {/* Liens générés */}
      {links.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/40">
              Liens générés · {links.length}
            </p>
            <button
              onClick={copyAll}
              className="text-[10px] font-display uppercase tracking-[0.1em] text-nw-camel hover:text-nw-black/60 transition-colors flex items-center gap-1"
            >
              <Link2 size={10} />
              {copied === 'all' ? 'Tous copiés ✓' : 'Tout copier'}
            </button>
          </div>

          <div className="space-y-2">
            {links.map(l => (
              <div key={l.id} className="flex items-center gap-3 border border-nw-black/8 px-3 py-2.5">
                <span className="text-xs font-body text-nw-black/40 flex-1 min-w-0 truncate">
                  {l.link}
                </span>
                <button
                  onClick={() => copyLink(l.link)}
                  className="flex items-center gap-1 text-[10px] font-display uppercase tracking-[0.1em] shrink-0 transition-colors text-nw-camel hover:text-nw-black/60"
                >
                  {copied === l.link
                    ? <><Check size={10} /> Copié</>
                    : <><Link2 size={10} /> Copier</>
                  }
                </button>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-nw-black/25 mt-3 leading-relaxed">
            Envoyez chaque lien à une personne différente via WhatsApp, DM Instagram ou autre.
            Le lien ne fonctionne qu'une seule fois.
          </p>
        </div>
      )}
    </div>
  )
}
