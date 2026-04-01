import { cookies } from 'next/headers';
import { db } from '@/db/db';
import { users, sessions, userInterests, interests } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export interface Interest {
  id: number;
  name: string;
  createdAt: Date;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  avatar: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  interests?: Interest[];
}

export async function createSession(userId: number) {
  const sessionId = crypto.randomUUID();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt: expires,
  });

  const cookieStore = await cookies();
  cookieStore.set('sessionId', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
    path: '/',
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;
  if (!sessionId) return null;

  const session = await db.query.sessions.findFirst({
    where: and(
      eq(sessions.id, sessionId),
      gt(sessions.expiresAt, new Date())
    ),
  });

  if (!session) {
    await cookieStore.delete('sessionId');
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  if (!user) {
    await cookieStore.delete('sessionId');
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    description: user.description,
    createdAt: user.createdAt || new Date(),
    updatedAt: user.updatedAt || new Date(),
    interests: [],
  };
}

export async function invalidateSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;
  if (sessionId) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }
  await cookieStore.delete('sessionId');
}

export async function registerUser(email: string, password: string, nickname: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const [user] = await db.insert(users).values({
    email,
    password: hashedPassword,
    nickname,
  }).returning();

  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    description: user.description,
    createdAt: user.createdAt || new Date(),
    updatedAt: user.updatedAt || new Date(),
    interests: [],
  };
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) return null;

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) return null;

  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    description: user.description,
    createdAt: user.createdAt || new Date(),
    updatedAt: user.updatedAt || new Date(),
    interests: [],
  };
}

export async function getUserWithInterests(userId: number): Promise<User | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) return null;

  const userInterestsList = await db.query.userInterests.findMany({
    where: eq(userInterests.userId, user.id),
    with: {
      interest: true,
    },
  });

  const userInterestsFormatted = userInterestsList.map((ui: any) => ({
    id: ui.interest.id,
    name: ui.interest.name,
    createdAt: ui.interest.createdAt,
  }));

  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    description: user.description,
    createdAt: user.createdAt || new Date(),
    updatedAt: user.updatedAt || new Date(),
    interests: userInterestsFormatted,
  };
}