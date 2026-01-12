import { searchSeekers } from '@/actions/auth'
import { SeekerCard } from '@/components/seeker-card'
import { SearchFilters } from '@/components/search-filters'
import { getEthosProfile } from '@/lib/ethos'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Talent | Yalla Jobs',
  description: 'Discover talented builders in the crypto community.',
}

// Mock data for demonstration
const mockSeekers = [
  {
    id: '1',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8c8D5',
    profile: {
      id: 'profile-1',
      name: 'Satoshi Builder',
      bio: 'Full-stack developer with 5 years of experience in Bitcoin and Lightning Network development. Passionate about building decentralized applications.',
      skillTags: ['Bitcoin', 'Lightning Network', 'Rust', 'TypeScript', 'React'],
      telegramHandle: '@satoshi_builder',
      endorsementCount: 12,
    },
  },
  {
    id: '2',
    walletAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    profile: {
      id: 'profile-2',
      name: 'Lightning Luna',
      bio: 'Protocol engineer specializing in Layer 2 scaling solutions. Previously worked at major crypto companies.',
      skillTags: ['Rust', 'Go', 'Lightning Network', 'Protocol Design', 'DevOps'],
      telegramHandle: '@lightning_luna',
      endorsementCount: 8,
    },
  },
  {
    id: '3',
    walletAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    profile: {
      id: 'profile-3',
      name: 'Node Runner',
      bio: 'DevOps specialist running Bitcoin and Lightning nodes. Expert in infrastructure, security, and high-availability systems.',
      skillTags: ['DevOps', 'Bitcoin', 'Docker', 'Kubernetes', 'Security'],
      telegramHandle: '@node_runner',
      endorsementCount: 15,
    },
  },
  {
    id: '4',
    walletAddress: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
    profile: {
      id: 'profile-4',
      name: 'Web3 Designer',
      bio: 'UI/UX designer with a focus on crypto and Web3 applications. Creating intuitive experiences for complex systems.',
      skillTags: ['UI/UX', 'Figma', 'React', 'Tailwind CSS', 'Design Systems'],
      telegramHandle: '@web3_designer',
      endorsementCount: 6,
    },
  },
  {
    id: '5',
    walletAddress: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
    profile: {
      id: 'profile-5',
      name: 'Smart Contract Dev',
      bio: 'Solidity expert with experience in DeFi protocols and smart contract auditing. Building secure financial primitives.',
      skillTags: ['Solidity', 'DeFi', 'Smart Contracts', 'Auditing', 'Python'],
      telegramHandle: '@smart_contract_dev',
      endorsementCount: 21,
    },
  },
  {
    id: '6',
    walletAddress: '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
    profile: {
      id: 'profile-6',
      name: 'Community Manager',
      bio: 'Experienced community builder with a track record of growing engaged crypto communities.',
      skillTags: ['Community', 'Marketing', 'Content Writing', 'Social Media', 'Discord'],
      telegramHandle: '@community_mgr',
      endorsementCount: 9,
    },
  },
]

interface SeekersPageProps {
  searchParams: { q?: string; skills?: string; sort?: string }
}

export default async function SeekersPage({ searchParams }: SeekersPageProps) {
  const query = searchParams.q || ''
  const skills = searchParams.skills ? searchParams.skills.split(',') : []
  const sortBy = (searchParams.sort as 'endorsements' | 'recent') || 'recent'

  const dbSeekers = await searchSeekers({ query, skills, sortBy })

  const baseSeekers = dbSeekers.length > 0
    ? dbSeekers.map(s => ({
        id: s.id,
        walletAddress: s.walletAddress,
        profile: s.profile,
      }))
    : mockSeekers

  const seekers = await Promise.all(
    baseSeekers.map(async (seeker) => {
      const ethos = await getEthosProfile(seeker.walletAddress)
      return {
        ...seeker,
        ethosScore: ethos.score,
        ethosVouchers: ethos.vouchers
      }
    })
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-white mb-2">Browse Talent</h1>
          <p className="text-zinc-400">
            {seekers.length} crypto-native builders ready to work
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchFilters initialQuery={query} initialSkills={skills} initialSort={sortBy} />
        </div>

        {/* Seekers Grid */}
        {seekers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {seekers.map((seeker) => (
              <SeekerCard
                key={seeker.id}
                id={seeker.id}
                profileId={seeker.profile?.id || ''}
                name={seeker.profile?.name || 'Anonymous'}
                bio={seeker.profile?.bio || null}
                skillTags={seeker.profile?.skillTags || []}
                endorsements={seeker.profile?.endorsementCount || 0}
                walletAddress={seeker.walletAddress}
                telegramHandle={seeker.profile?.telegramHandle}
                ethosScore={seeker.ethosScore}
                ethosVouchers={seeker.ethosVouchers}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No talent found</h3>
            <p className="text-zinc-400 mb-6">
              {query || skills.length > 0 
                ? 'Try adjusting your search or filters.'
                : 'Be the first to create a profile.'}
            </p>
            <Link href="/onboarding/seeker">
              <button className="btn-primary">Create Your Profile</button>
            </Link>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Want to be listed?
          </h3>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Create your profile and let companies discover you.
          </p>
          <Link href="/onboarding/seeker">
            <button className="btn-primary">Create Profile</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
