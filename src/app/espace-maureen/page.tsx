import Image from 'next/image'
import { AdminLoginForm } from '@/components/client/AdminLoginForm'

export default function EspaceMaureenPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* Header noir */}
      <header className="bg-black px-6 py-5 flex justify-center">
        <a href="/">
          <Image src="/logo.png" alt="Nanawax" width={90} height={40} unoptimized className="invert" />
        </a>
      </header>

      {/* Contenu centré */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm mx-auto">

          <div className="mb-10">
            <p className="text-[10px] font-display uppercase tracking-[0.3em] text-nw-camel mb-3">
              Espace privé
            </p>
            <h1 className="font-display font-bold text-4xl text-black leading-tight">
              Accès<br />Maureen.
            </h1>
          </div>

          <div className="h-px bg-nw-camel/30 mb-8" />

          <AdminLoginForm />

        </div>
      </div>

      <footer className="text-center pb-8">
        <p className="text-[10px] font-display uppercase tracking-[0.2em] text-black/20">
          Nanawax · Accès réservé
        </p>
      </footer>

    </main>
  )
}
