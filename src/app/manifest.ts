import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dompetku App',
    short_name: 'Dompetku',
    description: 'Aplikasi Keuangan Pribadi Mobile-First',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icon-512x512.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
