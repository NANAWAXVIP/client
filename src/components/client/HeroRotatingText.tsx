'use client'

import { useState, useEffect } from 'react'

const phrases = [
  { text: 'Créations wax & événements exclusifs.', highlight: false },
  { text: 'Pour rejoindre la communauté VIP,', highlight: false },
  { text: 'cliquez sur le bouton ci-dessous.', highlight: true },
]

const FADE_MS = 900
const HOLD_MS = 2800

export function HeroRotatingText() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  // Initial fade-in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [])

  // Hold then fade-out
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setVisible(false), HOLD_MS)
    return () => clearTimeout(t)
  }, [visible, index])

  // After fade-out completes, advance to next phrase
  useEffect(() => {
    if (visible) return
    const t = setTimeout(() => {
      setIndex(i => (i + 1) % phrases.length)
      setVisible(true)
    }, FADE_MS + 100)
    return () => clearTimeout(t)
  }, [visible])

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
          phrase.highlight
            ? 'font-semibold text-nw-camel'
            : 'font-light text-white/95'
        }`}
      >
        {phrase.text}
      </p>
    </div>
  )
}
