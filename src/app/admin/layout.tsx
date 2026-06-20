import { IdleLogout } from '@/components/admin/IdleLogout'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IdleLogout />
      {children}
    </>
  )
}
