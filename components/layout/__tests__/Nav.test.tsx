import type { ReactNode } from 'react'
import { render, screen, act } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'

// Override the global CSS module mock with real string values so className
// changes are observable during scroll tests.
jest.mock('../Nav.module.css', () => ({
  nav: 'nav',
  scrolled: 'scrolled',
  logo: 'logo',
  logoAccent: 'logoAccent',
  links: 'links',
  link: 'link',
  cta: 'cta',
}))

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

import { Nav } from '../Nav'

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
    expect(screen.getByText('The System').closest('a')).toHaveAttribute('href', '/the-system')
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about')
    expect(screen.getByText('Start a Project').closest('a')).toHaveAttribute('href', '/contact')
    expect(screen.getByText(/Curiosity/).closest('a')).toHaveAttribute('href', '/')
  })

  describe('scroll behavior', () => {
    beforeEach(() => {
      // Reset scrollY to 0 before each scroll test
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true })
    })

    it('does not add scrolled class when scrollY is 40 or less', () => {
      render(<Nav />)
      const nav = screen.getByRole('navigation')
      const initialClass = nav.className

      Object.defineProperty(window, 'scrollY', { value: 40, configurable: true, writable: true })
      act(() => {
        fireEvent.scroll(window)
      })

      expect(nav.className).toBe(initialClass)
    })

    it('adds scrolled class after scrolling past 40px', () => {
      render(<Nav />)
      const nav = screen.getByRole('navigation')
      const initialClass = nav.className

      Object.defineProperty(window, 'scrollY', { value: 41, configurable: true, writable: true })
      act(() => {
        fireEvent.scroll(window)
      })

      expect(nav.className).not.toBe(initialClass)
      expect(nav.className).toContain('scrolled')
    })

    it('removes scrolled class when scrolling back to 40px or less', () => {
      render(<Nav />)
      const nav = screen.getByRole('navigation')

      // Scroll past threshold
      Object.defineProperty(window, 'scrollY', { value: 41, configurable: true, writable: true })
      act(() => {
        fireEvent.scroll(window)
      })
      expect(nav.className).toContain('scrolled')

      // Scroll back below threshold
      Object.defineProperty(window, 'scrollY', { value: 40, configurable: true, writable: true })
      act(() => {
        fireEvent.scroll(window)
      })
      expect(nav.className).not.toContain('scrolled')
    })

    it('removes scroll listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
      const { unmount } = render(<Nav />)
      unmount()
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
      removeEventListenerSpy.mockRestore()
    })
  })
})
