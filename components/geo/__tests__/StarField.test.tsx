import { render } from '@testing-library/react'
import { StarField } from '../StarField'

describe('StarField', () => {
  it('renders without crashing', () => {
    const { container } = render(<StarField />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('is aria-hidden', () => {
    const { container } = render(<StarField />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders star circles', () => {
    const { container } = render(<StarField />)
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThan(10)
  })

  it('forwards className to svg', () => {
    const { container } = render(<StarField className="opacity-30" />)
    expect(container.querySelector('svg')).toHaveClass('opacity-30')
  })
})
