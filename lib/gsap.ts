// lib/gsap.ts
// Import and register all GSAP plugins in one place.
// Every component should import gsap from here, not directly from 'gsap'.

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

// Register once at module level — safe to call multiple times
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin)
}

export { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin }
export default gsap
