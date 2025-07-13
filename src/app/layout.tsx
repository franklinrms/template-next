import './globals.css'

import type { Metadata } from 'next'
import { NuqsAdapter } from 'nuqs/adapters/next'

import { siteConfig } from '@/lib/config'
import { fontVariables } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { env } from '@/utils/env'

import { Provider } from './provider'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL!),
  description: siteConfig.description,
  // keywords: [''],
  // authors: [
  //   {
  //     name: '',
  //     url: '',
  //   },
  // ],
  // creator: '',
  // openGraph: {
  //   type: 'website',
  //   locale: 'en_US',
  //   url: env.NEXT_PUBLIC_APP_URL!,
  //   title: siteConfig.name,
  //   description: siteConfig.description,
  //   siteName: siteConfig.name,
  //   images: [
  //     {
  //       url: `${env.NEXT_PUBLIC_APP_URL}/opengraph-image.png`,
  //       width: 1200,
  //       height: 630,
  //       alt: siteConfig.name,
  //     },
  //   ],
  // },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: siteConfig.name,
  //   description: siteConfig.description,
  //   images: [`${env.NEXT_PUBLIC_APP_URL}/opengraph-image.png`],
  //   creator: '',
  // },
  // icons: {
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
  // manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'text-foreground group/body overscroll-none font-sans antialiased',
          fontVariables,
        )}
      >
        <NuqsAdapter>
          <Provider>{children}</Provider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
