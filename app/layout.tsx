import type { Metadata, Viewport } from 'next'
import {
  Space_Grotesk,
  JetBrains_Mono,
  Bebas_Neue,
  Inter,
  Syne,
  DM_Sans,
  Playfair_Display,
} from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
// import { CustomCursor } from '@/components/custom-cursor'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Souvik Ghosh — Software Engineer',
  description:
    'Portfolio of Souvik Ghosh, a Software Engineer specializing in distributed systems, real-time communication, and full-stack development. Building production-grade systems that scale.',
  keywords: [
    'Souvik Ghosh',
    'Software Engineer',
    'Full Stack Developer',
    'React',
    'Spring Boot',
    'Next.js',
    'WebRTC',
    'WebSockets',
    'Microservices',
    'Java',
    'Kolkata',
  ],
  authors: [{ name: 'Souvik Ghosh', url: 'https://github.com/souvikree' }],
  openGraph: {
    title: 'Souvik Ghosh — Software Engineer',
    description: 'Building production-grade systems that scale.',
    type: 'website',
    url: 'https://souvikghosh.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Souvik Ghosh — Software Engineer',
    description: 'Building production-grade systems that scale.',
  },
}

export const viewport: Viewport = {
  themeColor: '#050508',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="cyber-noir"
      data-scroll-behavior="smooth"
      className={`
        ${spaceGrotesk.variable}
        ${jetbrainsMono.variable}
        ${bebasNeue.variable}
        ${inter.variable}
        ${syne.variable}
        ${dmSans.variable}
        ${playfairDisplay.variable}
      `}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
        <ThemeProvider>
          {children}
          {/* <CustomCursor /> */}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
