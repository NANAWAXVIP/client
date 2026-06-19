import Image from 'next/image'
import Link from 'next/link'

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
          {/* Gradient sombre en haut pour le logo */}
          <div className="absolute inset-0 bg-gradient-to-b from-nw-black/70 via-transparent to-nw-black/80" />
        </div>

        {/* Logo centré en haut */}
        <header className="relative z-10 flex justify-center pt-10 pb-0">
          <Image
            src="/logo.png"
            alt="Nanawax"
            width={180}
            height={80}
            unoptimized
            className="invert brightness-0 invert"
          />
        </header>

        {/* Texte bas du hero */}
        <div className="relative z-10 mt-auto px-6 pb-14 text-center">
          <p className="text-[10px] font-display font-light tracking-[0.4em] uppercase text-nw-camel mb-5">
            Ventes privées · Sur invitation
          </p>
          <h1 className="font-display font-thin text-nw-white leading-[0.92] mb-8" style={{ fontSize: 'clamp(52px, 14vw, 120px)' }}>
            Wax.<br />Luxe.<br />Privé.
          </h1>
          <div className="w-8 h-px bg-nw-camel mx-auto mb-8" />
          <p className="text-sm font-display font-light text-nw-white/60 tracking-wide max-w-xs mx-auto leading-relaxed mb-10">
            Prêt-à-porter wax & afro premium.<br />
            Accès réservé aux clientes VIP.
          </p>
          <Link
            href="#acces"
            className="inline-block bg-nw-camel text-nw-white text-[11px] font-display font-light uppercase tracking-[0.15em] px-8 py-4 hover:bg-[#a3744e] transition-colors"
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
                title: 'Montrez votre intérêt',
                desc: 'Envoyez un message à Nanawax sur les réseaux sociaux pour rejoindre la prochaine vente privée.',
              },
              {
                n: '02',
                title: 'Recevez votre lien personnel',
                desc: 'Un lien unique et non-partageable vous est envoyé. Il vous permet de vous inscrire en quelques secondes.',
              },
              {
                n: '03',
                title: 'Accédez à la vente privée',
                desc: 'Date, lieu et horaire vous sont communiqués après confirmation. Catalogue exclusif et cadeaux VIP vous attendent.',
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
              src="/hero.jpg"
              alt="Nanawax collection"
              fill
              className="object-cover object-center"
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

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <section id="acces" className="bg-nw-black py-24 px-6 text-center relative overflow-hidden">
        {/* Pattern chevron très subtil */}
        <div className="absolute inset-0 pattern-wax opacity-[0.03]" />

        <div className="relative z-10 max-w-md mx-auto">
          <Image
            src="/logo.png"
            alt="Nanawax"
            width={140}
            height={62}
            unoptimized
            className="mx-auto mb-10 invert brightness-0 invert"
          />
          <p className="font-display font-thin text-3xl text-nw-white mb-4 leading-snug">
            Prochaine vente<br />privée
          </p>
          <p className="text-sm text-nw-white/40 font-body mb-10 leading-relaxed">
            Pour recevoir votre lien d'accès personnel,<br />
            contactez Nanawax directement sur Instagram.
          </p>
          <a
            href="https://instagram.com/nanawax"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-nw-white text-nw-black text-[11px] font-display font-light uppercase tracking-[0.15em] px-8 py-4 hover:bg-nw-camel hover:text-nw-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Nous contacter sur Instagram
          </a>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-nw-black border-t border-nw-white/8 px-6 py-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-white/25">
            © 2026 Nanawax
          </p>
          <p className="text-[10px] font-display uppercase tracking-[0.2em] text-nw-white/20">
            Ventes privées · Paris
          </p>
        </div>
      </footer>

    </main>
  )
}
