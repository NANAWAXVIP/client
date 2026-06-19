'use client'

import { useState, useRef } from 'react'
import { Paperclip, X, Send, Users, User } from 'lucide-react'
import type { Guest } from '@/lib/types'

interface Props {
  eventId: string
  guests: Guest[]
}

type RecipientMode = 'confirmed' | 'all' | 'custom'

const labelClass = 'text-[10px] font-display uppercase tracking-[0.15em] text-black mb-2 block'

export function MessageComposer({ eventId, guests }: Props) {
  const [content,     setContent]     = useState('')
  const [mode,        setMode]        = useState<RecipientMode>('confirmed')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [file,        setFile]        = useState<File | null>(null)
  const [loading,     setLoading]     = useState(false)
  const [sent,        setSent]        = useState<{ count: number } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const confirmedGuests = guests.filter(g => g.status === 'confirmed')
  const targetGuests =
    mode === 'confirmed' ? confirmedGuests :
    mode === 'all'       ? guests :
    guests.filter(g => selectedIds.includes(g.id))

  function toggleGuest(id: string) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
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
      const res = await fetch(`/api/events/${eventId}/messages`, { method: 'POST', body: fd })
      if (res.ok) {
        setSent({ count: targetGuests.length })
        setContent(''); setFile(null); setSelectedIds([])
      }
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="border border-nw-sage/40 bg-nw-sage/5 p-6 text-center">
        <p className="font-display font-light text-nw-sage text-lg mb-1">Message envoyé ✓</p>
        <p className="text-xs text-black mt-1">
          Reçu par {sent.count} VIP · par WhatsApp et dans leur espace privé
        </p>
        <button
          onClick={() => setSent(null)}
          className="mt-4 text-[11px] font-display uppercase tracking-[0.1em] text-black hover:text-nw-camel transition-colors"
        >
          Nouveau message
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Destinataires */}
      <div>
        <p className={labelClass}>Destinataires</p>
        <div className="flex gap-2 flex-wrap">
          {([
            { value: 'confirmed', label: `Confirmées (${confirmedGuests.length})`, icon: Users },
            { value: 'all',       label: `Toutes (${guests.length})`,              icon: Users },
            { value: 'custom',    label: 'Choisir',                                icon: User  },
          ] as const).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`flex items-center gap-1.5 text-[11px] font-display uppercase tracking-[0.1em] px-3 py-2 border transition-colors ${
                mode === value
                  ? 'border-nw-camel bg-nw-camel/8 text-nw-camel'
                  : 'border-black/20 text-black hover:border-black/50'
              }`}
            >
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>

        {mode === 'custom' && (
          <div className="mt-3 border border-black/15 divide-y divide-black/8">
            {guests.map(guest => (
              <label key={guest.id} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-black/2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(guest.id)}
                  onChange={() => toggleGuest(guest.id)}
                  className="accent-nw-camel w-3.5 h-3.5"
                />
                <span className="text-sm font-display font-light flex-1 text-black">{guest.name}</span>
                <span className={`text-[9px] font-display uppercase tracking-[0.1em] px-1.5 py-0.5 ${
                  guest.status === 'confirmed' ? 'text-nw-sage bg-nw-sage/10' :
                  guest.status === 'pending'   ? 'text-nw-camel bg-nw-camel/10' :
                                                 'text-black/40 bg-black/5'
                }`}>
                  {guest.status === 'confirmed' ? 'Conf.' : guest.status === 'pending' ? 'Att.' : 'Décl.'}
                </span>
              </label>
            ))}
          </div>
        )}

        {targetGuests.length > 0 && (
          <p className="text-[10px] text-black mt-2">
            {targetGuests.length} destinataire{targetGuests.length > 1 ? 's' : ''} ·{' '}
            {targetGuests.filter(g => g.phone).length} sur WhatsApp
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <p className={labelClass}>Message</p>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Votre cadeau exclusif Nanawax 🖤 En remerciement de votre fidélité..."
          rows={4}
          className="w-full border border-black/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-nw-camel transition-colors resize-none placeholder:text-black/25 text-black"
        />
        <p className="text-[10px] text-black mt-1 text-right">{content.length} caractères</p>
      </div>

      {/* Fichier joint */}
      <div>
        <p className={labelClass}>Fichier joint — optionnel</p>
        {file ? (
          <div className="flex items-center gap-3 border border-nw-camel/30 bg-nw-camel/5 px-4 py-3">
            <Paperclip size={14} className="text-nw-camel shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-light truncate text-black">{file.name}</p>
              <p className="text-[10px] text-black">{(file.size / 1024).toFixed(0)} Ko</p>
            </div>
            <button onClick={() => setFile(null)} className="text-black/40 hover:text-black">
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border border-dashed border-black/20 px-4 py-4 flex items-center justify-center gap-2 hover:border-nw-camel transition-colors"
          >
            <Paperclip size={14} className="text-black/40" />
            <span className="text-[11px] font-display uppercase tracking-[0.1em] text-black">
              Ajouter un fichier (PDF, image, billet…)
            </span>
          </button>
        )}
        <input ref={fileRef} type="file" accept=".pdf,image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        <p className="text-[10px] text-black mt-1">
          Fichiers envoyés via WhatsApp et accessibles dans l'espace VIP.
        </p>
      </div>

      {/* Bouton envoi */}
      <button
        onClick={handleSend}
        disabled={loading || !content.trim() || targetGuests.length === 0}
        className="w-full flex items-center justify-center gap-2 bg-black text-white text-sm font-display uppercase tracking-[0.15em] py-5 hover:bg-nw-camel transition-colors disabled:opacity-30"
      >
        <Send size={14} />
        {loading ? 'Envoi…' : `Envoyer à ${targetGuests.length} VIP`}
      </button>

    </div>
  )
}
