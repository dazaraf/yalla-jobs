'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { getEthosProfile } from '@/lib/ethos'

interface EthosData {
  score: number | null
  vouchers: { address: string; name: string }[]
}

export function EthosBadge() {
  const { address, isConnected } = useAccount()
  const [ethos, setEthos] = useState<EthosData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      setLoading(true)
      getEthosProfile(address)
        .then(setEthos)
        .finally(() => setLoading(false))
    }
  }, [isConnected, address])

  if (!isConnected || loading) return null
  if (!ethos?.score) return null

  return (
    <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🛡️</span>
        <span className="text-white font-semibold">Ethos Score</span>
        <span className="ml-auto text-2xl font-bold text-orange-400">{ethos.score}</span>
      </div>

      {ethos.vouchers.length > 0 && (
        <div className="text-sm text-zinc-400">
          <span>Vouched by: </span>
          {ethos.vouchers.map((v, i) => (
            <span key={v.address}>
              <span className="text-orange-300">{v.name}</span>
              {i < ethos.vouchers.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}

      <a
        href={`https://ethos.network/profile/${address}`}
        target="_blank"
        className="text-xs text-zinc-500 hover:text-orange-400 mt-2 block"
      >
        View on Ethos →
      </a>
    </div>
  )
}
