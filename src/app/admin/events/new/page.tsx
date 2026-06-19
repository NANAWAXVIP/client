'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Plus, X } from 'lucide-react'

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
      const datetime = new Date(`${date}T${time}:00`).toISOString()
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date: datetime, location, capacity: Number(capacity), time_slots: slots }),
      })
      if (res.ok) router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-[#2C2118] border border-[#5C4A38] text-nw-white px-4 py-3.5 text-sm font-body outline-none focus:border-nw-camel transition-colors placeholder:text-nw-white/30"
  const labelClass = "block text-[10px] font-display uppercase tracking-[0.2em] text-nw-white/40 mb-2"

  return (
    <div className="min-h-screen bg-black">

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-black/8 px-5 py-4">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          <a href="/admin" className="text-black/40 hover:text-black transition-colors">
            <ArrowLeft size={18} strokeWidth={1.5} />
          </a>
          <Image src="/logo.png" alt="Nanawax" width={65} height={29} unoptimized />
          <div className="w-6" />
        </div>
      </header>

      <div className="px-5 pt-10 pb-20 max-w-xl mx-auto">

        {/* Titre */}
        <div className="mb-10">
          <p className="text-[10px] font-display uppercase tracking-[0.3em] text-nw-camel mb-3">Nouvel événement</p>
          <h1 className="font-display font-thin text-4xl text-nw-white">Créer un événement</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nom */}
          <div>
            <label className={labelClass}>Nom de l'événement</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)}
              placeholder="Ex: Lancement Collection, Vente Privée Été, Soirée VIP…" className={inputClass} />
          </div>

          {/* Date + heure */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Heure</label>
              <input type="time" required value={time} onChange={e => setTime(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Lieu */}
          <div>
            <label className={labelClass}>Lieu</label>
            <input type="text" required value={location} onChange={e => setLocation(e.target.value)}
              placeholder="Showroom Nanawax — 12 rue des Arts, Paris 11e" className={inputClass} />
          </div>

          {/* Capacité */}
          <div>
            <label className={labelClass}>Nombre de places</label>
            <input type="number" required min="1" max="500" value={capacity}
              onChange={e => setCapacity(e.target.value)} className={inputClass} />
          </div>

          {/* Créneaux */}
          <div>
            <label className={labelClass}>Créneaux horaires — optionnel</label>
            {slots.length > 0 && (
              <div className="space-y-2 mb-2">
                {slots.map(slot => (
                  <div key={slot} className="flex items-center justify-between bg-[#2C2118] border border-[#5C4A38] px-4 py-2.5">
                    <span className="text-sm font-display font-light text-nw-white">{slot}</span>
                    <button type="button" onClick={() => setSlots(prev => prev.filter(s => s !== slot))}>
                      <X size={13} className="text-nw-white/30 hover:text-nw-white/60" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input type="text" value={newSlot} onChange={e => setNewSlot(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSlot() } }}
                placeholder="ex: 15h00 – 15h30"
                className={`flex-1 ${inputClass}`} />
              <button type="button" onClick={addSlot}
                className="bg-[#2C2118] border border-[#5C4A38] px-4 hover:border-nw-camel transition-colors">
                <Plus size={15} className="text-nw-white/50" />
              </button>
            </div>
          </div>

          {/* Séparateur */}
          <div className="h-px bg-nw-white/8" />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-nw-camel text-nw-white font-display font-light text-sm uppercase tracking-[0.15em] py-5 hover:bg-[#a3744e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Création en cours…' : "Créer l'événement"}
          </button>

          <a href="/admin" className="block text-center text-[11px] font-display uppercase tracking-[0.12em] text-nw-white/25 hover:text-nw-white/50 transition-colors">
            Annuler
          </a>
        </form>
      </div>
    </div>
  )
}
