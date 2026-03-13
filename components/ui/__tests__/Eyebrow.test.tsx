import { render, screen } from '@testing-library/react'
import { Eyebrow } from '../Eyebrow'

describe('Eyebrow', () => {
  it('renders children text', () => {
    render(<Eyebrow>Behavior Design</Eyebrow>)
    expect(screen.getByText('Behavior Design')).toBeInTheDocument()
  })

  it('renders the rule line', () => {
    const { container } = render(<Eyebrow>Label</Eyebrow>)
    // The span with aria-hidden is the rule line
    const ruleLine = container.querySelector('[aria-hidden="true"]')
    expect(ruleLine).toBeInTheDocument()
  })

  it('applies custom color to rule line', () => {
    const { container } = render(<Eyebrow color="#808BC5">System</Eyebrow>)
    const ruleLine = container.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(ruleLine.style.background).toBe('rgb(128, 139, 197)')
  })
})
