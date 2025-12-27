import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Plant Breeding',
  description: 'A simple Next.js website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

