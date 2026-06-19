'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import type { CatalogItem } from '@/lib/types'
import Image from 'next/image'

interface Props {
  eventId: string
  items: CatalogItem[]
}

export function CatalogManager({ eventId, items: initialItems }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.set('name', name)
      formData.set('price', price)
      if (imageFile) formData.set('image', imageFile)

      const res = await fetch(`/api/events/${eventId}/catalog`, {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const newItem = await res.json()
        setItems(prev => [...prev, newItem])
        setName(''); setPrice(''); setImageFile(null); setImagePreview(null)
        setAdding(false)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
    await fetch(`/api/events/${eventId}/catalog/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {items.map(item => (
          <div key={item.id} className="group relative">
            <div className="aspect-[4/5] bg-nw-black/5 relative overflow-hidden">
              {item.image_url ? (
                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-display uppercase tracking-[0.15em] text-nw-black/20">Photo</span>
                </div>
              )}
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 w-7 h-7 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} className="text-red-500" />
              </button>
            </div>
            <div className="pt-2 pb-1">
              <p className="text-xs font-display font-light truncate">{item.name}</p>
              <p className="text-xs text-nw-camel">{formatPrice(item.price)}</p>
            </div>
          </div>
        ))}

        {/* Add card */}
        <button
          onClick={() => setAdding(true)}
          className="aspect-[4/5] border border-dashed border-nw-black/15 flex flex-col items-center justify-center gap-2 hover:border-nw-camel/50 transition-colors group"
        >
          <Plus size={20} className="text-nw-black/25 group-hover:text-nw-camel/60 transition-colors" />
          <span className="text-[9px] font-display uppercase tracking-[0.15em] text-nw-black/30 group-hover:text-nw-camel/60 transition-colors">
            Ajouter
          </span>
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-nw-black/40 backdrop-blur-sm" onClick={() => setAdding(false)} />
          <div className="relative bg-nw-white w-full sm:max-w-md sm:mx-4 p-6 sm:p-8">
            <h2 className="font-display font-light text-lg tracking-wide mb-6">Ajouter une pièce</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image upload */}
              <div
                className="aspect-video bg-nw-black/4 flex flex-col items-center justify-center cursor-pointer border border-dashed border-nw-black/12 hover:border-nw-camel/40 transition-colors relative overflow-hidden"
                onClick={() => fileRef.current?.click()}
              >
                {imagePreview ? (
                  <Image src={imagePreview} alt="" fill className="object-cover" />
                ) : (
                  <>
                    <Upload size={20} className="text-nw-black/25 mb-2" />
                    <span className="text-[10px] font-display uppercase tracking-[0.12em] text-nw-black/30">
                      Ajouter une photo
                    </span>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              <div>
                <label className="block text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">
                  Nom de la pièce
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Robe Kente Fluid"
                  className="w-full border border-nw-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-nw-camel transition-colors placeholder:text-nw-black/25"
                />
              </div>
              <div>
                <label className="block text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/50 mb-2">
                  Prix (€)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="185"
                  className="w-full border border-nw-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-nw-camel transition-colors placeholder:text-nw-black/25"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdding(false)}
                  className="flex-1 text-[11px] font-display uppercase tracking-[0.1em] text-nw-black/40 hover:text-nw-black/70 transition-colors py-4 border border-nw-black/10"
                >
                  Annuler
                </button>
                <Button type="submit" variant="secondary" size="md" className="flex-1" loading={loading}>
                  Ajouter
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
