import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Footer } from '../Footer'

jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

jest.mock('@/components/geo/StarField', () => ({
  StarField: () => null,
}))

describe('Footer', () => {
  it('renders logo', () => {
    render(<Footer />)
    expect(screen.getAllByText(/Curiosity/)[0]).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Footer />)
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('The System')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders contact email', () => {
    render(<Footer />)
    expect(screen.getByText('hello@curiosity.inc')).toBeInTheDocument()
  })

  it('renders copyright year', () => {
    render(<Footer />)
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
  })
})
