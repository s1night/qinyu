import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth/options';
import { redirect } from 'next/navigation';
import { db } from '@/db/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, parseInt(session.user.id)),
  });

  if (!user) {
    redirect('/auth/login');
  }

  // 模拟数据
  const stats = {
    tasks: 3,
    groups: 5,
    privacy: '极佳 (Great)'
  };

  const recentActivities = [
    {
      type: 'task',
      title: '报名了"周末下午去植物园散步发呆"',
      time: '2天前 (2 days ago)'
    },
    {
      type: 'group',
      title: '在"i人深夜情绪收容所"发布了一条匿名树洞',
      time: '1周前 (1 week ago)'
    }
  ];

  return (
    <main className="container-responsive py-12">
      <div className="max-w-3xl mx-auto">
        {/* 用户信息卡片 */}
        <div className="card p-8 mb-6">
          <div className="flex items-start gap-6">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.nickname} 
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">{user.nickname.charAt(0)}</span>
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-semibold">{user.nickname}</h2>
                <Link 
                  href="/profile/edit" 
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </Link>
              </div>
              
              <div className="text-sm text-muted mb-4">
                ID: qy_{user.id} · 加入于 {new Date(user.createdAt || new Date()).toLocaleDateString('zh-CN')}
              </div>
              
              {user.description && (
                <p className="text-muted mb-4">{user.description}</p>
              )}
              
              {/* 兴趣标签 */}
              <div className="flex flex-wrap gap-2">
                <span className="tag tag-primary">
                  #阅读
                </span>
                <span className="tag tag-primary">
                  #旅行
                </span>
                <span className="tag tag-primary">
                  #美食
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 数据统计和最近活动 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 数据统计 */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">数据统计 (Stats)</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm text-muted">参与轻出门</span>
                </div>
                <span className="text-xl font-semibold">{stats.tasks} 次</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-muted">加入兴趣组</span>
                </div>
                <span className="text-xl font-semibold">{stats.groups} 个</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-sm text-muted">隐私保护</span>
                </div>
                <span className="text-xl font-semibold text-primary">{stats.privacy}</span>
              </div>
            </div>
          </div>

          {/* 最近活动 */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">最近活动 (Recent Activity)</h3>
              <Link href="#" className="text-sm text-primary hover:underline">查看全部</Link>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {activity.type === 'task' ? (
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">{activity.title}</p>
                    <p className="text-xs text-muted">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}