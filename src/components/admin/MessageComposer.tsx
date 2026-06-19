'use client'

import { useState, useRef } from 'react'
import { Paperclip, X, Send, Users, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Guest } from '@/lib/types'

interface Props {
  eventId: string
  guests: Guest[]
}

type RecipientMode = 'confirmed' | 'all' | 'custom'

export function MessageComposer({ eventId, guests }: Props) {
  const [content, setContent] = useState('')
  const [mode, setMode] = useState<RecipientMode>('confirmed')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState<{ count: number } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const confirmedGuests = guests.filter(g => g.status === 'confirmed')
  const targetGuests =
    mode === 'confirmed' ? confirmedGuests :
    mode === 'all' ? guests :
    guests.filter(g => selectedIds.includes(g.id))

  function toggleGuest(id: string) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  async function handleSend() {
    if (!content.trim() || targetGuests.length === 0) return
    setLoading(true)
    try {
      const fd = new FormData()
      fd.set('content', content.trim())
      fd.set('recipient_mode', mode === 'custom' ? 'ids' : mode)
      if (mode === 'custom') fd.set('recipient_ids', JSON.stringify(selectedIds))
      if (file) fd.set('file', file)

      const res = await fetch(`/api/events/${eventId}/messages`, {
        method: 'POST',
        body: fd,
      })
      if (res.ok) {
        setSent({ count: targetGuests.length })
        setContent('')
        setFile(null)
        setSelectedIds([])
      }
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="border border-nw-sage/30 bg-nw-sage/5 p-6 text-center">
        <p className="font-display font-light text-nw-sage text-lg mb-1">Message envoyé ✓</p>
        <p className="text-xs text-nw-black/45">
          Reçu par {sent.count} VIP · par WhatsApp et dans leur espace privé
        </p>
        <button
          onClick={() => setSent(null)}
          className="mt-4 text-[11px] font-display uppercase tracking-[0.1em] text-nw-black/40 hover:text-nw-black transition-colors"
        >
          Nouveau message
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Recipient selector */}
      <div>
        <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-3">
          Destinataires
        </p>
        <div className="flex gap-2 flex-wrap">
          {([
            { value: 'confirmed', label: `Confirmées (${confirmedGuests.length})`, icon: Users },
            { value: 'all', label: `Toutes (${guests.length})`, icon: Users },
            { value: 'custom', label: 'Choisir', icon: User },
          ] as const).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`flex items-center gap-1.5 text-[11px] font-display uppercase tracking-[0.1em] px-3 py-2 border transition-colors ${
                mode === value
                  ? 'border-nw-camel bg-nw-camel/8 text-nw-camel'
                  : 'border-nw-black/12 text-nw-black/50 hover:border-nw-black/30'
              }`}
            >
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>

        {/* Custom guest picker */}
        {mode === 'custom' && (
          <div className="mt-3 border border-nw-black/10 divide-y divide-nw-black/6">
            {guests.map(guest => (
              <label key={guest.id} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-nw-black/2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(guest.id)}
                  onChange={() => toggleGuest(guest.id)}
                  className="accent-nw-camel w-3.5 h-3.5"
                />
                <span className="text-sm font-display font-light flex-1">{guest.name}</span>
                <span className={`text-[9px] font-display uppercase tracking-[0.1em] px-1.5 py-0.5 ${
                  guest.status === 'confirmed' ? 'text-nw-sage bg-nw-sage/10' :
                  guest.status === 'pending' ? 'text-nw-camel bg-nw-camel/10' :
                  'text-nw-black/30 bg-nw-black/5'
                }`}>
                  {guest.status === 'confirmed' ? 'Conf.' : guest.status === 'pending' ? 'Att.' : 'Décl.'}
                </span>
                {guest.phone && (
                  <span className="text-[9px] text-[#25D366]/70">WA</span>
                )}
              </label>
            ))}
          </div>
        )}

        {targetGuests.length > 0 && (
          <p className="text-[10px] text-nw-black/35 mt-2">
            {targetGuests.length} destinataire{targetGuests.length > 1 ? 's' : ''} ·{' '}
            {targetGuests.filter(g => g.phone).length} sur WhatsApp
          </p>
        )}
      </div>

      {/* Message textarea */}
      <div>
        <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">
          Message
        </p>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Votre cadeau exclusif Nanawax 🖤 En remerciement de votre fidélité..."
          rows={4}
          className="w-full border border-nw-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-nw-camel transition-colors resize-none placeholder:text-nw-black/25"
        />
        <p className="text-[10px] text-nw-black/30 mt-1 text-right">{content.length} caractères</p>
      </div>

      {/* File attachment */}
      <div>
        <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">
          Fichier joint — optionnel
        </p>
        {file ? (
          <div className="flex items-center gap-3 border border-nw-camel/30 bg-nw-camel/5 px-4 py-3">
            <Paperclip size={14} className="text-nw-camel shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-light truncate">{file.name}</p>
              <p className="text-[10px] text-nw-black/35">{(file.size / 1024).toFixed(0)} Ko</p>
            </div>
            <button onClick={() => setFile(null)} className="text-nw-black/30 hover:text-nw-black/60">
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border border-dashed border-nw-black/15 px-4 py-4 flex items-center justify-center gap-2 hover:border-nw-camel/40 transition-colors"
          >
            <Paperclip size={14} className="text-nw-black/30" />
            <span className="text-[11px] font-display uppercase tracking-[0.1em] text-nw-black/40">
              Ajouter un fichier (PDF, image, billet…)
            </span>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,image/*,.png,.jpg,.jpeg"
          className="hidden"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
        />
        <p className="text-[10px] text-nw-black/30 mt-1">
          Les fichiers sont envoyés via WhatsApp et accessibles dans l'espace de chaque VIP.
        </p>
      </div>

      {/* Send button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full flex items-center gap-2"
        loading={loading}
        disabled={!content.trim() || targetGuests.length === 0}
        onClick={handleSend}
      >
        <Send size={14} />
        Envoyer à {targetGuests.length} VIP
      </Button>
    </div>
  )
}
