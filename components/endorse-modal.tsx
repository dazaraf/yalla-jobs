'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { endorseProfile } from '@/actions/auth'

const relationshipTags = [
  'I worked with this person',
  'I hired this person',
  'This person hired me',
  'I know this person professionally',
  "I've seen their work",
]

interface EndorseModalProps {
  isOpen: boolean
  onClose: () => void
  profileId: string
  seekerName: string
  endorserName?: string
  endorserWallet?: string
  onSuccess: () => void
}

export function EndorseModal({
  isOpen,
  onClose,
  profileId,
  seekerName,
  endorserName,
  onSuccess,
}: EndorseModalProps) {
  const { address, isConnected } = useAccount()
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const charCount = message.length
  const minChars = 100
  const isValid = selectedTag && charCount >= minChars

  const handleSubmit = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const result = await endorseProfile(address, profileId, message, selectedTag)
      
      if (result.success) {
        onSuccess()
        onClose()
        setMessage('')
        setSelectedTag('')
      } else {
        setError(result.error || 'Failed to submit endorsement')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md max-h-[85vh] bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">Endorse {seekerName}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-zinc-800 transition-colors">
            <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Relationship */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              How do you know them?
            </label>
            <div className="space-y-2">
              {relationshipTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`w-full px-4 py-2.5 rounded-lg text-left text-sm transition-colors flex items-center gap-3 ${
                    selectedTag === tag
                      ? 'bg-orange-500/20 border border-orange-500/50 text-white'
                      : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedTag === tag ? 'border-orange-500 bg-orange-500' : 'border-zinc-500'
                  }`}>
                    {selectedTag === tag && (
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Your endorsement
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write about your experience working with this person..."
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 resize-none h-24"
            />
            <div className="flex justify-between mt-1.5">
              <span className={`text-xs ${charCount >= minChars ? 'text-green-400' : 'text-zinc-500'}`}>
                {charCount >= minChars ? '✓ Minimum reached' : `${minChars - charCount} more needed`}
              </span>
              <span className="text-xs text-zinc-500">{charCount}/{minChars}</span>
            </div>
          </div>

          {/* Endorser info */}
          <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <p className="text-xs text-zinc-500">Endorsing as</p>
            <p className="text-sm text-white">
              {endorserName || 'Anonymous'}
              <span className="text-zinc-500 ml-2 font-mono text-xs">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
              </span>
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-800 bg-zinc-900">
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              isValid && !isSubmitting
                ? 'bg-orange-500 hover:bg-orange-400 text-white'
                : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Endorsement'}
          </button>
        </div>
      </div>
    </div>
  )
}
