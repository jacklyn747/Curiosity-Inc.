// Tests that the gsap module exports what components expect
import { gsap, ScrollTrigger, SplitText } from '../gsap'

describe('gsap module', () => {
  it('exports gsap instance', () => {
    expect(gsap).toBeDefined()
    expect(typeof gsap.to).toBe('function')
    expect(typeof gsap.from).toBe('function')
    expect(typeof gsap.timeline).toBe('function')
  })

  it('exports ScrollTrigger', () => {
    expect(ScrollTrigger).toBeDefined()
  })

  it('exports SplitText', () => {
    expect(SplitText).toBeDefined()
  })
})
