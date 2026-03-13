import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Curiosity Inc.',
  description: 'Behavior design at the intersection of Marketing, Instructional Design, and UX.',
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
