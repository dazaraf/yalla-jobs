'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { EndorseModal } from './endorse-modal'
import { ViewEndorsementsModal } from './view-endorsements-modal'
import { getUserProfile } from '@/actions/auth'

interface SeekerCardProps {
  id: string
  profileId: string
  name: string
  bio: string | null
  skillTags: string[]
  endorsements: number
  walletAddress: string
  telegramHandle?: string
}

export function SeekerCard({
  id,
  profileId,
  name,
  bio,
  skillTags,
  endorsements,
  walletAddress,
  telegramHandle,
}: SeekerCardProps) {
  const { address, isConnected } = useAccount()
  const [showContact, setShowContact] = useState(false)
  const [copied, setCopied] = useState(false)
  const [endorsementCount, setEndorsementCount] = useState(endorsements)
  
  const [showEndorseModal, setShowEndorseModal] = useState(false)
  const [showViewEndorsements, setShowViewEndorsements] = useState(false)
  
  const [endorserProfile, setEndorserProfile] = useState<{ name: string; telegram: string } | null>(null)
  const [noProfile, setNoProfile] = useState(false)

  const shortenedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
  const isOwnProfile = isConnected && address?.toLowerCase() === walletAddress.toLowerCase()

  useEffect(() => {
    if (isConnected && address) {
      getUserProfile(address).then((user) => {
        if (user?.profile) {
          setEndorserProfile({
            name: user.profile.name,
            telegram: user.profile.telegramHandle,
          })
          setNoProfile(false)
        } else {
          setNoProfile(true)
        }
      })
    }
  }, [isConnected, address])

  const handleEndorseClick = () => {
    if (!isConnected) {
      alert('Please connect your wallet to endorse')
      return
    }
    if (isOwnProfile) {
      alert('You cannot endorse yourself')
      return
    }
    if (noProfile) {
      alert('You need to create a profile before endorsing others')
      return
    }
    setShowEndorseModal(true)
  }

  const handleEndorseSuccess = () => {
    setEndorsementCount((prev) => prev + 1)
  }

  return (
    <>
      <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all hover:-translate-y-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg"
              style={{
                background: `linear-gradient(135deg, 
                  hsl(${parseInt(walletAddress.slice(2, 6), 16) % 360}, 60%, 45%), 
                  hsl(${parseInt(walletAddress.slice(6, 10), 16) % 360}, 60%, 55%))`
              }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-white">{name}</h3>
              <p className="text-xs text-zinc-500 font-mono">{shortenedAddress}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowViewEndorsements(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 transition-colors"
          >
            <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-orange-400">{endorsementCount}</span>
          </button>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{bio}</p>
        )}

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {skillTags.slice(0, 4).map((skill) => (
            <span 
              key={skill} 
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-300"
            >
              {skill}
            </span>
          ))}
          {skillTags.length > 4 && (
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-500">
              +{skillTags.length - 4}
            </span>
          )}
        </div>

        {/* Actions */}
        {!showContact ? (
          <div className="flex gap-3">
            <button 
              onClick={() => setShowContact(true)}
              className="flex-1 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors"
            >
              Contact
            </button>
            <button 
              onClick={handleEndorseClick}
              disabled={isOwnProfile}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isOwnProfile 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
              }`}
            >
              Endorse
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 font-mono text-sm text-orange-400">
                {telegramHandle || '@handle'}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(telegramHandle || '')
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                {copied ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            <button
              onClick={() => setShowContact(false)}
              className="w-full text-xs text-zinc-500 hover:text-zinc-400"
            >
              ← Back
            </button>
          </div>
        )}
      </div>

      <EndorseModal
        isOpen={showEndorseModal}
        onClose={() => setShowEndorseModal(false)}
        profileId={profileId}
        seekerName={name}
        endorserName={endorserProfile?.name}
        endorserWallet={address}
        onSuccess={handleEndorseSuccess}
      />

      <ViewEndorsementsModal
        isOpen={showViewEndorsements}
        onClose={() => setShowViewEndorsements(false)}
        profileId={profileId}
        seekerName={name}
        endorsementCount={endorsementCount}
      />
    </>
  )
}
