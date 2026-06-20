'use client'

import { useState } from 'react'
import { X, MessageCircle, Send, UserCheck } from 'lucide-react'

interface Props {
  eventId: string
  onClose: () => void
  onSuccess: () => void
}

type Mode = 'invite' | 'direct'

const inputClass = 'w-full border border-black/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-nw-camel transition-colors placeholder:text-black/25 rounded-sm'
const labelClass = 'block text-[10px] font-display uppercase tracking-[0.15em] text-black/50 mb-2'

export function InviteGuestModal({ eventId, onClose, onSuccess }: Props) {
  const [mode, setMode]     = useState<Mode>('invite')
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [phone, setPhone]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/events/${eventId}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          direct: mode === 'direct',
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Une erreur est survenue.')
        return
      }
      onSuccess()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const hasPhone = phone.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:mx-4 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-black/8">
          <h2 className="font-display font-light text-lg">Ajouter une invitée</h2>
          <button onClick={onClose} className="text-black/30 hover:text-black transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Sélecteur de mode */}
        <div className="grid grid-cols-2 gap-2 px-6 pt-5">
          <button
            type="button"
            onClick={() => setMode('invite')}
            className={`flex flex-col gap-2 p-4 border rounded-sm text-left transition-all ${
              mode === 'invite'
                ? 'border-nw-camel bg-nw-camel/5'
                : 'border-black/10 hover:border-black/30'
            }`}
          >
            <Send size={14} className={mode === 'invite' ? 'text-nw-camel' : 'text-black/30'} />
            <div>
              <p className={`text-xs font-display font-light ${mode === 'invite' ? 'text-nw-camel' : 'text-black/60'}`}>
                Inviter
              </p>
              <p className="text-[10px] text-black/40 mt-0.5 leading-tight">
                Elle reçoit un lien pour confirmer elle-même
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode('direct')}
            className={`flex flex-col gap-2 p-4 border rounded-sm text-left transition-all ${
              mode === 'direct'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-black/10 hover:border-black/30'
            }`}
          >
            <UserCheck size={14} className={mode === 'direct' ? 'text-emerald-600' : 'text-black/30'} />
            <div>
              <p className={`text-xs font-display font-light ${mode === 'direct' ? 'text-emerald-700' : 'text-black/60'}`}>
                Confirmer directement
              </p>
              <p className="text-[10px] text-black/40 mt-0.5 leading-tight">
                Elle est confirmée et reçoit son invitation
              </p>
            </div>
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6 space-y-4">
          <div>
            <label className={labelClass}>Prénom & nom</label>
            <input
              type="text" required value={name} onChange={e => setName(e.target.value)}
              placeholder="Prénom Nom"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Adresse email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1.5">
                <MessageCircle size={10} className="text-[#25D366]" />
                WhatsApp
                <span className="text-black/30 normal-case tracking-normal font-body ml-1">— optionnel</span>
              </span>
            </label>
            <input
              type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className={inputClass}
            />
            {hasPhone && mode === 'invite' && (
              <p className="text-[10px] text-[#25D366]/80 mt-1.5 flex items-center gap-1">
                <MessageCircle size={9} />
                L'invitation sera aussi envoyée sur WhatsApp
              </p>
            )}
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 text-white text-[11px] font-display uppercase tracking-[0.12em] py-4 rounded-sm transition-colors disabled:opacity-50 ${
              mode === 'direct'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-black hover:bg-nw-camel'
            }`}
          >
            {mode === 'direct'
              ? <UserCheck size={13} />
              : <Send size={13} />
            }
            {loading
              ? 'Envoi en cours…'
              : mode === 'direct'
                ? 'Confirmer & envoyer l\'invitation'
                : hasPhone ? 'Envoyer par email + WhatsApp' : 'Envoyer l\'invitation'
            }
          </button>
        </form>
      </div>
    </div>
  )
}
