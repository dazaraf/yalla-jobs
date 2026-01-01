import { pgTable, text, timestamp, pgEnum, integer, jsonb, uniqueIndex, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const roleEnum = pgEnum('role', ['SEEKER', 'EMPLOYER'])

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  walletAddress: text('wallet_address').notNull().unique(),
  role: roleEnum('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  name: text('name').notNull(),
  bio: text('bio'),
  telegramHandle: text('telegram_handle').notNull(),
  skillTags: text('skill_tags').array(),
  projectLinks: jsonb('project_links'),
  endorsementCount: integer('endorsement_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const endorsements = pgTable('endorsements', {
  id: text('id').primaryKey(),
  endorserWallet: text('endorser_wallet').notNull(),
  profileId: text('profile_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  relationshipTag: text('relationship_tag').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
}))

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  endorsements: many(endorsements),
}))

export const endorsementsRelations = relations(endorsements, ({ one }) => ({
  profile: one(profiles, {
    fields: [endorsements.profileId],
    references: [profiles.id],
  }),
}))
