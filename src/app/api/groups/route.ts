import { getCurrentUser } from '@/app/lib/session';
import { db } from '@/db/db';
import { groups, users, interests, groupInterests, groupMembers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // 移除认证检查，允许未登录用户访问
  const user = await getCurrentUser();

  try {
    const allGroups = await db.query.groups.findMany({});

    const formattedGroups = [];

    for (const group of allGroups) {
      const creator = await db.query.users.findFirst({
        where: eq(users.id, group.creatorId),
      });

      if (!creator) continue;

      formattedGroups.push({
        id: group.id,
        name: group.name,
        description: group.description,
        avatar: group.avatar,
        creator: {
          id: creator.id,
          nickname: creator.nickname,
          avatar: creator.avatar,
        },
        interests: [],
        memberCount: 0,
        createdAt: group.createdAt,
        isJoined: false,
      });
    }

    return NextResponse.json(formattedGroups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, avatar } = await request.json();

  try {
    const [group] = await db.insert(groups).values({
      name,
      description,
      avatar,
      creatorId: user.id,
    }).returning();

    await db.insert(groupMembers).values({
      groupId: group.id,
      userId: user.id,
      role: 'admin',
    });

    return NextResponse.json({
      id: group.id,
      name: group.name,
      description: group.description,
      avatar: group.avatar,
      creatorId: group.creatorId,
      createdAt: group.createdAt,
    });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}