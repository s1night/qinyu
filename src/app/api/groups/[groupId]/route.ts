import { getCurrentUser } from '@/app/lib/session';
import { db } from '@/db/db';
import { groups, users, interests, groupInterests, groupMembers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
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

    const creator = await db.query.users.findFirst({
      where: eq(users.id, group.creatorId),
    });

    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    const groupInterestsList = await db.query.groupInterests.findMany({
      where: eq(groupInterests.groupId, parsedGroupId),
      with: {
        interest: true,
      },
    });

    const groupMembersList = await db.query.groupMembers.findMany({
      where: eq(groupMembers.groupId, parsedGroupId),
      with: {
        user: true,
      },
    });

    const isJoined = groupMembersList.some(m => m.userId === user.id);
    const isAdmin = groupMembersList.some(m => m.userId === user.id && m.role === 'admin');

    const formattedGroup = {
      id: group.id,
      name: group.name,
      description: group.description,
      avatar: group.avatar,
      creator: {
        id: creator.id,
        nickname: creator.nickname,
        avatar: creator.avatar,
      },
      interests: groupInterestsList.map((gi: any) => ({
        id: gi.interest.id,
        name: gi.interest.name,
      })),
      members: groupMembersList.map((m: any) => ({
        id: m.user.id,
        nickname: m.user.nickname,
        avatar: m.user.avatar,
        role: m.role,
        joinedAt: m.joinedAt,
      })),
      memberCount: groupMembersList.length,
      createdAt: group.createdAt,
      isJoined,
      isAdmin,
    };

    return NextResponse.json(formattedGroup);
  } catch (error) {
    console.error('Error fetching group:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}