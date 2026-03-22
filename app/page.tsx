'use client'

import dynamic from 'next/dynamic'
import { Navbar }             from '@/components/navbar'
import { ScrollProgress }     from '@/components/scroll-progress'
import { BackToTop }          from '@/components/back-to-top'
import { CursorSpotlight }    from '@/components/cursor-spotlight'
import { FEATURES }           from '@/lib/feature-flags'

const LoadingScreen = dynamic(
  () => import('@/components/loading-screen').then((m) => m.LoadingScreen),
  { ssr: false },
)

import { HeroSection }         from '@/components/sections/hero'
import { MarqueeTicker }       from '@/components/sections/marquee-ticker'
import { AboutSection }        from '@/components/sections/about'
import { SkillsSection }       from '@/components/sections/skills'
import { ExperienceSection }   from '@/components/sections/experience'
import { ProjectsSection }     from '@/components/sections/projects'
import { AchievementsSection } from '@/components/sections/achievements'
import { EducationSection }    from '@/components/sections/education'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { ContactSection }      from '@/components/sections/contact'
import { Footer }              from '@/components/footer'
import { FloatingThemeSwitcher } from '@/components/theme-switcher'

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <CursorSpotlight />
      <Navbar />

      <main>
        <HeroSection />
        <MarqueeTicker />
        <AboutSection />
        <SectionDivider />
        <SkillsSection />
        <SectionDivider />
        <ExperienceSection />
        <SectionDivider />
        <ProjectsSection />
        <SectionDivider />
        <AchievementsSection />
        <SectionDivider />
        <EducationSection />

        {/* Testimonials — gated by feature flag */}
        {FEATURES.testimonials && (
          <>
            <SectionDivider />
            <TestimonialsSection />
          </>
        )}

        <SectionDivider />
        <ContactSection />
      </main>

      <Footer />
      <FloatingThemeSwitcher />
      <BackToTop />
    </>
  )
}

function SectionDivider() {
  return (
    <div
      className="h-px mx-auto"
      style={{
        background: 'linear-gradient(90deg, transparent, var(--section-divider), transparent)',
        maxWidth: '1280px',
        opacity: 0.6,
      }}
    />
  )
}