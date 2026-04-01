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
          setGroup(groupData);
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

        <div className="card p-6">
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
      </div>
    </main>
  );
}