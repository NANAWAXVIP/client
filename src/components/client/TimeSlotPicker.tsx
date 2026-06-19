'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface Props {
  token: string
  slots: string[]
}

export function TimeSlotPicker({ token, slots }: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit() {
    if (!selected) return
    setLoading(true)
    try {
      await fetch(`/api/invitation/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'slot', time_slot: selected }),
      })
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center space-y-2 py-8">
        <p className="text-lg font-display font-light">Créneau confirmé</p>
        <p className="text-sm text-nw-black/60">{selected}</p>
        <button
          onClick={() => router.push(`/invitation/${token}/catalog`)}
          className="text-[11px] font-display uppercase tracking-[0.1em] text-nw-camel underline underline-offset-4 mt-4 block mx-auto"
        >
          Retour au catalogue
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {slots.map(slot => (
        <button
          key={slot}
          onClick={() => setSelected(slot)}
          className={cn(
            'w-full text-left px-5 py-4 border transition-all duration-150 text-sm font-display font-light tracking-wide',
            selected === slot
              ? 'border-nw-camel bg-nw-camel/8 text-nw-camel'
              : 'border-black text-nw-black hover:border-nw-camel'
          )}
        >
          {slot}
        </button>
      ))}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!selected}
          loading={loading}
          onClick={handleSubmit}
        >
          Confirmer ce créneau
        </Button>
      </div>
    </div>
  )
}
