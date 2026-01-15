'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { EthosBadge } from './ethos-badge'

const navLinks = [
  { href: '/seekers', label: 'Browse Talent' },
  { href: '/#how-it-works', label: 'How It Works' },
]

export function Navigation() {
  const pathname = usePathname()
  const [showEthos, setShowEthos] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-zinc-800/50">
      <nav className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center rotate-45 group-hover:rotate-[405deg] transition-transform duration-500">
            <span className="text-white font-bold -rotate-45 group-hover:rotate-[-405deg] transition-transform duration-500">P</span>
          </div>
          <span className="font-semibold text-white text-lg">Paprikos</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted
              const connected = ready && account && chain

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg border border-zinc-700 transition-colors"
                        >
                          Connect Wallet
                        </button>
                      )
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          className="px-5 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-medium hover:bg-red-500/30 transition-colors"
                        >
                          Wrong Network
                        </button>
                      )
                    }

                    return (
                      <div
                        className="relative"
                        onMouseEnter={() => setShowEthos(true)}
                        onMouseLeave={() => setShowEthos(false)}
                      >
                        <button
                          onClick={openAccountModal}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-600 transition-colors"
                        >
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600" />
                          <span className="text-sm font-medium text-white">
                            {account.displayName}
                          </span>
                        </button>
                        {showEthos && (
                          <div className="absolute right-0 top-full mt-2 w-72 z-50">
                            <EthosBadge />
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )
            }}
          </ConnectButton.Custom>
        </div>
      </nav>
    </header>
  )
}
