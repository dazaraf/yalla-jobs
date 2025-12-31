'use server'

import { prisma } from '@/lib/prisma'
import { verifyMessage } from 'viem'
import { Role } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// Types for actions
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
  role: Role = Role.SEEKER
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

    // Upsert user into database
    const user = await prisma.user.upsert({
      where: { walletAddress: walletAddress.toLowerCase() },
      update: {
        updatedAt: new Date(),
      },
      create: {
        walletAddress: walletAddress.toLowerCase(),
        role,
      },
    })

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
    // First, ensure user exists
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    })

    if (!user) {
      // Create user if they don't exist
      const newUser = await prisma.user.create({
        data: {
          walletAddress: walletAddress.toLowerCase(),
          role: Role.SEEKER,
        },
      })

      // Create profile
      const profile = await prisma.profile.create({
        data: {
          userId: newUser.id,
          name: profileData.name,
          bio: profileData.bio || '',
          telegramHandle: profileData.telegramHandle,
          skillTags: profileData.skillTags,
          projectLinks: profileData.projectLinks || [],
        },
      })

      revalidatePath('/seekers')
      
      return {
        success: true,
        profile: {
          id: profile.id,
          name: profile.name,
        },
      }
    }

    // Upsert profile for existing user
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        name: profileData.name,
        bio: profileData.bio || '',
        telegramHandle: profileData.telegramHandle,
        skillTags: profileData.skillTags,
        projectLinks: profileData.projectLinks || [],
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        name: profileData.name,
        bio: profileData.bio || '',
        telegramHandle: profileData.telegramHandle,
        skillTags: profileData.skillTags,
        projectLinks: profileData.projectLinks || [],
      },
    })

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
    const seekers = await prisma.user.findMany({
      where: {
        role: Role.SEEKER,
        profile: {
          isNot: null,
        },
      },
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return seekers
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
    const employer = await prisma.user.findUnique({
      where: { walletAddress: employerWalletAddress.toLowerCase() },
    })

    if (!employer || employer.role !== Role.EMPLOYER) {
      return {
        success: false,
        error: 'Only employers can reveal contact information.',
      }
    }

    // Get seeker's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: seekerUserId },
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
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      include: {
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
    // Check if endorser has a profile
    const endorserUser = await prisma.user.findUnique({
      where: { walletAddress: endorserWallet.toLowerCase() },
      include: { profile: true }
    })
    
    if (!endorserUser?.profile) {
      return { success: false, error: 'You must create a profile before endorsing others.' }
    }

    // Check if message meets minimum length
    if (!message || message.length < 100) {
      return { success: false, error: 'Endorsement must be at least 100 characters.' }
    }

    // Check if relationshipTag is provided
    if (!relationshipTag) {
      return { success: false, error: 'Please select how you know this person.' }
    }

    // Check if profile exists
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: { user: true }
    })

    if (!profile) {
      return { success: false, error: 'Profile not found.' }
    }

    // Prevent self-endorsement
    if (profile.user.walletAddress.toLowerCase() === endorserWallet.toLowerCase()) {
      return { success: false, error: 'You cannot endorse yourself.' }
    }

    // Check if already endorsed
    const existingEndorsement = await prisma.endorsement.findUnique({
      where: {
        endorserWallet_profileId: {
          endorserWallet: endorserWallet.toLowerCase(),
          profileId: profileId,
        }
      }
    })

    if (existingEndorsement) {
      return { success: false, error: 'You have already endorsed this person.' }
    }

    // Create endorsement and update count in a transaction
    await prisma.$transaction([
      prisma.endorsement.create({
        data: {
          endorserWallet: endorserWallet.toLowerCase(),
          profileId: profileId,
          message: message,
          relationshipTag: relationshipTag,
        }
      }),
      prisma.profile.update({
        where: { id: profileId },
        data: { endorsementCount: { increment: 1 } }
      })
    ])

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
    const endorsement = await prisma.endorsement.findUnique({
      where: {
        endorserWallet_profileId: {
          endorserWallet: endorserWallet.toLowerCase(),
          profileId: profileId,
        }
      }
    })

    if (!endorsement) {
      return { success: false, error: 'Endorsement not found.' }
    }

    await prisma.$transaction([
      prisma.endorsement.delete({
        where: { id: endorsement.id }
      }),
      prisma.profile.update({
        where: { id: profileId },
        data: { endorsementCount: { decrement: 1 } }
      })
    ])

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
    const endorsement = await prisma.endorsement.findUnique({
      where: {
        endorserWallet_profileId: {
          endorserWallet: endorserWallet.toLowerCase(),
          profileId: profileId,
        }
      }
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
    const endorsements = await prisma.endorsement.findMany({
      where: { profileId },
      orderBy: { createdAt: 'desc' },
    })

    // Fetch endorser profiles for each endorsement
    const enrichedEndorsements = await Promise.all(
      endorsements.map(async (endorsement) => {
        const endorserUser = await prisma.user.findUnique({
          where: { walletAddress: endorsement.endorserWallet },
          include: { profile: true }
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

    let whereClause: any = {
      role: Role.SEEKER,
      profile: {
        isNot: null,
      },
    }

    // Build profile filter conditions
    const profileFilters: any[] = []

    if (query && query.trim()) {
      const searchTerm = query.trim().toLowerCase()
      profileFilters.push({
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { bio: { contains: searchTerm, mode: 'insensitive' } },
        ]
      })
    }

    if (skills && skills.length > 0) {
      profileFilters.push({
        skillTags: { hasSome: skills }
      })
    }

    if (profileFilters.length > 0) {
      whereClause = {
        ...whereClause,
        profile: {
          AND: profileFilters
        }
      }
    }

    const seekers = await prisma.user.findMany({
      where: whereClause,
      include: {
        profile: true,
      },
      orderBy: sortBy === 'endorsements' 
        ? { profile: { endorsementCount: 'desc' } }
        : { createdAt: 'desc' },
    })

    return seekers
  } catch (error) {
    console.error('Error searching seekers:', error)
    return []
  }
}
