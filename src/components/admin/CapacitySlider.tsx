'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  eventId: string
  initialCapacity: number
  confirmed: number
  pending: number
  declined: number
  onCapacityChange?: (n: number) => void
}

export function CapacitySlider({ eventId, initialCapacity, confirmed, pending, declined, onCapacityChange }: Props) {
  const [capacity, setCapacity] = useState(initialCapacity)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const remaining    = Math.max(0, capacity - confirmed)
  const pct          = capacity > 0 ? Math.min(100, Math.round((confirmed / capacity) * 100)) : 0
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
    onCapacityChange?.(next)
    scheduleSave(next)
  }

  function handleInput(raw: string) {
    const n = parseInt(raw, 10)
    if (isNaN(n)) return
    const next = Math.max(confirmed, n)
    setCapacity(next)
    onCapacityChange?.(next)
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

      {/* Contrôle capacité */}
      <div className="border border-black p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => adjust(-1)}
            disabled={capacity <= confirmed}
            className="w-9 h-9 border border-black text-black hover:border-nw-camel hover:text-nw-camel transition-colors disabled:opacity-20 text-lg leading-none flex items-center justify-center"
          >
            −
          </button>
          <input
            type="number"
            value={capacity}
            min={confirmed}
            onChange={e => handleInput(e.target.value)}
            className="flex-1 bg-transparent text-center text-2xl font-display font-thin text-black outline-none border-b border-black focus:border-nw-camel transition-colors pb-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => adjust(+1)}
            className="w-9 h-9 border border-black text-black hover:border-nw-camel hover:text-nw-camel transition-colors text-lg leading-none flex items-center justify-center"
          >
            +
          </button>
        </div>
        <p className="text-[9px] text-black/40 text-center mt-2">
          {status === 'saving' ? 'Enregistrement…' : status === 'saved' ? 'Enregistré ✓' : 'Sauvegarde automatique'}
        </p>
      </div>

    </div>
  )
}
