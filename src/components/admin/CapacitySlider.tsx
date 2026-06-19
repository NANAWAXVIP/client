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

  async function handleChange(value: number) {
    setCapacity(value)
    setSaved(false)
  }

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
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-display font-light">{capacity}</p>
          <p className="text-[11px] font-display uppercase tracking-[0.12em] text-nw-black/40 mt-0.5">
            places au total
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-display font-light text-nw-camel">{remaining}</p>
          <p className="text-[11px] font-display uppercase tracking-[0.12em] text-nw-camel/60 mt-0.5">
            disponibles
          </p>
        </div>
      </div>

      <div className="relative py-3">
        <input
          type="range"
          min={Math.max(confirmed, 1)}
          max={100}
          value={capacity}
          onChange={e => handleChange(Number(e.target.value))}
          className="w-full appearance-none h-[2px] bg-nw-black/10 rounded-full outline-none
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-nw-camel [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
          style={{
            backgroundImage: `linear-gradient(to right, #B8835A ${((capacity - confirmed) / (100 - confirmed)) * 100}%, #e5e5e5 0%)`,
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-nw-black/40">
          {confirmed} confirmée{confirmed > 1 ? 's' : ''}
        </p>
        <button
          onClick={handleSave}
          disabled={saving || capacity === initialCapacity}
          className="text-[11px] font-display uppercase tracking-[0.1em] text-nw-camel underline underline-offset-4 disabled:opacity-30 disabled:no-underline"
        >
          {saving ? 'Enregistrement…' : saved ? 'Enregistré ✓' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
