import { render } from '@testing-library/react'
import { ThinLineSystem } from '../ThinLineSystem'

describe('ThinLineSystem', () => {
  it('renders minimal variant without crashing', () => {
    const { container } = render(<ThinLineSystem variant="minimal" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders hero variant without crashing', () => {
    const { container } = render(<ThinLineSystem variant="hero" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders system variant without crashing', () => {
    const { container } = render(<ThinLineSystem variant="system" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('is aria-hidden', () => {
    const { container } = render(<ThinLineSystem />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
