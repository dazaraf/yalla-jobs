'use server'

import { db } from '@/db'
import { users, profiles, endorsements, roleEnum } from '@/db/schema'
import { eq, and, desc, ilike, or, sql, inArray } from 'drizzle-orm'
import { verifyMessage } from 'viem'
import { revalidatePath } from 'next/cache'

// Types for actions
type Role = 'SEEKER' | 'EMPLOYER'

interface AuthResult {
  success: boolean
  user?: {
    id: string
    walletAddress: string
    role: Role
  }
  error?: string
}

interface ProfileData {
  name: string
  bio?: string
  telegramHandle: string
  skillTags: string[]
  projectLinks?: { title: string; url: string }[]
}

interface ProfileResult {
  success: boolean
  profile?: {
    id: string
    name: string
  }
  error?: string
}

/**
 * Verify wallet signature and upsert user into database
 * This is the main "Log In" server action
 */
export async function authenticateWithWallet(
  walletAddress: string,
  message: string,
  signature: `0x${string}`,
  role: Role = 'SEEKER'
): Promise<AuthResult> {
  try {
    // Verify the signed message
    const isValid = await verifyMessage({
      address: walletAddress as `0x${string}`,
      message,
      signature,
    })

    if (!isValid) {
      return {
        success: false,
        error: 'Invalid signature. Please try again.',
      }
    }

    const normalizedAddress = walletAddress.toLowerCase()

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.walletAddress, normalizedAddress),
    })

    let user
    if (existingUser) {
      // Update existing user
      const [updated] = await db
        .update(users)
        .set({ updatedAt: new Date() })
        .where(eq(users.walletAddress, normalizedAddress))
        .returning()
      user = updated
    } else {
      // Create new user
      const [created] = await db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          walletAddress: normalizedAddress,
          role,
        })
        .returning()
      user = created
    }

    return {
      success: true,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        role: user.role,
      },
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      error: 'Authentication failed. Please try again.',
    }
  }
}

/**
 * Create or update a seeker profile
 */
export async function saveProfile(
  walletAddress: string,
  profileData: ProfileData
): Promise<ProfileResult> {
  try {
    const normalizedAddress = walletAddress.toLowerCase()

    // First, ensure user exists
    let user = await db.query.users.findFirst({
      where: eq(users.walletAddress, normalizedAddress),
    })

    if (!user) {
      // Create user if they don't exist
      const [newUser] = await db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          walletAddress: normalizedAddress,
          role: 'SEEKER',
        })
        .returning()
      user = newUser
    }

    // Check if profile exists
    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id),
    })

    let profile
    if (existingProfile) {
      // Update existing profile
      const [updated] = await db
        .update(profiles)
        .set({
          name: profileData.name,
          bio: profileData.bio || '',
          telegramHandle: profileData.telegramHandle,
          skillTags: profileData.skillTags,
          projectLinks: profileData.projectLinks || [],
          updatedAt: new Date(),
        })
        .where(eq(profiles.userId, user.id))
        .returning()
      profile = updated
    } else {
      // Create new profile
      const [created] = await db
        .insert(profiles)
        .values({
          id: crypto.randomUUID(),
          userId: user.id,
          name: profileData.name,
          bio: profileData.bio || '',
          telegramHandle: profileData.telegramHandle,
          skillTags: profileData.skillTags,
          projectLinks: profileData.projectLinks || [],
        })
        .returning()
      profile = created
    }

    revalidatePath('/seekers')

    return {
      success: true,
      profile: {
        id: profile.id,
        name: profile.name,
      },
    }
  } catch (error) {
    console.error('Profile save error:', error)
    return {
      success: false,
      error: 'Failed to save profile. Please try again.',
    }
  }
}

/**
 * Get all seekers with their profiles
 */
