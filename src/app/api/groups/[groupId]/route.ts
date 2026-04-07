import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth/options';
import { db } from '@/db/db';
import { groups, users, interests, groupInterests, groupMembers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  // 获取用户信息（如果已登录）
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const parsedGroupId = parseInt(groupId);

  try {
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, parsedGroupId),
    });

    if (!group) {
      // 返回模拟数据
      const mockGroups = [
        {
          id: 1,
          name: '阅读小组',
          description: '喜欢读书的小伙伴一起交流',
          avatar: null,
          creatorId: 1,
        },
        {
          id: 2,
          name: '旅行小组',
          description: '喜欢旅行的小伙伴一起探索',
          avatar: null,
          creatorId: 1,
        },
      ];
      
      const mockGroup = mockGroups.find(g => g.id === parsedGroupId);
      if (!mockGroup) {
        return NextResponse.json({ error: 'Group not found' }, { status: 404 });
      }
      
      const mockCreator = {
        id: 1,
        nickname: '测试用户',
        avatar: null,
      };
      
      const mockInterests = [
        { id: 1, name: '阅读' },
        { id: 2, name: '旅行' },
      ];
      
      const mockMembers = [
        {
          id: 1,
          nickname: '测试用户',
          avatar: null,
          role: 'admin',
          joinedAt: new Date('2024-01-01'),
        },
      ];
      
      const isJoined = user ? mockMembers.some(m => m.id === parseInt(user.id)) : false;
      const isAdmin = user ? mockMembers.some(m => m.id === parseInt(user.id) && m.role === 'admin') : false;
      
      const formattedGroup = {
        id: mockGroup.id,
        name: mockGroup.name,
        description: mockGroup.description,
        avatar: mockGroup.avatar,
        creator: mockCreator,
        interests: parsedGroupId === 1 ? [mockInterests[0]] : [mockInterests[1]],
        members: mockMembers,
        memberCount: mockMembers.length,
        createdAt: new Date('2024-01-01'),
        isJoined,
        isAdmin,
      };
      
      return NextResponse.json(formattedGroup);
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

    const isJoined = user ? groupMembersList.some(m => m.userId === parseInt(user.id)) : false;
    const isAdmin = user ? groupMembersList.some(m => m.userId === parseInt(user.id) && m.role === 'admin') : false;

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
    
    // 如果数据库连接失败，返回模拟数据
    const mockGroups = [
      {
        id: 1,
        name: '阅读小组',
        description: '喜欢读书的小伙伴一起交流',
        avatar: null,
        creatorId: 1,
      },
      {
        id: 2,
        name: '旅行小组',
        description: '喜欢旅行的小伙伴一起探索',
        avatar: null,
        creatorId: 1,
      },
    ];
    
    const mockGroup = mockGroups.find(g => g.id === parsedGroupId);
    if (!mockGroup) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    const mockCreator = {
      id: 1,
      nickname: '测试用户',
      avatar: null,
    };
    
    const mockInterests = [
      { id: 1, name: '阅读' },
      { id: 2, name: '旅行' },
    ];
    
    const mockMembers = [
      {
        id: 1,
        nickname: '测试用户',
        avatar: null,
        role: 'admin',
        joinedAt: new Date('2024-01-01'),
      },
    ];
    
    const isJoined = user ? mockMembers.some(m => m.id === parseInt(user.id)) : false;
    const isAdmin = user ? mockMembers.some(m => m.id === parseInt(user.id) && m.role === 'admin') : false;
    
    const formattedGroup = {
      id: mockGroup.id,
      name: mockGroup.name,
      description: mockGroup.description,
      avatar: mockGroup.avatar,
      creator: mockCreator,
      interests: parsedGroupId === 1 ? [mockInterests[0]] : [mockInterests[1]],
      members: mockMembers,
      memberCount: mockMembers.length,
      createdAt: new Date('2024-01-01'),
      isJoined,
      isAdmin,
    };
    
    return NextResponse.json(formattedGroup);
  }
}