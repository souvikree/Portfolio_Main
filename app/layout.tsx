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

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' })
const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-bebas', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const syne = Syne({ subsets: ['latin'], variable: '--font-syne', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

const BASE_URL = 'https://souviksportfolio.vercel.app'

export const metadata: Metadata = {
  // ── Base ────────────────────────────────────────────────────────────────────
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Souvik Ghosh — Software Engineer',
    template: '%s — Souvik Ghosh',
  },
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
    'India',
    'Open Source',
    'Netflix Eureka',
    'Distributed Systems',
  ],
  authors: [{ name: 'Souvik Ghosh', url: 'https://github.com/souvikree' }],
  creator: 'Souvik Ghosh',
  publisher: 'Souvik Ghosh',

  // ── Canonical ───────────────────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
  },

  // ── Open Graph ──────────────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'Souvik Ghosh',
    title: 'Souvik Ghosh — Software Engineer',
    description: 'Building production-grade systems that scale. Distributed systems, real-time communication, and clean architecture.',
    // Next.js auto-discovers /opengraph-image.tsx — no need to manually set images[]
    locale: 'en_US',
  },

  // ── Twitter / X ─────────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    site: '@reek_me',     // update to your Twitter handle if you have one, or remove
    creator: '@reek_me',
    title: 'Souvik Ghosh — Software Engineer',
    description: 'Building production-grade systems that scale. Distributed systems, real-time communication, and clean architecture.',
    // Next.js auto-discovers /opengraph-image.tsx for twitter:image too
  },

  // ── Icons ───────────────────────────────────────────────────────────────────
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // ── Robots ──────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Verification (add if you set up Google Search Console) ──────────────────
  // verification: {
  //   google: 'your-google-site-verification-token',
  // },
}

export const viewport: Viewport = {
  themeColor: '#050508',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}