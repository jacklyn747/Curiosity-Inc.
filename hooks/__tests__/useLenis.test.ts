// hooks/__tests__/useLenis.test.ts
import { renderHook } from '@testing-library/react'

// Mock Lenis before importing the hook
jest.mock('lenis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    raf: jest.fn(),
    destroy: jest.fn(),
  }))
})

// Mock @/lib/gsap
jest.mock('@/lib/gsap', () => ({
  gsap: {
    ticker: {
      add: jest.fn(),
      remove: jest.fn(),
      lagSmoothing: jest.fn(),
    },
  },
  ScrollTrigger: { update: jest.fn() },
}))

import Lenis from 'lenis'
import { gsap } from '@/lib/gsap'
import { useLenis } from '../useLenis'

describe('useLenis', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initialises Lenis with lerp: 0.08', () => {
    renderHook(() => useLenis())
    expect(Lenis).toHaveBeenCalledWith({ lerp: 0.08 })
  })

  it('adds a GSAP ticker callback on mount', () => {
    renderHook(() => useLenis())
    expect(gsap.ticker.add).toHaveBeenCalledTimes(1)
    expect(typeof (gsap.ticker.add as jest.Mock).mock.calls[0][0]).toBe('function')
  })

  it('removes ticker callback and destroys Lenis on unmount', () => {
    const { unmount } = renderHook(() => useLenis())
    const addedCallback = (gsap.ticker.add as jest.Mock).mock.calls[0][0]
    unmount()
    expect(gsap.ticker.remove).toHaveBeenCalledWith(addedCallback)
    const mockInstance = (Lenis as jest.Mock).mock.results[0].value
    expect(mockInstance.destroy).toHaveBeenCalledTimes(1)
  })
})
