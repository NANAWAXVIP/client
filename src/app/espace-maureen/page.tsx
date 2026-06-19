import Image from 'next/image'
import { AdminLoginForm } from '@/components/client/AdminLoginForm'

export default function EspaceMaureenPage() {
  return (
    <main className="min-h-screen bg-nw-black flex flex-col">

      {/* Hero sobre */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-16">

        {/* Pattern très subtil */}
        <div className="absolute inset-0 pattern-wax opacity-[0.03]" />

        <div className="relative z-10 w-full max-w-sm mx-auto text-center space-y-10">

          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Nanawax"
            width={100}
            height={44}
            unoptimized
            className="mx-auto invert"
          />

          {/* Titre */}
          <div>
            <p className="text-[10px] font-display uppercase tracking-[0.3em] text-nw-camel mb-3">
              Espace privé
            </p>
            <h1 className="font-display font-thin text-3xl text-nw-white">
              Accès admin
            </h1>
          </div>

          {/* Formulaire */}
          <AdminLoginForm />

        </div>
      </div>

      <footer className="relative z-10 text-center pb-8">
        <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-white/15">
          Nanawax · Accès réservé
        </p>
      </footer>
    </main>
  )
}
