'use client'

import { useState } from 'react'

interface Props {
  eventId: string
  initialCapacity: number
  confirmed: number
}

export function CapacitySlider({ eventId, initialCapacity, confirmed }: Props) {
  const [capacity, setCapacity] = useState(initialCapacity)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const remaining = Math.max(0, capacity - confirmed)
  const pct = Math.min(100, Math.round((confirmed / capacity) * 100))

  async function handleSave() {
    setSaving(true)
    try {
      await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacity }),
      })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-4xl font-display font-thin text-nw-white">{capacity}</p>
          <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-white/30 mt-1">places au total</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-display font-thin text-nw-camel">{remaining}</p>
          <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-camel/50 mt-1">disponibles</p>
        </div>
      </div>

      {/* Barre de remplissage */}
      <div className="space-y-1">
        <div className="h-1.5 bg-nw-white/8 rounded-full overflow-hidden">
          <div className="h-full bg-nw-camel rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[10px] text-nw-white/25">{confirmed} confirmée{confirmed > 1 ? 's' : ''} · {pct}% rempli</p>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={Math.max(confirmed, 1)}
        max={200}
        value={capacity}
        onChange={e => { setCapacity(Number(e.target.value)); setSaved(false) }}
        className="w-full appearance-none h-[2px] outline-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-nw-camel [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-nw-black
          [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
        style={{ backgroundImage: `linear-gradient(to right, #B8835A ${((capacity - confirmed) / (200 - confirmed)) * 100}%, rgba(255,255,255,0.1) 0%)` }}
      />

      <button
        onClick={handleSave}
        disabled={saving || capacity === initialCapacity}
        className="w-full py-3 border border-nw-camel/40 text-nw-camel text-[11px] font-display uppercase tracking-[0.15em] hover:bg-nw-camel hover:text-nw-white transition-colors disabled:opacity-30"
      >
        {saving ? 'Enregistrement…' : saved ? 'Enregistré ✓' : 'Enregistrer la capacité'}
      </button>
    </div>
  )
}