export async function getSeekers() {
  try {
    const seekers = await db.query.users.findMany({
      where: eq(users.role, 'SEEKER'),
      with: {
        profile: true,
      },
      orderBy: desc(users.createdAt),
    })

    // Filter to only include users with profiles
    return seekers.filter((seeker) => seeker.profile !== null)
  } catch (error) {
    console.error('Error fetching seekers:', error)
    return []
  }
}

/**
 * Reveal telegram handle (for employers)
 * In a real app, this might require payment or verification
 */
export async function revealTelegramHandle(
  seekerUserId: string,
  employerWalletAddress: string
): Promise<{ success: boolean; handle?: string; error?: string }> {
  try {
    // Verify employer is authenticated
    const employer = await db.query.users.findFirst({
      where: eq(users.walletAddress, employerWalletAddress.toLowerCase()),
    })

    if (!employer || employer.role !== 'EMPLOYER') {
      return {
        success: false,
        error: 'Only employers can reveal contact information.',
      }
    }

    // Get seeker's profile
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, seekerUserId),
    })

    if (!profile) {
      return {
        success: false,
        error: 'Profile not found.',
      }
    }

    // In a real app, you might log this reveal, charge sats, etc.
    return {
      success: true,
      handle: profile.telegramHandle,
    }
  } catch (error) {
    console.error('Error revealing handle:', error)
    return {
      success: false,
      error: 'Failed to reveal contact information.',
    }
  }
}

/**
 * Get user profile by wallet address
 */
export async function getUserProfile(walletAddress: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.walletAddress, walletAddress.toLowerCase()),
      with: {
        profile: true,
      },
    })

    return user
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

/**
 * Endorse a seeker profile
 */
export async function endorseProfile(
  endorserWallet: string,
  profileId: string,
  message: string,
  relationshipTag: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const normalizedWallet = endorserWallet.toLowerCase()

    // Check if endorser has a profile
    const endorserUser = await db.query.users.findFirst({
      where: eq(users.walletAddress, normalizedWallet),
      with: { profile: true },
    })

    if (!endorserUser?.profile) {
      return { success: false, error: 'You must create a profile before endorsing others.' }
    }

    // Validate and sanitize message
    if (message == null || typeof message !== 'string') {
      return { success: false, error: 'Endorsement message is required.' }
    }

    const trimmedMessage = message.trim()
    if (trimmedMessage.length < 100) {
      return { success: false, error: 'Endorsement must be at least 100 characters.' }
    }

    // Check if relationshipTag is provided
    if (!relationshipTag || typeof relationshipTag !== 'string' || !relationshipTag.trim()) {
      return { success: false, error: 'Please select how you know this person.' }
    }

    // Check if profile exists
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, profileId),
      with: { user: true },
    })

    if (!profile) {
      return { success: false, error: 'Profile not found.' }
    }

    // Prevent self-endorsement
    if (profile.user.walletAddress.toLowerCase() === normalizedWallet) {
      return { success: false, error: 'You cannot endorse yourself.' }
    }

    // Check if already endorsed
    const existingEndorsement = await db.query.endorsements.findFirst({
      where: and(
        eq(endorsements.endorserWallet, normalizedWallet),
        eq(endorsements.profileId, profileId)
      ),
    })

    if (existingEndorsement) {
      return { success: false, error: 'You have already endorsed this person.' }
    }

    // Create endorsement and update count in a transaction
// Create endorsement
await db.insert(endorsements).values({
  id: crypto.randomUUID(),
  endorserWallet: endorserWallet.toLowerCase(),
  profileId,
  message,
  relationshipTag,
})

// Increment count
await db
  .update(profiles)
  .set({ endorsementCount: sql`${profiles.endorsementCount} + 1` })
  .where(eq(profiles.id, profileId))
    revalidatePath('/seekers')

    return { success: true }
  } catch (error) {
    console.error('Error endorsing profile:', error)
    return { success: false, error: 'Failed to endorse. Please try again.' }
  }
}

/**
 * Remove an endorsement
 */
