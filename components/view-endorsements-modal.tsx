'use client'

import { useEffect, useState } from 'react'
import { getProfileEndorsements } from '@/actions/auth'

interface Endorsement {
  id: string
  endorserWallet: string
  endorserName?: string
  endorserTelegram?: string | null
  message: string
  relationshipTag: string
  createdAt: Date
}

interface ViewEndorsementsModalProps {
  isOpen: boolean
  onClose: () => void
  profileId: string
  seekerName: string
  endorsementCount: number
}

export function ViewEndorsementsModal({
  isOpen,
  onClose,
  profileId,
  seekerName,
  endorsementCount,
}: ViewEndorsementsModalProps) {
  const [endorsements, setEndorsements] = useState<Endorsement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen && profileId) {
      setIsLoading(true)
      getProfileEndorsements(profileId)
        .then(setEndorsements)
        .finally(() => setIsLoading(false))
    }
  }, [isOpen, profileId])

  if (!isOpen) return null

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md max-h-[80vh] bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-semibold text-white">Endorsements</h2>
            <p className="text-sm text-zinc-400">{seekerName} · {endorsementCount} endorsements</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-zinc-800 transition-colors">
            <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : endorsements.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <p className="text-zinc-400 text-sm">No endorsements yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {endorsements.map((endorsement) => (
                <div key={endorsement.id} className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 overflow-hidden max-w-full">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white text-sm truncate">
                        {endorsement.endorserName || 'Anonymous'}
                      </p>
                      <p className="text-xs text-zinc-500 font-mono">
                        {endorsement.endorserWallet.slice(0, 6)}...{endorsement.endorserWallet.slice(-4)}
                      </p>
                    </div>
                    <span className="text-xs text-zinc-500 flex-shrink-0">{formatDate(endorsement.createdAt)}</span>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-xs bg-orange-500/10 text-orange-400 mb-2">
                    {endorsement.relationshipTag}
                  </span>
                  <p className="text-sm text-zinc-300 leading-relaxed break-words overflow-hidden whitespace-pre-wrap overflow-wrap-anywhere">"{endorsement.message}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
