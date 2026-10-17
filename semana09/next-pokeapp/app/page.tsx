import { redirect } from 'next/navigation'

// La página de inicio lleva directo a la galería
export default function Home() {
  redirect('/gallery')
}
