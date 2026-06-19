import Image from 'next/image'
import { getMockPreRegByToken } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import { RegisterForm } from '@/components/client/RegisterForm'

interface Props { params: Promise<{ token: string }> }

async function getPreReg(token: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('pre_registrations')
      .select('*')
      .eq('token', token)
      .single()
    return data
  } catch {
    return getMockPreRegByToken(token) ?? null
  }
}

export default async function RegisterPage({ params }: Props) {
  const { token } = await params
  const preReg = await getPreReg(token)

  const isInvalid  = !preReg
  const isUsed     = preReg?.status === 'registered'
  const isValid    = !isInvalid && !isUsed

  return (
    <main className="bg-nw-black min-h-screen">

      {/* ── HERO identique à la landing ───────────────────── */}
      <section className="relative h-[70vh] flex flex-col">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Nanawax"
            fill
            className="object-cover object-top"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-nw-black/70 via-transparent to-nw-black/90" />
        </div>

        {/* Logo */}
        <header className="relative z-10 flex justify-center pt-10">
          <a href="/">
            <Image src="/logo.png" alt="Nanawax" width={160} height={70} unoptimized className="invert brightness-0 invert" />
          </a>
        </header>

        {/* Titre bas */}
        <div className="relative z-10 mt-auto px-6 pb-10 text-center">
          <p className="text-[10px] font-display font-light tracking-[0.4em] uppercase text-nw-camel mb-4">
            {isValid ? 'Votre accès personnel' : isUsed ? 'Lien déjà utilisé' : 'Lien invalide'}
          </p>
          <h1 className="font-display font-thin text-nw-white leading-none mb-4" style={{ fontSize: 'clamp(40px, 10vw, 80px)' }}>
            {isValid ? 'Rejoignez\nla liste VIP.' : isUsed ? 'Déjà\nutilisé.' : 'Lien\ninvalide.'}
          </h1>
        </div>
      </section>

      {/* ── CONTENU ───────────────────────────────────────── */}
      <section className="bg-nw-white px-6 py-14 min-h-[50vh]">
        <div className="max-w-md mx-auto">

          {isInvalid && (
            <div className="text-center space-y-4 py-8">
              <p className="font-display font-light text-nw-black/60">
                Ce lien d'accès n'existe pas ou a expiré.
              </p>
              <p className="text-sm text-nw-black/35">
                Si vous pensez qu'il s'agit d'une erreur, contactez Nanawax directement.
              </p>
              <a href="/" className="text-[11px] font-display uppercase tracking-[0.15em] text-nw-camel underline underline-offset-4 block mt-6">
                Retour à l'accueil
              </a>
            </div>
          )}

          {isUsed && (
            <div className="text-center space-y-4 py-8">
              <div className="w-8 h-px bg-nw-camel mx-auto mb-6" />
              <p className="font-display font-light text-nw-black/60">
                Ce lien a déjà été utilisé pour s'inscrire.
              </p>
              <p className="text-sm text-nw-black/35 max-w-xs mx-auto leading-relaxed">
                Il était personnel et à usage unique.
              </p>
              <a href="/" className="text-[11px] font-display uppercase tracking-[0.15em] text-nw-camel underline underline-offset-4 block mt-6">
                Retour à l'accueil
              </a>
            </div>
          )}

          {isValid && (
            <div className="space-y-8">
              {/* Marqueur anti-partage */}
              <div className="border-l-2 border-nw-camel pl-4 py-1">
                <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/40 mb-1">
                  Lien personnel & confidentiel
                </p>
                <p className="text-xs text-nw-black/55 leading-relaxed">
                  Ce lien vous a été adressé personnellement.
                  Il est à usage unique et ne peut pas être partagé.
                </p>
              </div>

              {/* Teaser — aucune info sur l'événement */}
              <div className="bg-nw-black px-6 py-8 text-center">
                <p className="text-[10px] font-display uppercase tracking-[0.3em] text-nw-camel mb-3">
                  Événement Nanawax · Accès exclusif
                </p>
                <p className="text-sm font-display font-light text-nw-white/60 leading-relaxed">
                  Date, lieu et horaire vous seront communiqués
                  personnellement après confirmation.
                </p>
              </div>

              {/* Formulaire */}
              <div>
                <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/40 mb-6">
                  Vos informations
                </p>
                <RegisterForm token={token} />
              </div>

              <p className="text-[10px] text-nw-black/25 text-center leading-relaxed">
                En vous inscrivant, vous rejoignez la liste VIP.
                Nanawax vous contactera pour confirmer votre accès.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="bg-nw-black border-t border-nw-white/8 px-6 py-6 text-center">
        <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-white/20">
          © 2026 Nanawax · Ventes privées
        </p>
      </footer>
    </main>
  )
}
