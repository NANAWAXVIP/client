'use client'

import { useState } from 'react'
import { X, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  eventId: string
  onClose: () => void
  onSuccess: () => void
}

export function InviteGuestModal({ eventId, onClose, onSuccess }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      <div className="absolute inset-0 bg-nw-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-nw-white w-full sm:max-w-md sm:mx-4 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-light text-lg tracking-wide">Inviter une cliente</h2>
          <button onClick={onClose} className="text-nw-black/40 hover:text-nw-black">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">
              Prénom & nom
            </label>
            <input
              type="text" required value={name} onChange={e => setName(e.target.value)}
              placeholder="Amara Diallo"
              className="w-full border border-black bg-transparent px-4 py-3 text-sm outline-none focus:border-nw-camel transition-colors placeholder:text-nw-black/25"
            />
          </div>

          <div>
            <label className="block text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">
              Adresse email
            </label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="amara@example.com"
              className="w-full border border-black bg-transparent px-4 py-3 text-sm outline-none focus:border-nw-camel transition-colors placeholder:text-nw-black/25"
            />
          </div>

          <div>
            <label className="block text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">
              <span className="flex items-center gap-1.5">
                <MessageCircle size={10} className="text-[#25D366]" />
                WhatsApp
                <span className="text-nw-black/30 normal-case tracking-normal font-body ml-1">— optionnel</span>
              </span>
            </label>
            <input
              type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className="w-full border border-black bg-transparent px-4 py-3 text-sm outline-none focus:border-[#25D366] transition-colors placeholder:text-nw-black/25"
            />
            {hasPhone && (
              <p className="text-[10px] text-[#25D366]/80 mt-1.5 flex items-center gap-1">
                <MessageCircle size={9} />
                L'invitation sera aussi envoyée sur WhatsApp
              </p>
            )}
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="pt-2">
            <Button type="submit" variant="secondary" size="md" className="w-full" loading={loading}>
              Envoyer l'invitation
            </Button>
            <p className="text-[10px] text-nw-black/35 text-center mt-2">
              {hasPhone ? 'Envoi par email + WhatsApp' : 'Envoi par email uniquement'}
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
