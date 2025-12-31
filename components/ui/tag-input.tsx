'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  suggestions?: string[]
  maxTags?: number
  className?: string
}

const commonSkills = [
  'Solidity',
  'Rust',
  'TypeScript',
  'React',
  'Node.js',
  'Bitcoin',
  'Lightning Network',
  'DeFi',
  'Smart Contracts',
  'Web3',
  'Python',
  'Go',
  'DevOps',
  'UI/UX',
  'Product Management',
  'Community',
  'Marketing',
  'Content Writing',
]

export function TagInput({
  value,
  onChange,
  placeholder = 'Type a skill and press Enter...',
  suggestions = commonSkills,
  maxTags = 10,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState('')
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter(
    (skill) =>
      skill.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(skill)
  )

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (
      trimmedTag &&
      !value.includes(trimmedTag) &&
      value.length < maxTags
    ) {
      onChange([...value, trimmedTag])
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue) {
        addTag(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Tags display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <Badge
              key={tag}
              variant="skill"
              className="gap-1 pr-1 animate-fade-in"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full p-0.5 hover:bg-orange-500/30 transition-colors"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input with suggestions */}
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={
            value.length >= maxTags
              ? `Maximum ${maxTags} skills`
              : placeholder
          }
          disabled={value.length >= maxTags}
        />

        {/* Suggestions dropdown */}
        {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-800 py-2 shadow-xl">
            {filteredSuggestions.slice(0, 5).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-700 hover:text-orange-400 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick add suggestions */}
      {value.length < maxTags && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-zinc-500 mr-1">Quick add:</span>
          {suggestions
            .filter((s) => !value.includes(s))
            .slice(0, 5)
            .map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addTag(skill)}
                className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-orange-400 transition-colors"
              >
                + {skill}
              </button>
            ))}
        </div>
      )}

      <p className="text-xs text-zinc-500">
        {value.length}/{maxTags} skills added
      </p>
    </div>
  )
}
