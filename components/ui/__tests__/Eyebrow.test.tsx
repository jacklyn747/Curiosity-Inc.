import { render, screen } from '@testing-library/react'
import { Eyebrow } from '../Eyebrow'

describe('Eyebrow', () => {
  it('renders children text', () => {
    render(<Eyebrow>Behavior Design</Eyebrow>)
    expect(screen.getByText('Behavior Design')).toBeInTheDocument()
  })

  it('renders the rule line', () => {
    const { container } = render(<Eyebrow>Label</Eyebrow>)
    const ruleLine = container.querySelector('[aria-hidden="true"]')
    expect(ruleLine).toBeInTheDocument()
  })

  it('applies custom color to rule line and text', () => {
    const { container } = render(<Eyebrow color="#808BC5">System</Eyebrow>)
    const ruleLine = container.querySelector('[aria-hidden="true"]') as HTMLElement
    const textSpan = screen.getByText('System') as HTMLElement
    // jsdom normalizes hex to rgb for both background and color
    expect(ruleLine.style.background).toBe('rgb(128, 139, 197)')
    expect(textSpan.style.color).toBe('rgb(128, 139, 197)')
  })

  it('forwards className to wrapper div', () => {
    const { container } = render(<Eyebrow className="mt-8">Label</Eyebrow>)
    expect(container.firstChild).toHaveClass('mt-8')
  })
})
