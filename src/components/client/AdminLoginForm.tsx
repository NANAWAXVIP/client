'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export function AdminLoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

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
    <form onSubmit={handleSubmit} className="space-y-8">

      <div>
        <label className="block text-[10px] font-display font-bold uppercase tracking-[0.22em] text-black mb-1">
          Mot de passe
        </label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border-0 border-b border-black/20 bg-transparent px-0 py-3 text-sm font-body text-black outline-none focus:border-nw-camel transition-colors placeholder:text-black/20 pr-8 rounded-none"
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white text-sm font-display font-bold uppercase tracking-[0.18em] py-5 hover:bg-nw-camel transition-colors disabled:opacity-50"
      >
        {loading ? 'Vérification…' : 'Entrer'}
      </button>

    </form>
  )
}
