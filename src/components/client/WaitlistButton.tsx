'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function WaitlistButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/waitlist', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue. Réessayez.')
        return
      }
      router.push(`/rejoindre/${data.token}`)
    } catch {
      setError('Erreur de connexion. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-block bg-nw-camel text-nw-white text-sm font-display font-bold uppercase tracking-[0.18em] px-10 py-5 hover:bg-[#a3744e] transition-colors shadow-lg shadow-nw-camel/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Préparation…' : "M'inscrire sur la liste VIP"}
      </button>
      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}
    </div>
  )
}
