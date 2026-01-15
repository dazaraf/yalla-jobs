import type { Metadata } from 'next'
import { Web3Providers } from '@/components/providers'
import { Navigation } from '@/components/navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Paprikos | Hire Crypto-Native Talent',
  description: 'A curated network of vetted crypto-native talent for serious teams. Connect directly with builders from your local crypto community.',
  keywords: ['bitcoin', 'jobs', 'crypto', 'web3', 'hiring', 'talent', 'paprikos'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Web3Providers>
          <Navigation />
          <main>{children}</main>
        </Web3Providers>
      </body>
    </html>
  )
}
