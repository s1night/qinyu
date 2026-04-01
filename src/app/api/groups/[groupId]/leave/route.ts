import { getCurrentUser } from '@/app/lib/session';
import { db } from '@/db/db';
import { groups, groupMembers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const user = await getCurrentUser();
  
  if (!user) {
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

    if (group.creatorId === user.id) {
      return NextResponse.json({ error: 'Creator cannot leave the group' }, { status: 400 });
    }

    const existingMember = await db.query.groupMembers.findFirst({
      where: and(
        eq(groupMembers.groupId, parsedGroupId),
        eq(groupMembers.userId, user.id)
      ),
    });

    if (!existingMember) {
      return NextResponse.json({ error: 'Not a member of this group' }, { status: 400 });
    }

    await db.delete(groupMembers).where(and(
      eq(groupMembers.groupId, parsedGroupId),
      eq(groupMembers.userId, user.id)
    ));

    return NextResponse.json({ message: 'Successfully left the group' });
  } catch (error) {
    console.error('Error leaving group:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}