'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Upload, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { CatalogItem } from '@/lib/types'
import Image from 'next/image'

interface Props {
  eventId: string
  items: CatalogItem[]
}

const inputClass = 'w-full border border-black/20 bg-white text-black px-4 py-3.5 text-sm font-body outline-none focus:border-nw-camel transition-colors placeholder:text-black/25'
const labelClass = 'block text-[10px] font-display uppercase tracking-[0.2em] text-black mb-2'

export function CatalogManager({ eventId, items: initialItems }: Props) {
  const router  = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [items,        setItems]        = useState(initialItems)
  const [adding,       setAdding]       = useState(false)
  const [name,         setName]         = useState('')
  const [price,        setPrice]        = useState('')
  const [imageFile,    setImageFile]    = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading,      setLoading]      = useState(false)
  const [deleting,     setDeleting]     = useState<string | null>(null)
  const [error,        setError]        = useState('')

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function resetForm() {
    setName(''); setPrice(''); setImageFile(null); setImagePreview(null); setAdding(false); setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.set('name', name)
      fd.set('price', price)
      if (imageFile) fd.set('image', imageFile)
      const res  = await fetch(`/api/events/${eventId}/catalog`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Erreur lors de l'ajout."); return }
      setItems(prev => [data, ...prev])
      resetForm()
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    setItems(prev => prev.filter(i => i.id !== id))
    await fetch(`/api/events/${eventId}/catalog/${id}`, { method: 'DELETE' })
    setDeleting(null)
    router.refresh()
  }

  return (
    <>
      {/* Bouton ajouter */}
      <button
        onClick={() => setAdding(true)}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-nw-camel/40 py-4 text-[11px] font-display uppercase tracking-[0.15em] text-nw-camel hover:border-nw-camel hover:bg-nw-camel/5 transition-colors mb-8"
      >
        <Plus size={14} />
        Ajouter une pièce
      </button>

      {/* Grille */}
      {items.length === 0 ? (
        <div className="text-center py-20 border border-black/10">
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-black/30">
            Aucune pièce au catalogue
          </p>
          <p className="text-xs text-black/20 mt-2">Ajoutez vos premières créations ci-dessus.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map(item => (
            <div key={item.id} className="group">
              <div className="aspect-[4/5] bg-black/4 border border-black/10 relative overflow-hidden">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] font-display uppercase tracking-[0.15em] text-black/20">Photo</span>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:[&>svg]:text-white"
                >
                  <Trash2 size={11} className="text-red-500" />
                </button>
              </div>
              <div className="pt-2.5 pb-1 border-b border-black/8">
                <p className="text-xs font-display font-light text-black truncate">{item.name}</p>
                <p className="text-xs text-nw-camel mt-0.5">{formatPrice(item.price)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal ajout */}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-white border border-black/15 w-full sm:max-w-md sm:mx-4 shadow-xl">

            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/8">
              <div>
                <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-camel mb-0.5">Catalogue</p>
                <h2 className="font-display font-thin text-xl text-black">Nouvelle pièce</h2>
              </div>
              <button onClick={resetForm} className="text-black/30 hover:text-black transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
              {/* Zone image */}
              <div
                className="aspect-video bg-black/4 border border-black/15 flex flex-col items-center justify-center cursor-pointer hover:border-nw-camel transition-colors relative overflow-hidden"
                onClick={() => fileRef.current?.click()}
              >
                {imagePreview ? (
                  <Image src={imagePreview} alt="" fill className="object-cover" />
                ) : (
                  <div className="text-center">
                    <Upload size={20} className="text-black/20 mx-auto mb-2" />
                    <span className="text-[10px] font-display uppercase tracking-[0.12em] text-black/30">
                      Ajouter une photo
                    </span>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              <div>
                <label className={labelClass}>Nom de la pièce</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="Robe Kente Fluid" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Prix (€)</label>
                <input type="number" required min="0" step="1" value={price}
                  onChange={e => setPrice(e.target.value)} placeholder="185" className={inputClass} />
              </div>

              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={resetForm}
                  className="flex-1 text-[11px] font-display uppercase tracking-[0.1em] text-black/40 hover:text-black transition-colors py-4 border border-black/15">
                  Annuler
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-black text-white text-[11px] font-display uppercase tracking-[0.1em] py-4 hover:bg-nw-camel transition-colors disabled:opacity-50">
                  {loading ? 'Ajout…' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
