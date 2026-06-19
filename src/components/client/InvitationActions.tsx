'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface Props {
  token: string
}

export function InvitationActions({ token }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<'confirm' | 'decline' | null>(null)
  const [declined, setDeclined] = useState(false)

  async function handleConfirm() {
    setLoading('confirm')
    try {
      const res = await fetch(`/api/invitation/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm' }),
      })
      if (res.ok) {
        router.push(`/invitation/${token}/catalog`)
      }
    } finally {
      setLoading(null)
    }
  }

  async function handleDecline() {
    setLoading('decline')
    try {
      await fetch(`/api/invitation/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'decline' }),
      })
      setDeclined(true)
    } finally {
      setLoading(null)
    }
  }

  if (declined) {
    return (
      <div className="text-center space-y-2 py-6">
        <p className="text-sm font-display font-light tracking-wide text-nw-black/70">
          Merci pour votre réponse.
        </p>
        <p className="text-xs text-nw-black/40">
          Nous espérons vous retrouver lors d'une prochaine vente privée.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        loading={loading === 'confirm'}
        onClick={handleConfirm}
      >
        Je confirme ma venue
      </Button>
      <button
        onClick={handleDecline}
        disabled={loading !== null}
        className="w-full text-center text-[11px] font-display font-light tracking-[0.1em] uppercase text-nw-black/40 hover:text-nw-black/70 transition-colors py-2 disabled:opacity-50"
      >
        Je ne peux pas venir
      </button>
    </div>
  )
}
