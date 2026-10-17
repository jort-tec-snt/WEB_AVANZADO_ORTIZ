import { UnifrakturCook, IM_Fell_English } from 'next/font/google'

// Títulos: gótica, emparentada con el logo
export const fraktur = UnifrakturCook({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-fraktur',
  display: 'swap',
})

// Texto: imprenta antigua, legible y con carácter
export const fell = IM_Fell_English({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-fell',
  display: 'swap',
})
