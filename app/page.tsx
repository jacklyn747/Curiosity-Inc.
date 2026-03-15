import { HeroSection }    from '@/components/sections/HeroSection'
import { NoiseSection }   from '@/components/sections/NoiseSection'
import { SystemSection }  from '@/components/sections/SystemSection'
import { WorkSection }    from '@/components/sections/WorkSection'
import { AboutSection }   from '@/components/sections/AboutSection'
import { CTASection }     from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NoiseSection />
      <SystemSection />
      <WorkSection />
      <AboutSection />
      <CTASection />
    </>
  )
}
