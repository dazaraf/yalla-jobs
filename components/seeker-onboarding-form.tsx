'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useSignMessage } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { saveProfile } from '@/actions/auth'

export function SeekerOnboardingForm() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  
  const [currentStep, setCurrentStep] = React.useState(1)
  const [name, setName] = React.useState('')
  const [bio, setBio] = React.useState('')
  const [skills, setSkills] = React.useState('')
  const [telegram, setTelegram] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleNext = () => {
    if (currentStep === 1 && !name.trim()) {
      setError('Please enter your name')
      return
    }
    if (currentStep === 2 && !skills.trim()) {
      setError('Please enter at least one skill')
      return
    }
    setError('')
    setCurrentStep(prev => prev + 1)
  }

  const handlePrevious = () => {
    setError('')
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!telegram.trim() || !telegram.startsWith('@')) {
      setError('Please enter a valid Telegram handle starting with @')
      return
    }

    if (!address) {
      setError('Please connect your wallet')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const message = `Sign this message to create your Yalla Jobs profile.\n\nWallet: ${address}\nTimestamp: ${Date.now()}`
      await signMessageAsync({ message })

      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean)
      
      const result = await saveProfile(address, {
        name: name.trim(),
        bio: bio.trim(),
        telegramHandle: telegram.trim(),
        skillTags: skillsArray,
        projectLinks: [],
      })

      if (result.success) {
        router.push('/seekers')
      } else {
        setError(result.error || 'Failed to save profile')
      }
    } catch (err) {
      console.error('Submit error:', err)
      setError('Failed to create profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-lg mx-auto glossy-card rounded-2xl p-8 text-center yalla-glow">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border-2 border-zinc-600 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <span className="text-xl font-bold text-zinc-900" style={{ fontFamily: 'Orbitron' }}>Y₿</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Orbitron' }}>
          <span className="yalla-gradient-text">CONNECT</span>
          <span className="text-white"> WALLET</span>
        </h2>
        <p className="text-zinc-400 mb-6" style={{ fontFamily: 'Rajdhani' }}>
          Connect your wallet to create your seeker profile and join the Yalla Jobs network.
        </p>
        <ConnectButton />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400" style={{ fontFamily: 'Rajdhani' }}>Step {currentStep} of 3</span>
          <span className="text-sm text-orange-400 font-semibold" style={{ fontFamily: 'Rajdhani' }}>
            {currentStep === 1 ? 'Basic Info' : currentStep === 2 ? 'Skills' : 'Contact'}
          </span>
        </div>
        <div className="flex gap-2">
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${currentStep >= 1 ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-zinc-800'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-zinc-800'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${currentStep >= 3 ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-zinc-800'}`} />
        </div>
      </div>

      {/* Form card */}
      <div className="glossy-card rounded-2xl p-8">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Orbitron' }}>
                <span className="text-zinc-400">BASIC</span>
                <span className="yalla-gradient-text"> INFO</span>
              </h2>
              <p className="text-zinc-400" style={{ fontFamily: 'Rajdhani' }}>Tell us about yourself</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-300 mb-2 font-semibold" style={{ fontFamily: 'Rajdhani' }}>
                  Display Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name or pseudonym"
                  className="glossy-input w-full px-4 py-3 rounded-xl text-white placeholder-zinc-500 focus:outline-none"
                  style={{ fontFamily: 'Rajdhani' }}
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-300 mb-2 font-semibold" style={{ fontFamily: 'Rajdhani' }}>
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell employers about yourself, your experience, and what you're looking for..."
                  className="glossy-input w-full px-4 py-3 rounded-xl text-white placeholder-zinc-500 focus:outline-none resize-none h-32"
                  style={{ fontFamily: 'Rajdhani' }}
                />
                <p className="text-xs text-zinc-500 mt-1" style={{ fontFamily: 'Rajdhani' }}>{bio.length}/500 characters</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Skills */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Orbitron' }}>
                <span className="text-zinc-400">YOUR</span>
                <span className="yalla-gradient-text"> SKILLS</span>
              </h2>
              <p className="text-zinc-400" style={{ fontFamily: 'Rajdhani' }}>What are you good at?</p>
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-2 font-semibold" style={{ fontFamily: 'Rajdhani' }}>
                Skills * (comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Bitcoin, Lightning Network, Rust, TypeScript..."
                className="glossy-input w-full px-4 py-3 rounded-xl text-white placeholder-zinc-500 focus:outline-none"
                style={{ fontFamily: 'Rajdhani' }}
              />
              <p className="text-xs text-zinc-500 mt-2" style={{ fontFamily: 'Rajdhani' }}>
                Add skills that best represent your expertise. These will help employers find you.
              </p>
            </div>

            {/* Suggested skills */}
            <div>
              <p className="text-sm text-zinc-400 mb-2" style={{ fontFamily: 'Rajdhani' }}>Popular skills:</p>
              <div className="flex flex-wrap gap-2">
                {['Bitcoin', 'Lightning Network', 'Solidity', 'Rust', 'TypeScript', 'React', 'Node.js', 'Python'].map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      const currentSkills = skills.split(',').map(s => s.trim()).filter(Boolean)
                      if (!currentSkills.includes(skill)) {
                        setSkills(currentSkills.length > 0 ? `${skills}, ${skill}` : skill)
                      }
                    }}
                    className="px-3 py-1 rounded-lg text-sm yalla-tag text-orange-300 hover:bg-orange-500/20 transition-all"
                    style={{ fontFamily: 'Rajdhani' }}
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Contact */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Orbitron' }}>
                <span className="text-zinc-400">CONTACT</span>
                <span className="yalla-gradient-text"> INFO</span>
              </h2>
              <p className="text-zinc-400" style={{ fontFamily: 'Rajdhani' }}>How can employers reach you?</p>
            </div>

            <div>
              <label className="block text-sm text-zinc-300 mb-2 font-semibold" style={{ fontFamily: 'Rajdhani' }}>
                Telegram Handle *
              </label>
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@yourhandle"
                className="glossy-input w-full px-4 py-3 rounded-xl text-white placeholder-zinc-500 focus:outline-none"
                style={{ fontFamily: 'Rajdhani' }}
              />
              <p className="text-xs text-zinc-500 mt-2" style={{ fontFamily: 'Rajdhani' }}>
                Your Telegram handle will be hidden until employers request to message you.
              </p>
            </div>

            {/* Profile Summary */}
            <div className="glossy-card rounded-xl p-4 mt-6">
              <h4 className="text-sm font-bold text-zinc-300 mb-3" style={{ fontFamily: 'Orbitron' }}>PROFILE SUMMARY</h4>
              <div className="space-y-2 text-sm" style={{ fontFamily: 'Rajdhani' }}>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Name</span>
                  <span className="text-zinc-300">{name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Skills</span>
                  <span className="text-zinc-300">{skills.split(',').filter(s => s.trim()).length} added</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Wallet</span>
                  <span className="text-orange-400 font-mono text-xs">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm" style={{ fontFamily: 'Rajdhani' }}>
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-3 rounded-xl border border-zinc-700 bg-zinc-800/50 text-zinc-300 font-bold hover:border-orange-500/30 transition-all flex items-center gap-2"
              style={{ fontFamily: 'Rajdhani' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              PREVIOUS
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="glossy-btn px-6 py-3 rounded-xl text-white font-bold flex items-center gap-2"
              style={{ fontFamily: 'Rajdhani' }}
            >
              NEXT
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="glossy-btn px-6 py-3 rounded-xl text-white font-bold flex items-center gap-2 disabled:opacity-50"
              style={{ fontFamily: 'Rajdhani' }}
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  CREATING...
                </>
              ) : (
                <>
                  CREATE PROFILE
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
