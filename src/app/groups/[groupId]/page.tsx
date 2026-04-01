'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function GroupDetailPage({
  params
}: {
  params: { groupId: string }
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        // 获取用户信息（如果已登录）
        const authResponse = await fetch('/api/profile');
        if (authResponse.ok) {
          const userData = await authResponse.json();
          setUser(userData);
        }

        // 获取小组信息（无需登录）
        const groupResponse = await fetch(`/api/groups/${params.groupId}`);
        if (!groupResponse.ok) {
          if (groupResponse.status === 404) {
            setError('小组不存在');
          } else {
            throw new Error('获取小组信息失败');
          }
        } else {
          const groupData = await groupResponse.json();
          
          // 添加话题测试数据
          const groupWithTopics = {
            ...groupData,
            topics: [
              {
                id: 1,
                title: '分享一本最近在读的好书',
                content: '最近在读《原子习惯》，感觉很有启发，推荐给大家！',
                user: {
                  nickname: '书虫',
                  avatar: null
                },
                createdAt: '2024-01-15T10:30:00',
                likes: 24,
                comments: 8
              },
              {
                id: 2,
                title: '周末读书会地点推荐',
                content: '我发现了一个环境很好的咖啡馆，适合安静看书，地址在XX路XX号',
                user: {
                  nickname: '读者',
                  avatar: null
                },
                createdAt: '2024-01-14T14:20:00',
                likes: 18,
                comments: 5
              },
              {
                id: 3,
                title: '大家平时喜欢读什么类型的书？',
                content: '我比较喜欢文学和心理学类的书籍，你们呢？',
                user: {
                  nickname: '文学爱好者',
                  avatar: null
                },
                createdAt: '2024-01-13T09:15:00',
                likes: 32,
                comments: 12
              }
            ]
          };
          
          setGroup(groupWithTopics);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.groupId, router]);

  const handleJoin = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/groups/${params.groupId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '加入小组失败');
      }

      setSuccess('成功加入小组！');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加入小组失败');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm('确定要退出小组吗？')) {
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/groups/${params.groupId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '退出小组失败');
      }

      setSuccess('成功退出小组！');
      setTimeout(() => {
        router.push('/groups');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : '退出小组失败');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="container-responsive py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted">加载中...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container-responsive py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-muted text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-semibold mb-2">{error}</h1>
          <p className="text-muted mb-4">您访问的小组不存在或已被删除</p>
          <Link href="/groups" className="btn btn-primary">
            返回小组列表
          </Link>
        </div>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="container-responsive py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-muted text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-semibold mb-2">小组不存在</h1>
          <p className="text-muted mb-4">您访问的小组不存在或已被删除</p>
          <Link href="/groups" className="btn btn-primary">
            返回小组列表
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-responsive py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/groups" 
            className="btn btn-outline"
          >
            返回列表
          </Link>
          {user ? (
            !group.is_member ? (
              <button
                onClick={handleJoin}
                disabled={actionLoading}
                className="btn btn-primary"
              >
                {actionLoading ? '加入中...' : '加入小组'}
              </button>
            ) : (
              <button
                onClick={handleLeave}
                disabled={actionLoading}
                className="btn btn-outline"
              >
                {actionLoading ? '退出中...' : '退出小组'}
              </button>
            )
          ) : (
            <Link 
              href="/login" 
              className="btn btn-primary"
            >
              登录后加入小组
            </Link>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="card p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              {group.avatar ? (
                <img 
                  src={group.avatar} 
                  alt={group.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-primary">
                  {group.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-semibold">{group.name}</h1>
                {group.is_admin && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                    管理员
                  </span>
                )}
              </div>
              {group.description && (
                <p className="text-muted mb-4">{group.description}</p>
              )}
              <div className="flex items-center text-sm text-muted">
                <img 
                  src={group.creator_avatar} 
                  alt={group.creator_name}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span>创建者：{group.creator_name}</span>
                <span className="mx-2">•</span>
                <span>创建时间：{new Date(group.created_at).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>
          </div>
        </div>

        {group.interests && group.interests.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">兴趣标签</h2>
            <div className="flex flex-wrap gap-2">
              {group.interests.map((interest: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">小组成员 ({group.member_count})</h2>
          <div className="space-y-4">
            {group.members.map((member: any) => (
              <div key={member.id} className="flex items-center gap-4">
                <img 
                  src={member.avatar} 
                  alt={member.nickname}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{member.nickname}</span>
                    {member.role === 'admin' && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        管理员
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted">
                    加入时间：{new Date(member.joined_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 话题列表 */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">圈子话题</h2>
            {user && (
              <button className="btn btn-primary text-sm">
                发布话题
              </button>
            )}
          </div>
          
          <div className="space-y-6">
            {group.topics && group.topics.map((topic: any) => (
              <div key={topic.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  {topic.user.avatar ? (
                    <img src={topic.user.avatar} alt={topic.user.nickname} className="avatar" />
                  ) : (
                    <div className="avatar bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">{topic.user.nickname.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{topic.user.nickname}</span>
                      <span className="text-xs text-muted">
                        {new Date(topic.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
                    <p className="text-muted mb-4 line-clamp-3">{topic.content}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted">
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{topic.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{topic.comments} 评论</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}