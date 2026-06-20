'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin-login', { method: 'DELETE' })
    router.push('/espace-maureen')
  }

  return (
    <button onClick={handleLogout} className="text-white/40 hover:text-white transition-colors">
      <LogOut size={15} />
    </button>
  )
}
