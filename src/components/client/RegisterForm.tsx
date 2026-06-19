'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { NanawaxLogo } from '@/components/NanawaxLogo'

interface Props {
  token: string
}

export function RegisterForm({ token }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/register/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue.')
        return
      }
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center space-y-5 py-6">
        {/* Success state */}
        <div className="flex justify-center mb-2">
          <NanawaxLogo size="md" />
        </div>
        <div>
          <p className="font-display font-light text-xl mb-2">Inscription enregistrée</p>
          <p className="text-sm text-nw-black/55 leading-relaxed">
            Merci {name.split(' ')[0]} 🖤<br />
            Nanawax vous contactera pour confirmer votre place.
          </p>
        </div>
        <div className="h-px bg-nw-camel/20 mx-8" />
        <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/30">
          Vous recevrez un email et un message WhatsApp.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">
          Prénom & nom
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Amara Diallo"
          autoComplete="name"
          className="w-full border border-nw-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-nw-camel transition-colors placeholder:text-nw-black/25"
        />
      </div>

      <div>
        <label className="block text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">
          Adresse email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="amara@example.com"
          autoComplete="email"
          className="w-full border border-nw-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-nw-camel transition-colors placeholder:text-nw-black/25"
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 px-3 py-2">{error}</p>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={loading}
        >
          Rejoindre la liste VIP
        </Button>
      </div>
    </form>
  )
}
