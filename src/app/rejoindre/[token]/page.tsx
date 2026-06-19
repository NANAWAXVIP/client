import { NanawaxLogo } from '@/components/NanawaxLogo'
import { RegisterForm } from '@/components/client/RegisterForm'
import { getMockPreRegByToken } from '@/lib/mock-data'

interface Props {
  params: Promise<{ token: string }>
}

export default async function RegisterPage({ params }: Props) {
  const { token } = await params
  const preReg = getMockPreRegByToken(token)

  const isUsed = preReg?.status === 'registered'
  const isInvalid = !preReg

  return (
    <div className="min-h-screen bg-nw-white flex flex-col">
      {/* Hero — même pattern que l'invitation */}
      <div className="relative overflow-hidden bg-nw-black">
        <div className="absolute inset-0 pattern-wax opacity-[0.04]" />
        <div className="relative z-10 px-6 pt-8 pb-10 text-center">
          <div className="flex justify-center mb-10">
            <NanawaxLogo size="md" inverted />
          </div>
          {isInvalid || isUsed ? (
            <div>
              <p className="text-[10px] font-display font-light tracking-[0.3em] uppercase text-nw-camel mb-4">
                Accès privé
              </p>
              <h1 className="font-display font-thin text-3xl text-nw-white leading-tight">
                {isUsed ? 'Lien déjà utilisé' : 'Lien invalide'}
              </h1>
            </div>
          ) : (
            <div>
              <p className="text-[10px] font-display font-light tracking-[0.3em] uppercase text-nw-camel mb-4">
                Accès privé · Vente VIP
              </p>
              <h1 className="font-display font-thin text-3xl text-nw-white leading-tight mb-2">
                Rejoindre la<br />vente privée
              </h1>
              <p className="text-sm font-display font-light text-nw-white/40">
                Les détails vous seront communiqués après confirmation.
              </p>
            </div>
          )}
        </div>
        <div className="h-px bg-nw-camel/40" />
      </div>

      <div className="flex-1 px-5 py-8 max-w-md mx-auto w-full">
        {isInvalid && (
          <div className="text-center space-y-3 py-8">
            <p className="text-sm text-nw-black/60">
              Ce lien d'inscription n'existe pas ou a expiré.
            </p>
            <p className="text-xs text-nw-black/35">
              Si vous pensez qu'il s'agit d'une erreur, contactez Nanawax directement.
            </p>
          </div>
        )}

        {isUsed && (
          <div className="text-center space-y-3 py-8">
            <div className="w-12 h-px bg-nw-camel/40 mx-auto mb-6" />
            <p className="text-sm text-nw-black/60">
              Ce lien a déjà été utilisé pour s'inscrire.
            </p>
            <p className="text-xs text-nw-black/35 max-w-xs mx-auto">
              Il était personnel et à usage unique. Si vous n'avez pas complété l'inscription vous-même, contactez Nanawax.
            </p>
          </div>
        )}

        {!isInvalid && !isUsed && preReg && (
          <div className="space-y-6">
            {/* Personal marker — anti-partage */}
            <div className="bg-nw-black/4 px-4 py-3 flex items-start gap-3">
              <div className="w-1 h-full bg-nw-camel self-stretch shrink-0" />
              <div>
                <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/40 mb-0.5">
                  Lien personnel
                </p>
                <p className="text-xs text-nw-black/60">
                  Ce lien vous a été adressé personnellement.
                  Il est à usage unique et ne peut pas être partagé.
                </p>
              </div>
            </div>

            {/* Registration form */}
            <div>
              <p className="text-[10px] font-display uppercase tracking-[0.15em] text-nw-black/40 mb-4">
                Vos informations
              </p>
              <RegisterForm token={token} />
            </div>

            <p className="text-[10px] text-nw-black/25 text-center">
              En vous inscrivant, vous rejoignez la liste d'attente. Nanawax vous confirmera votre place.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
