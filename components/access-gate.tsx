'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AccessCodeModal } from './access-code-modal'

interface AccessGateProps {
  children: React.ReactNode
}

export function AccessGate({ children }: AccessGateProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const access = localStorage.getItem('yalla-access') === 'true'
    setHasAccess(access)
    if (!access) {
      setShowModal(true)
    }
  }, [])

  const handleSuccess = () => {
    setHasAccess(true)
    setShowModal(false)
  }

  const handleClose = () => {
    router.push('/')
  }

  // Show nothing while checking access
  if (hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    )
  }

  // If no access, show modal
  if (!hasAccess) {
    return (
      <AccessCodeModal
        isOpen={showModal}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    )
  }

  // Has access, show children
  return <>{children}</>
}
