import { render, screen } from '@testing-library/react'
import { Marquee } from '../Marquee'

describe('Marquee', () => {
  it('renders default vocabulary words', () => {
    render(<Marquee />)
    // Words are duplicated — check at least one instance
    const words = screen.getAllByText('Behavior Design')
    expect(words.length).toBeGreaterThanOrEqual(1)
  })

  it('renders custom words', () => {
    render(<Marquee words={['Custom Word', 'Another Word']} />)
    expect(screen.getAllByText('Custom Word').length).toBeGreaterThanOrEqual(1)
  })

  it('is aria-hidden (decorative)', () => {
    const { container } = render(<Marquee />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })
})
