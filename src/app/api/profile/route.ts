import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth/options';
import { db } from '@/db/db';
import { users, interests, userInterests } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, parseInt(session.user.id)),
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    description: user.description,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    interests: [],
  });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const { description, interests: interestNames } = await request.json();

  try {
    await db.update(users).set({
      description,
    }).where(eq(users.id, userId));

    if (interestNames && Array.isArray(interestNames)) {
      await db.delete(userInterests).where(eq(userInterests.userId, userId));

      for (const interestName of interestNames) {
        let interest = await db.query.interests.findFirst({
          where: eq(interests.name, interestName),
        });

        if (!interest) {
          const [newInterest] = await db.insert(interests).values({
            name: interestName,
          }).returning();
          interest = newInterest;
        }

        await db.insert(userInterests).values({
          userId: userId,
          interestId: interest.id,
        });
      }
    }

    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      nickname: updatedUser.nickname,
      avatar: updatedUser.avatar,
      description: updatedUser.description,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      interests: [],
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}