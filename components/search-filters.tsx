'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const popularSkills = [
  'Bitcoin', 'Lightning', 'Solidity', 'Rust', 'TypeScript', 'React', 'DeFi', 'Smart Contracts'
]

interface SearchFiltersProps {
  initialQuery: string
  initialSkills: string[]
  initialSort: 'endorsements' | 'recent'
}

export function SearchFilters({ initialQuery, initialSkills, initialSort }: SearchFiltersProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills)
  const [sortBy, setSortBy] = useState<'endorsements' | 'recent'>(initialSort)

  const updateUrl = useCallback((newQuery: string, newSkills: string[], newSort: string) => {
    const params = new URLSearchParams()
    if (newQuery) params.set('q', newQuery)
    if (newSkills.length > 0) params.set('skills', newSkills.join(','))
    if (newSort !== 'recent') params.set('sort', newSort)
    router.push(params.toString() ? `/seekers?${params.toString()}` : '/seekers')
  }, [router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl(query, selectedSkills, sortBy)
  }

  const toggleSkill = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill]
    setSelectedSkills(newSkills)
    updateUrl(query, newSkills, sortBy)
  }

  const handleSortChange = (newSort: 'endorsements' | 'recent') => {
    setSortBy(newSort)
    updateUrl(query, selectedSkills, newSort)
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or skills..."
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <button 
          type="submit"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white font-medium rounded-lg transition-colors"
        >
          Search
        </button>
      </form>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {popularSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedSkills.includes(skill)
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white border border-transparent'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-zinc-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as 'endorsements' | 'recent')}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="endorsements">Most Endorsed</option>
          </select>
        </div>
      </div>

      {/* Active filters */}
      {(query || selectedSkills.length > 0) && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500">Active:</span>
          {query && (
            <span className="px-2 py-1 rounded bg-zinc-800 text-sm text-zinc-300 flex items-center gap-1">
              "{query}"
              <button onClick={() => { setQuery(''); updateUrl('', selectedSkills, sortBy); }} className="hover:text-white">×</button>
            </span>
          )}
          {selectedSkills.map(skill => (
            <span key={skill} className="px-2 py-1 rounded bg-orange-500/20 text-sm text-orange-300 flex items-center gap-1">
              {skill}
              <button onClick={() => toggleSkill(skill)} className="hover:text-white">×</button>
            </span>
          ))}
          <button
            onClick={() => { setQuery(''); setSelectedSkills([]); setSortBy('recent'); router.push('/seekers'); }}
            className="text-sm text-orange-400 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
