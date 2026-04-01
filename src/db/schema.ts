import { pgTable, serial, text, integer, timestamp, boolean, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  nickname: text('nickname').notNull(),
  avatar: text('avatar'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const interests = pgTable('interests', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  avatar: text('avatar'),
  creatorId: integer('creator_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const userInterests = pgTable('user_interests', {
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  interestId: integer('interest_id').references(() => interests.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  pk: primaryKey(table.userId, table.interestId),
}));

export const groupMembers = pgTable('group_members', {
  groupId: integer('group_id').references(() => groups.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').default('member'),
  joinedAt: timestamp('joined_at').defaultNow(),
}, (table) => ({
  pk: primaryKey(table.groupId, table.userId),
}));

export const groupInterests = pgTable('group_interests', {
  groupId: integer('group_id').references(() => groups.id, { onDelete: 'cascade' }).notNull(),
  interestId: integer('interest_id').references(() => interests.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  pk: primaryKey(table.groupId, table.interestId),
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id').references(() => groups.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  isAnonymous: boolean('is_anonymous').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  isAnonymous: boolean('is_anonymous').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  latitude: text('latitude').notNull(),
  longitude: text('longitude').notNull(),
  maxParticipants: integer('max_participants').default(3).notNull(),
  status: text('status').default('open').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const activityParticipants = pgTable('activity_participants', {
  activityId: integer('activity_id').references(() => activities.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  pk: primaryKey(table.activityId, table.userId),
}));