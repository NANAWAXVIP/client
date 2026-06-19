import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getMockPreRegByToken } from '@/lib/mock-data'
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

  const isInvalid = !preReg
  const isUsed    = preReg?.status === 'registered'
  const isValid   = !isInvalid && !isUsed

  return (
    <main className="bg-nw-white min-h-screen flex flex-col md:flex-row">

      {/* ── PHOTO GAUCHE ──────────────────────────────────── */}
      <div className="relative md:w-1/2 h-[45vh] md:h-auto md:sticky md:top-0 md:self-start md:min-h-screen">
        <Image
          src="/photo3.jpg"
          alt="Nanawax"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nw-black/60 via-transparent to-transparent" />

        {/* Logo en bas de la photo */}
        <a href="/" className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
          <Image src="/logo.png" alt="Nanawax" width={90} height={40} unoptimized className="invert" />
        </a>
      </div>

      {/* ── CONTENU DROITE ────────────────────────────────── */}
      <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-14 py-14 md:py-20">
        <div className="max-w-sm w-full mx-auto">

          {/* Formulaire (gère lui-même son titre et l'état succès) */}
          {isValid && <RegisterForm token={token} />}

          {/* Lien invalide */}
          {isInvalid && (
            <div className="space-y-6">
              <p className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-nw-camel mb-3">
                Lien invalide
              </p>
              <h1 className="font-display font-bold text-4xl text-nw-black leading-tight mb-6">
                Lien<br />invalide.
              </h1>
              <div className="h-px bg-nw-camel/30" />
              <p className="text-sm font-display font-light text-nw-black leading-relaxed">
                Ce lien d'accès n'existe pas ou a expiré.
              </p>
              <p className="text-sm text-nw-black leading-relaxed">
                Si vous pensez qu'il s'agit d'une erreur, contactez Nanawax directement.
              </p>
            </div>
          )}

          {/* Lien déjà utilisé */}
          {isUsed && (
            <div className="space-y-6">
              <p className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-nw-camel mb-3">
                Lien utilisé
              </p>
              <h1 className="font-display font-bold text-4xl text-nw-black leading-tight mb-6">
                Déjà<br />utilisé.
              </h1>
              <div className="h-px bg-nw-camel/30" />
              <p className="text-sm font-display font-light text-nw-black whitespace-nowrap">
                Ce lien était personnel et à usage unique.
              </p>
              <p className="text-sm text-nw-black whitespace-nowrap">
                Nous espérons vous accueillir très bientôt.
              </p>
            </div>
          )}

        </div>
      </div>

    </main>
  )
}
