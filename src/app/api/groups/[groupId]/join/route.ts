import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth/options';
import { db } from '@/db/db';
import { groups, groupMembers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsedGroupId = parseInt(groupId);

  try {
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, parsedGroupId),
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    const existingMember = await db.query.groupMembers.findFirst({
      where: and(
        eq(groupMembers.groupId, parsedGroupId),
        eq(groupMembers.userId, parseInt(session.user.id))
      ),
    });

    if (existingMember) {
      return NextResponse.json({ error: 'Already a member of this group' }, { status: 400 });
    }

    await db.insert(groupMembers).values({
      groupId: parsedGroupId,
      userId: parseInt(session.user.id),
      role: 'member',
    });

    return NextResponse.json({ message: 'Successfully joined the group' });
  } catch (error) {
    console.error('Error joining group:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}