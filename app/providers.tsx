'use client'

import { useLenis } from '@/hooks/useLenis'

export function Providers({ children }: { children: React.ReactNode }) {
  useLenis()
  return <>{children}</>
}
