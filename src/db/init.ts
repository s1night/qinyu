import { db } from './db';
import { users, groups, groupMembers, interests, groupInterests } from './schema';
import { eq } from 'drizzle-orm';

export async function initDatabase() {
  try {
    // 测试数据库连接
    await db.query.users.findFirst({
      limit: 1,
    });
    console.log('Database connection successful');
    
    // 检查是否需要创建测试数据
    const userCount = await db.query.users.count();
    if (userCount === 0) {
      console.log('Creating test data...');
      
      // 创建测试用户
      const [testUser] = await db.insert(users).values({
        email: 'test@example.com',
        password: '$2a$10$rOzJqJZ4e6Q8qZ8qZ8qZ8uZ8uZ8uZ8uZ8uZ8uZ8uZ8uZ8uZ8u',
        nickname: '测试用户',
      }).returning();
      
      // 创建兴趣标签
      const [reading, travel, food] = await db.insert(interests).values([
        { name: '阅读' },
        { name: '旅行' },
        { name: '美食' },
      ]).returning();
      
      // 创建测试小组
      const [group1, group2] = await db.insert(groups).values([
        {
          name: '阅读小组',
          description: '喜欢读书的小伙伴一起交流',
          creatorId: testUser.id,
        },
        {
          name: '旅行小组',
          description: '喜欢旅行的小伙伴一起探索',
          creatorId: testUser.id,
        },
      ]).returning();
      
      // 添加小组成员
      await db.insert(groupMembers).values([
        { groupId: group1.id, userId: testUser.id, role: 'admin' },
        { groupId: group2.id, userId: testUser.id, role: 'admin' },
      ]);
      
      // 添加小组兴趣
      await db.insert(groupInterests).values([
        { groupId: group1.id, interestId: reading.id },
        { groupId: group2.id, interestId: travel.id },
      ]);
      
      console.log('Test data created successfully');
    }
    
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}