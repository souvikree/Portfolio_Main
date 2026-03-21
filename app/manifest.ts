import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             'Souvik Ghosh — Software Engineer',
    short_name:       'Souvik Ghosh',
    description:      'Portfolio of Souvik Ghosh, Software Engineer specializing in distributed systems & real-time apps.',
    start_url:        '/',
    display:          'standalone',
    background_color: '#050508',
    theme_color:      '#050508',
    icons: [
      {
        src:   '/favicon-192x192.png',
        sizes: '192x192',
        type:  'image/png',
      },
      {
        src:   '/favicon-512x512.png',
        sizes: '512x512',
        type:  'image/png',
      },
      {
        src:     '/favicon-512x512.png',
        sizes:   '512x512',
        type:    'image/png',
        purpose: 'maskable',
      },
    ],
  }
}