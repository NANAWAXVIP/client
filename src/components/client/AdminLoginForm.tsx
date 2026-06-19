'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function AdminLoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Mot de passe incorrect.')
        return
      }
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label className="block text-[10px] font-display uppercase tracking-[0.15em] text-nw-white/40 mb-2">
          Mot de passe
        </label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#2C2118] border border-[#5C4A38] text-nw-white px-4 py-3.5 text-sm outline-none focus:border-nw-camel transition-colors placeholder:text-nw-white/30 pr-11"
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-nw-white/30 hover:text-nw-white/60 transition-colors"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full mt-2"
        loading={loading}
      >
        Entrer
      </Button>
    </form>
  )
}
