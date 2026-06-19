import Image from 'next/image'
import Link from 'next/link'
import { HeroRotatingText } from '@/components/client/HeroRotatingText'
import { WaitlistButton } from '@/components/client/WaitlistButton'

export default function LandingPage() {
  return (
    <main className="bg-nw-black min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-screen flex flex-col">

        {/* Photo plein écran */}
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Nanawax — prêt-à-porter wax premium"
            fill
            className="object-cover object-top"
            priority
            quality={90}
          />
          {/* Gradient global haut → bas */}
          <div className="absolute inset-0 bg-gradient-to-b from-nw-black/65 via-transparent to-nw-black/40" />
          {/* Gradient concentré sur la zone texte en bas */}
          <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-nw-black/80 via-nw-black/40 to-transparent" />
        </div>

        {/* Logo centré en haut */}
        <header className="relative z-10 flex justify-center pt-10 pb-0">
          <Image
            src="/logo.png"
            alt="Nanawax"
            width={110}
            height={50}
            unoptimized
            className="invert"
          />
        </header>

        {/* Texte bas du hero */}
        <div className="relative z-10 mt-auto px-6 pb-14 text-center">
          <h1 className="font-display font-thin text-nw-white leading-[0.92] mb-8" style={{ fontSize: 'clamp(52px, 14vw, 120px)' }}>
            Wax.<br />Luxe.<br />Privé.
          </h1>
          <div className="anim-fadeup w-8 h-px bg-nw-camel mx-auto mb-8" style={{ animationDelay: '0.1s' }} />
          <HeroRotatingText />
          <p className="anim-fadeup text-base text-nw-camel mb-8" style={{ animationDelay: '0.4s' }}>↓</p>
          <Link
            href="#acces"
            className="anim-fadeup inline-block bg-nw-camel text-nw-white text-sm font-display font-bold uppercase tracking-[0.18em] px-10 py-5 hover:bg-[#a3744e] transition-colors shadow-lg shadow-nw-camel/30"
            style={{ animationDelay: '0.6s' }}
          >
            Rejoindre la liste VIP
          </Link>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────── */}
      <section className="bg-nw-black px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] font-display uppercase tracking-[0.3em] text-nw-camel text-center mb-16">
            Comment ça fonctionne
          </p>

          <div className="space-y-12">
            {[
              {
                n: '01',
                title: 'Rejoignez la liste VIP',
                desc: 'Cliquez sur « Rejoindre la liste VIP » pour vous inscrire et intégrer la communauté Nanawax.',
              },
              {
                n: '02',
                title: 'Recevez votre invitation',
                desc: 'Un lien unique et personnel vous est envoyé pour chaque événement : ventes privées, soirées de lancement, rencontres autour de la marque…',
              },
              {
                n: '03',
                title: "Vivez l'expérience",
                desc: 'Date, lieu et programme vous sont communiqués après confirmation. Chaque événement est une expérience unique pensée pour vous.',
              },
            ].map(step => (
              <div key={step.n} className="flex gap-8 items-start">
                <span className="font-display font-thin text-4xl text-nw-camel/30 leading-none shrink-0 w-12 text-right">
                  {step.n}
                </span>
                <div className="border-t border-nw-white/10 pt-5 flex-1">
                  <p className="font-display font-light text-nw-white text-lg mb-2">{step.title}</p>
                  <p className="text-sm text-nw-white/45 leading-relaxed font-body">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPLIT — PHOTO + TEXTE ─────────────────────────────── */}
      <section className="bg-nw-white">
        <div className="flex flex-col md:flex-row min-h-[70vh]">
          {/* Photo */}
          <div className="relative md:w-1/2 h-[60vw] md:h-auto">
            <Image
              src="/photo2.jpg"
              alt="Nanawax collection"
              fill
              className="object-cover object-top"
              quality={85}
            />
            {/* Motif chevron en filigrane sur la photo */}
            <div className="absolute inset-0 pattern-wax opacity-[0.06]" />
          </div>

          {/* Texte */}
          <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-16">
            <p className="text-[9px] font-display uppercase tracking-[0.3em] text-nw-camel mb-6">
              L'univers Nanawax
            </p>
            <h2 className="font-display font-thin text-4xl md:text-5xl text-nw-black leading-tight mb-8">
              Des pièces qui<br />ne ressemblent<br />qu'à vous.
            </h2>
            <div className="w-8 h-px bg-nw-camel mb-8" />
            <p className="text-sm font-body text-nw-black/55 leading-relaxed max-w-sm">
              Coupes amples, motifs wax géométriques, matières fluides.
              Chaque vente privée présente une sélection exclusive, disponible uniquement pour les invitées.
            </p>
          </div>
        </div>
      </section>

      {/* ── INSCRIPTION VIP ──────────────────────────────────── */}
      <section id="acces" className="bg-nw-black py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pattern-wax opacity-[0.03]" />

        <div className="relative z-10 max-w-md mx-auto">
          <Image
            src="/logo.png"
            alt="Nanawax"
            width={85}
            height={38}
            unoptimized
            className="mx-auto mb-10 invert"
          />
          <p className="text-[10px] font-display uppercase tracking-[0.3em] text-nw-camel mb-4">
            Accès VIP
          </p>
          <p className="font-display font-thin text-3xl text-nw-white mb-6 leading-snug">
            Rejoignez<br />la liste
          </p>
          <div className="w-8 h-px bg-nw-camel mx-auto mb-8" />
          <p className="text-sm text-nw-white/40 font-body mb-10 leading-relaxed max-w-xs mx-auto">
            Cliquez ci-dessous pour vous inscrire.<br />
            Vous serez guidée étape par étape pour rejoindre la communauté VIP.
          </p>
          <WaitlistButton />
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-nw-black border-t border-nw-white/8 px-6 py-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-white/25">
            © 2026 Nanawax
          </p>
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-white/20">
            Événements exclusifs · Paris
          </p>
        </div>
      </footer>

    </main>
  )
}
