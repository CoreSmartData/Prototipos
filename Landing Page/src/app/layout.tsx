import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Core Smart Data - Soluciones Tecnológicas para Construcción y Energías Renovables',
  description: 'Integramos soluciones de desarrollo de software y diseño digital para empresas de construcción y energías renovables, basadas en datos y adaptadas a las necesidades del mercado.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 