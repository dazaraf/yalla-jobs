'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AccessCodeModal } from './access-code-modal'

interface CreateProfileButtonProps {
  className?: string
  children?: React.ReactNode
}

export function CreateProfileButton({ className, children }: CreateProfileButtonProps) {
  const [showAccessModal, setShowAccessModal] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    if (typeof window !== 'undefined' && localStorage.getItem('yalla-access') === 'true') {
      router.push('/onboarding/seeker')
    } else {
      setShowAccessModal(true)
    }
  }

  const handleSuccess = () => {
    setShowAccessModal(false)
    router.push('/onboarding/seeker')
  }

  return (
    <>
      <button onClick={handleClick} className={className}>
        {children || 'Create profile'}
      </button>
      <AccessCodeModal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
        onSuccess={handleSuccess}
      />
    </>
  )
}
