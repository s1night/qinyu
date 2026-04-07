import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth/options';
import { db } from '@/db/db';
import { groups, users, interests, groupInterests, groupMembers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // 获取用户信息（如果已登录）
  const session = await getServerSession(authOptions);
  const user = session?.user;

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
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, avatar } = await request.json();

  try {
    const [group] = await db.insert(groups).values({
      name,
      description,
      avatar,
      creatorId: parseInt(session.user.id),
    }).returning();

    await db.insert(groupMembers).values({
      groupId: group.id,
      userId: parseInt(session.user.id),
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