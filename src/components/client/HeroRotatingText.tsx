'use client'

import { useState, useEffect } from 'react'

const phrasesWithToken = [
  { text: 'Votre invitation personnelle est prête.', highlight: false },
  { text: 'Cliquez sur le bouton ci-dessous.', highlight: true },
]

const phrasesWithoutToken = [
  { text: 'Créations wax & événements exclusifs.', highlight: false },
  { text: 'Sur invitation uniquement.', highlight: true },
]

const FADE_MS = 900
const HOLD_MS = 2800

interface Props { hasToken: boolean }

export function HeroRotatingText({ hasToken }: Props) {
  const phrases = hasToken ? phrasesWithToken : phrasesWithoutToken
  const [index,   setIndex]   = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setIndex(0)
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [hasToken])

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setVisible(false), HOLD_MS)
    return () => clearTimeout(t)
  }, [visible, index])

  useEffect(() => {
    if (visible) return
    const t = setTimeout(() => {
      setIndex(i => (i + 1) % phrases.length)
      setVisible(true)
    }, FADE_MS + 100)
    return () => clearTimeout(t)
  }, [visible, phrases.length])

  const phrase = phrases[index]

  return (
    <div className="h-7 flex items-center justify-center mb-4">
      <p
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease`,
          textShadow: '0 1px 16px rgba(0,0,0,1), 0 2px 6px rgba(0,0,0,0.8)',
        }}
        className={`text-sm font-display tracking-wide ${
          phrase.highlight ? 'font-semibold text-nw-camel' : 'font-light text-white/95'
        }`}
      >
        {phrase.text}
      </p>
    </div>
  )
}
