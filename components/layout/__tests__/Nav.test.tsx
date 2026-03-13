import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { Nav } from '../Nav'

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

describe('Nav', () => {
  it('renders logo text', () => {
    render(<Nav />)
    expect(screen.getByText(/Curiosity/)).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Nav />)
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('The System')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders CTA link', () => {
    render(<Nav />)
    expect(screen.getByText('Start a Project')).toBeInTheDocument()
  })

  it('links to correct hrefs', () => {
    render(<Nav />)
    expect(screen.getByText('Work').closest('a')).toHaveAttribute('href', '/work')
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about')
  })
})
