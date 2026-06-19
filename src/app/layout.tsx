import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nanawax — Espace VIP',
  description: 'Ventes privées Nanawax — prêt-à-porter wax & afro premium',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${jakarta.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  )
}
