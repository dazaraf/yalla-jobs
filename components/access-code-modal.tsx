'use client'

import { useState } from 'react'

const VALID_CODES = ['YALLA2024', 'BITCOIN', 'TLV', 'YALLABITCOIN']

interface AccessCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AccessCodeModal({ isOpen, onClose, onSuccess }: AccessCodeModalProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (VALID_CODES.includes(code.toUpperCase().trim())) {
      localStorage.setItem('yalla-access', 'true')
      onSuccess()
    } else {
      setError('Invalid access code')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
        <h2 className="text-2xl font-semibold text-white mb-2">Early Access</h2>
        <p className="text-zinc-400 mb-6">Enter your access code to create a profile</p>

        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError('') }}
          placeholder="Enter code"
          className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 mb-4"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-white font-medium rounded-lg transition-colors mb-4"
        >
          Continue
        </button>

        <p className="text-center text-zinc-500 text-sm">
          Don't have a code?{' '}
          <a
            href="https://t.me/yallabitcoin"
            target="_blank"
            className="text-orange-400 hover:underline"
          >
            Request access
          </a>
        </p>
      </div>
    </div>
  )
}
