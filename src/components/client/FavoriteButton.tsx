'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  itemId: string
  guestToken: string
  initialFavorited?: boolean
}

export function FavoriteButton({ itemId, guestToken, initialFavorited = false }: Props) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const prev = favorited
    setFavorited(!prev)
    try {
      await fetch(`/api/invitation/${guestToken}/favorites`, {
        method: prev ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalog_item_id: itemId }),
      })
    } catch {
      setFavorited(prev)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={cn(
        'w-8 h-8 flex items-center justify-center transition-transform active:scale-90',
        loading && 'opacity-50'
      )}
    >
      <Heart
        size={16}
        strokeWidth={1.5}
        className={cn(
          'transition-all duration-200',
          favorited ? 'fill-nw-camel stroke-nw-camel' : 'fill-transparent stroke-nw-black/40'
        )}
      />
    </button>
  )
}
