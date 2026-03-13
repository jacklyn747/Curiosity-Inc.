import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: { default: 'Curiosity Inc.', template: '%s | Curiosity Inc.' },
  description: 'Behavior design at the intersection of Marketing, Instructional Design, and UX.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
