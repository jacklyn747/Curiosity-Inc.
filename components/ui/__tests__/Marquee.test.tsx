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

  it('exposes vocabulary via aria-label on outer container', () => {
    const { container } = render(<Marquee />)
    const outer = container.firstChild as HTMLElement
    expect(outer).not.toHaveAttribute('aria-hidden')
    expect(outer).toHaveAttribute('aria-label')
    expect(outer.getAttribute('aria-label')).toContain('Behavior Design')
  })

  it('sets scroll speed via CSS custom property', () => {
    const { container } = render(<Marquee speed="40s" />)
    const el = container.firstChild as HTMLElement
    expect(el.style.getPropertyValue('--speed')).toBe('40s')
  })

  it('forwards className to outer container', () => {
    const { container } = render(<Marquee className="my-marquee" />)
    expect(container.firstChild).toHaveClass('my-marquee')
  })

  it('marks the animated track as aria-hidden', () => {
    const { container } = render(<Marquee />)
    // The track is the first child of the outer container
    const track = container.firstChild?.firstChild as HTMLElement
    expect(track).toHaveAttribute('aria-hidden', 'true')
  })
})