export async function removeEndorsement(
  endorserWallet: string,
  profileId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const normalizedWallet = endorserWallet.toLowerCase()

    const endorsement = await db.query.endorsements.findFirst({
      where: and(
        eq(endorsements.endorserWallet, normalizedWallet),
        eq(endorsements.profileId, profileId)
      ),
    })

    if (!endorsement) {
      return { success: false, error: 'Endorsement not found.' }
    }

    await db.transaction(async (tx) => {
      await tx.delete(endorsements).where(eq(endorsements.id, endorsement.id))

      await tx
        .update(profiles)
        .set({ endorsementCount: sql`${profiles.endorsementCount} - 1` })
        .where(eq(profiles.id, profileId))
    })

    revalidatePath('/seekers')

    return { success: true }
  } catch (error) {
    console.error('Error removing endorsement:', error)
    return { success: false, error: 'Failed to remove endorsement.' }
  }
}

/**
 * Check if user has endorsed a profile
 */
export async function hasEndorsed(
  endorserWallet: string,
  profileId: string
): Promise<boolean> {
  try {
    const endorsement = await db.query.endorsements.findFirst({
      where: and(
        eq(endorsements.endorserWallet, endorserWallet.toLowerCase()),
        eq(endorsements.profileId, profileId)
      ),
    })
    return !!endorsement
  } catch (error) {
    return false
  }
}

/**
 * Get endorsements for a profile with endorser info
 */
export async function getProfileEndorsements(profileId: string) {
  try {
    const endorsementList = await db.query.endorsements.findMany({
      where: eq(endorsements.profileId, profileId),
      orderBy: desc(endorsements.createdAt),
    })

    // Fetch endorser profiles for each endorsement
    const enrichedEndorsements = await Promise.all(
      endorsementList.map(async (endorsement) => {
        const endorserUser = await db.query.users.findFirst({
          where: eq(users.walletAddress, endorsement.endorserWallet),
          with: { profile: true },
        })

        return {
          ...endorsement,
          endorserName: endorserUser?.profile?.name || 'Anonymous',
          endorserTelegram: endorserUser?.profile?.telegramHandle || null,
        }
      })
    )

    return enrichedEndorsements
  } catch (error) {
    console.error('Error fetching endorsements:', error)
    return []
  }
}

/**
 * Search seekers with filters
 */
export async function searchSeekers(params: {
  query?: string
  skills?: string[]
  sortBy?: 'endorsements' | 'recent'
}) {
  try {
    const { query, skills, sortBy = 'recent' } = params

    // Get all seekers with profiles
    let seekers = await db.query.users.findMany({
      where: eq(users.role, 'SEEKER'),
      with: {
        profile: true,
      },
      orderBy: sortBy === 'recent' ? desc(users.createdAt) : undefined,
    })

    // Filter to only include users with profiles
    seekers = seekers.filter((seeker) => seeker.profile !== null)

    // Apply text search filter
    if (query && query.trim()) {
      const searchTerm = query.trim().toLowerCase()
      seekers = seekers.filter((seeker) => {
        const name = seeker.profile?.name?.toLowerCase() || ''
        const bio = seeker.profile?.bio?.toLowerCase() || ''
        return name.includes(searchTerm) || bio.includes(searchTerm)
      })
    }

    // Apply skills filter
    if (skills && skills.length > 0) {
      seekers = seekers.filter((seeker) => {
        const userSkills = seeker.profile?.skillTags || []
        return skills.some((skill) => userSkills.includes(skill))
      })
    }

    // Sort by endorsements if requested
    if (sortBy === 'endorsements') {
      seekers.sort((a, b) => {
        const aCount = a.profile?.endorsementCount || 0
        const bCount = b.profile?.endorsementCount || 0
        return bCount - aCount
      })
    }

    return seekers
  } catch (error) {
    console.error('Error searching seekers:', error)
    return []
  }
}
