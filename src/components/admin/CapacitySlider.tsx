'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  eventId: string
  initialCapacity: number
  confirmed: number
  pending: number
  declined: number
}

export function CapacitySlider({ eventId, initialCapacity, confirmed, pending, declined }: Props) {
  const [capacity, setCapacity] = useState(initialCapacity)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const remaining = Math.max(0, capacity - confirmed)
  const pct       = capacity > 0 ? Math.min(100, Math.round((confirmed / capacity) * 100)) : 0
  const isAlmostFull = remaining <= Math.max(1, Math.round(capacity * 0.2))
  const isFull       = remaining === 0

  async function save(value: number) {
    setStatus('saving')
    await fetch(`/api/events/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ capacity: value }),
    })
    setStatus('saved')
    setTimeout(() => setStatus('idle'), 2000)
  }

  function adjust(delta: number) {
    const next = Math.max(confirmed, capacity + delta)
    setCapacity(next)
    scheduleSave(next)
  }

  function handleInput(raw: string) {
    const n = parseInt(raw, 10)
    if (isNaN(n)) return
    const next = Math.max(confirmed, n)
    setCapacity(next)
    scheduleSave(next)
  }

  function scheduleSave(value: number) {
    setStatus('idle')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => save(value), 900)
  }

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  const barColor = isFull ? '#ef4444' : isAlmostFull ? '#f97316' : '#B8835A'

  return (
    <div className="space-y-5">

      {/* Stats 4 colonnes */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { n: confirmed, label: 'Confirmées', color: 'text-nw-sage' },
          { n: pending,   label: 'Sans réponse', color: 'text-nw-camel' },
          { n: declined,  label: 'Déclinées',  color: 'text-nw-white/40' },
          { n: remaining, label: 'Disponibles', color: isFull ? 'text-red-400' : isAlmostFull ? 'text-orange-400' : 'text-nw-white' },
        ].map(({ n, label, color }) => (
          <div key={label} className="bg-nw-white/4 border border-nw-white/6 py-3 px-1">
            <p className={`text-2xl font-display font-thin ${color}`}>{n}</p>
            <p className="text-[9px] font-display uppercase tracking-[0.1em] text-nw-white/25 mt-1 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Barre de remplissage */}
      <div className="space-y-1.5">
        <div className="h-1.5 bg-nw-white/8 overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: barColor }}
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-nw-white/25">{pct}% rempli</p>
          {isFull && <p className="text-[10px] text-red-400 font-display uppercase tracking-[0.1em]">Complet</p>}
          {isAlmostFull && !isFull && <p className="text-[10px] text-orange-400 font-display uppercase tracking-[0.1em]">Presque complet</p>}
        </div>
      </div>

      {/* Contrôle capacité */}
      <div className="border border-nw-white/8 p-4">
        <p className="text-[9px] font-display uppercase tracking-[0.2em] text-nw-white/30 mb-3">
          Capacité totale
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => adjust(-1)}
            disabled={capacity <= confirmed}
            className="w-9 h-9 border border-nw-white/15 text-nw-white/60 hover:border-nw-camel hover:text-nw-camel transition-colors disabled:opacity-20 text-lg leading-none flex items-center justify-center"
          >
            −
          </button>
          <input
            type="number"
            value={capacity}
            min={confirmed}
            onChange={e => handleInput(e.target.value)}
            className="flex-1 bg-transparent text-center text-2xl font-display font-thin text-nw-white outline-none border-b border-nw-white/20 focus:border-nw-camel transition-colors pb-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => adjust(+1)}
            className="w-9 h-9 border border-nw-white/15 text-nw-white/60 hover:border-nw-camel hover:text-nw-camel transition-colors text-lg leading-none flex items-center justify-center"
          >
            +
          </button>
        </div>
        <p className="text-[9px] text-nw-white/20 text-center mt-2">
          {status === 'saving' ? 'Enregistrement…' : status === 'saved' ? 'Enregistré ✓' : 'Sauvegarde automatique'}
        </p>
      </div>

    </div>
  )
}
