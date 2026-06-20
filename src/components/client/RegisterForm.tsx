'use client'

import { useState, useEffect } from 'react'

const inputClass = [
  'w-full border-0 border-b border-black bg-transparent',
  'px-0 py-3 text-sm font-body text-nw-black outline-none',
  'focus:border-nw-camel transition-colors duration-200',
  'placeholder:text-nw-black/25 rounded-none',
].join(' ')

const labelClass = 'block text-[10px] font-display font-bold uppercase tracking-[0.22em] text-nw-black mb-1'

interface Props { token: string }

export function RegisterForm({ token }: Props) {
  const [name,  setName]  = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [done,    setDone]    = useState(false)

  // Bloque le bouton retour du navigateur une fois l'inscription validée
  useEffect(() => {
    if (!done) return
    window.history.pushState(null, '', window.location.href)
    const block = () => window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', block)
    return () => window.removeEventListener('popstate', block)
  }, [done])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/register/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Une erreur est survenue.'); return }
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="space-y-8">
        <div className="h-px bg-nw-camel/30" />
        <div className="space-y-3">
          <p className="text-[10px] font-display font-bold uppercase tracking-[0.25em] text-nw-camel">
            Inscription enregistrée
          </p>
          <p className="font-display font-bold whitespace-nowrap leading-none" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}>
            À très bientôt.
          </p>
        </div>
        <div className="h-px bg-nw-black/8" />
        <p className="text-sm font-display font-light text-nw-black leading-relaxed">
          Merci {name.split(' ')[0]}. Votre demande a bien été reçue.
        </p>
        <p className="text-sm font-display font-light text-nw-black leading-relaxed">
          Vous recevrez une invitation par email si votre demande est retenue.
        </p>
        <div className="h-px bg-nw-black/8" />
        <p className="text-[10px] text-nw-black/40 leading-relaxed">
          Vos informations sont confidentielles et ne seront jamais partagées.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Titre — masqué après soumission */}
      <div className="mb-10">
        <p className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-nw-camel mb-3">
          Votre inscription
        </p>
        <h1 className="font-display font-bold text-4xl text-nw-black leading-tight whitespace-nowrap">
          Vivez l'expérience Nanawax.
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="h-px bg-nw-camel/30 mb-8" />

        <div className="mb-8 space-y-1.5">
          <p className="text-sm font-display font-light text-nw-black leading-relaxed">
            Ce lien vous a été adressé personnellement.
            Il est à usage unique et confidentiel.
          </p>
          <p className="text-sm font-display font-light text-nw-black leading-relaxed">
            Nanawax vous contactera après confirmation de votre inscription.
          </p>
        </div>

        <div className="h-px bg-nw-black/8 mb-8" />

        <div className="space-y-7">
          <div>
            <label className={labelClass}>Prénom &amp; nom</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Prénom Nom"
              autoComplete="name"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Adresse email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              WhatsApp{' '}
              <span className="normal-case tracking-normal font-display font-light text-nw-black text-[10px]">
                — optionnel
              </span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+33 6 12 34 56 78"
              autoComplete="tel"
              className={inputClass}
            />
          </div>
        </div>

        <div className="h-px bg-nw-black/8 mt-8 mb-8" />

        {error && (
          <p className="text-xs text-red-500 mb-6">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-nw-camel text-nw-white text-sm font-display font-bold uppercase tracking-[0.18em] py-5 hover:bg-[#a3744e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Envoi en cours…' : 'Rejoindre la liste VIP'}
        </button>

        <p className="text-[10px] text-nw-black text-center leading-relaxed mt-6">
          En vous inscrivant, vous rejoignez la liste VIP Nanawax.<br />
          Vos informations restent confidentielles.
        </p>
      </form>
    </div>
  )
}
