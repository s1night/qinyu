import { getCurrentUser } from '@/app/lib/session';
import { db } from '@/db/db';
import { users, interests, userInterests } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { description, interests: interestNames } = await request.json();

  try {
    await db.update(users).set({
      description,
    }).where(eq(users.id, user.id));

    if (interestNames && Array.isArray(interestNames)) {
      await db.delete(userInterests).where(eq(userInterests.userId, user.id));

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
          userId: user.id,
          interestId: interest.id,
        });
      }
    }

    const updatedUser = await getCurrentUser();
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}