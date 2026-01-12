import { SeekerOnboardingForm } from '@/components/seeker-onboarding-form'
import { AccessGate } from '@/components/access-gate'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join as Seeker | BTC Jobs',
  description: 'Create your profile and connect with employers in the Bitcoin community.',
}

export default function SeekerOnboardingPage() {
  return (
    <AccessGate>
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Join as a{' '}
          <span className="gradient-text">Seeker</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Create your profile, showcase your skills, and connect with employers 
          building the future of Bitcoin and crypto.
        </p>
      </div>

      {/* Form */}
      <SeekerOnboardingForm />

      {/* Benefits section */}
      <div className="mt-16 grid md:grid-cols-3 gap-6 animate-fade-in animation-delay-300">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
            <span className="text-orange-400 text-xl">🔐</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Wallet-Based Identity</h3>
          <p className="text-sm text-zinc-400">
            No email or password needed. Your wallet is your identity in the decentralized job market.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
            <span className="text-orange-400 text-xl">🎯</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Targeted Discovery</h3>
          <p className="text-sm text-zinc-400">
            Get found by employers looking for your specific skills in the Bitcoin ecosystem.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
            <span className="text-orange-400 text-xl">💬</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Private Contact</h3>
          <p className="text-sm text-zinc-400">
            Your Telegram handle stays hidden until employers explicitly request to connect.
          </p>
        </div>
      </div>
    </div>
    </AccessGate>
  )
}
