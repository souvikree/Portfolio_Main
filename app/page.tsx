'use client'

import dynamic from 'next/dynamic'
import { Navbar } from '@/components/navbar'

const LoadingScreen = dynamic(
  () => import('@/components/loading-screen').then((m) => m.LoadingScreen),
  { ssr: false },
)
import { HeroSection } from '@/components/sections/hero'
import { MarqueeTicker } from '@/components/sections/marquee-ticker'
import { AboutSection } from '@/components/sections/about'
import { SkillsSection } from '@/components/sections/skills'
import { ExperienceSection } from '@/components/sections/experience'
import { ProjectsSection } from '@/components/sections/projects'
import { AchievementsSection } from '@/components/sections/achievements'
import { EducationSection } from '@/components/sections/education'
import { ContactSection } from '@/components/sections/contact'
import { Footer } from '@/components/footer'
import { FloatingThemeSwitcher } from '@/components/theme-switcher'

export default function HomePage() {
  return (
    <>
      {/* Loading splash */}
      <LoadingScreen />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main>
        {/* 1. Hero — name, photo, CTA, social links */}
        <HeroSection />

        {/* 2. Marquee — tech stack ticker */}
        <MarqueeTicker />

        {/* 3. About — bio, terminal, counters */}
        <AboutSection />

        {/* Section divider */}
        <SectionDivider />

        {/* 4. Skills — categorized, animated progress bars */}
        <SkillsSection />

        <SectionDivider />

        {/* 5. Experience — timeline */}
        <ExperienceSection />

        <SectionDivider />

        {/* 6. Projects — flip cards + showcase view */}
        <ProjectsSection />

        <SectionDivider />

        {/* 7. Achievements — horizontal scroll carousel */}
        <AchievementsSection />

        <SectionDivider />

        {/* 8. Education — flip-in cards */}
        <EducationSection />

        <SectionDivider />

        {/* 9. Contact — form + info panel */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating theme picker — always accessible */}
      <FloatingThemeSwitcher />
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
