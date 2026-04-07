import { db } from './db';

export async function migrateDatabase() {
  try {
    console.log('Starting database migration...');
    
    // 创建用户表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nickname TEXT NOT NULL,
        avatar TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // 创建会话表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // 创建兴趣表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS interests (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // 创建小组表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        avatar TEXT,
        creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // 创建用户兴趣关联表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_interests (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        interest_id INTEGER REFERENCES interests(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (user_id, interest_id)
      )
    `);
    
    // 创建小组成员表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS group_members (
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        role TEXT DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (group_id, user_id)
      )
    `);
    
    // 创建小组兴趣关联表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS group_interests (
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
        interest_id INTEGER REFERENCES interests(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (group_id, interest_id)
      )
    `);
    
    // 创建帖子表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        content TEXT NOT NULL,
        is_anonymous BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // 创建评论表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        content TEXT NOT NULL,
        is_anonymous BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // 创建活动表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        latitude TEXT NOT NULL,
        longitude TEXT NOT NULL,
        max_participants INTEGER DEFAULT 3 NOT NULL,
        status TEXT DEFAULT 'open' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // 创建活动参与者表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS activity_participants (
        activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (activity_id, user_id)
      )
    `);
    
    console.log('Database migration completed successfully');
    
  } catch (error) {
    console.error('Database migration error:', error);
    throw error;
  }
}