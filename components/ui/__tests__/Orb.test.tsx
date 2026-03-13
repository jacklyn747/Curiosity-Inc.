import { render } from '@testing-library/react'
import { Orb } from '../Orb'

describe('Orb', () => {
  it('renders with default size', () => {
    const { container } = render(<Orb />)
    const el = container.firstChild as HTMLElement
    expect(el.style.width).toBe('14px')
    expect(el.style.height).toBe('14px')
  })

  it('renders with custom size', () => {
    const { container } = render(<Orb size={20} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.width).toBe('20px')
    expect(el.style.height).toBe('20px')
  })

  it('is aria-hidden (decorative only)', () => {
    const { container } = render(<Orb />)
    const el = container.firstChild as HTMLElement
    expect(el.getAttribute('aria-hidden')).toBe('true')
  })

  it('sets animation duration via CSS custom property', () => {
    const { container } = render(<Orb duration="5s" />)
    const el = container.firstChild as HTMLElement
    expect(el.style.getPropertyValue('--duration')).toBe('5s')
  })

  it('forwards className to span', () => {
    const { container } = render(<Orb className="absolute" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('absolute')
  })
})
