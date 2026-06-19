'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { NanawaxLogo } from '@/components/NanawaxLogo'
import { Button } from '@/components/ui/Button'

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('15:00')
  const [location, setLocation] = useState('')
  const [capacity, setCapacity] = useState('30')
  const [slots, setSlots] = useState<string[]>([])
  const [newSlot, setNewSlot] = useState('')

  function addSlot() {
    const s = newSlot.trim()
    if (s && !slots.includes(s)) setSlots(prev => [...prev, s])
    setNewSlot('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const datetime = `${date}T${time}:00.000Z`
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, date: datetime, location,
          capacity: Number(capacity), time_slots: slots,
        }),
      })
      if (res.ok) {
        const event = await res.json()
        router.push(`/admin/events/${event.id}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-nw-white">
      <div className="border-b border-nw-black/8 px-5 py-4 flex items-center justify-between">
        <Link href="/admin" className="text-nw-black/40 hover:text-nw-black transition-colors">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </Link>
        <NanawaxLogo size="sm" />
        <div className="w-8" />
      </div>

      <div className="px-5 pt-8 pb-16 max-w-md mx-auto">
        <div className="mb-8">
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-camel mb-2">Nouvel événement</p>
          <h1 className="font-display font-light text-2xl">Créer une vente privée</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">
              Nom de l'événement
            </label>
            <input
              type="text" required value={name} onChange={e => setName(e.target.value)}
              placeholder="Vente Privée Été 2026"
              className="w-full border border-nw-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-nw-camel transition-colors placeholder:text-nw-black/25"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">Date</label>
              <input
                type="date" required value={date} onChange={e => setDate(e.target.value)}
                className="w-full border border-nw-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-nw-camel transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">Heure</label>
              <input
                type="time" required value={time} onChange={e => setTime(e.target.value)}
                className="w-full border border-nw-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-nw-camel transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">Lieu</label>
            <input
              type="text" required value={location} onChange={e => setLocation(e.target.value)}
              placeholder="Showroom Nanawax — 12 rue des Arts, Paris 11e"
              className="w-full border border-nw-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-nw-camel transition-colors placeholder:text-nw-black/25"
            />
          </div>

          <div>
            <label className="block text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">
              Nombre de places
            </label>
            <input
              type="number" required min="1" max="500" value={capacity} onChange={e => setCapacity(e.target.value)}
              className="w-full border border-nw-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-nw-camel transition-colors"
            />
          </div>

          {/* Time slots */}
          <div>
            <label className="block text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">
              Créneaux horaires (optionnel)
            </label>
            <div className="space-y-2 mb-2">
              {slots.map(slot => (
                <div key={slot} className="flex items-center justify-between bg-nw-black/4 px-3 py-2">
                  <span className="text-sm font-display font-light">{slot}</span>
                  <button type="button" onClick={() => setSlots(prev => prev.filter(s => s !== slot))}>
                    <X size={12} className="text-nw-black/30 hover:text-nw-black/60" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text" value={newSlot} onChange={e => setNewSlot(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSlot() } }}
                placeholder="ex: 15h00 – 15h30"
                className="flex-1 border border-nw-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-nw-camel transition-colors placeholder:text-nw-black/25"
              />
              <button
                type="button" onClick={addSlot}
                className="border border-nw-black/15 px-3 py-2 hover:border-nw-camel transition-colors"
              >
                <Plus size={14} className="text-nw-black/40" />
              </button>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
              Créer l'événement
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
