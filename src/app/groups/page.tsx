'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function GroupsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const authResponse = await fetch('/api/profile');
        if (!authResponse.ok) {
          router.push('/login');
          return;
        }
        const userData = await authResponse.json();
        setUser(userData);

        const groupsResponse = await fetch('/api/groups');
        if (!groupsResponse.ok) {
          throw new Error('获取小组列表失败');
        }
        const groupsData = await groupsResponse.json();
        setGroups(groupsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <main className="container-responsive py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted">加载中...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container-responsive py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-muted text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-semibold mb-2">加载失败</h1>
          <p className="text-muted mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            重试
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container-responsive py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">兴趣小组</h1>
          <Link 
            href="/create-group" 
            className="btn btn-primary"
          >
            创建小组
          </Link>
        </div>

        {groups.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-muted text-4xl mb-4">📢</div>
            <h2 className="text-xl font-semibold mb-2">暂无兴趣小组</h2>
            <p className="text-muted mb-4">成为第一个创建小组的人吧！</p>
            <Link 
              href="/create-group" 
              className="btn btn-primary"
            >
              创建第一个小组
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map((group: any) => (
              <div key={group.id} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {group.avatar ? (
                      <img 
                        src={group.avatar} 
                        alt={group.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {group.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{group.name}</h3>
                      <span className="text-sm text-muted">
                        {group.member_count} 成员
                      </span>
                    </div>
                    {group.description && (
                      <p className="text-muted text-sm mb-3 line-clamp-2">
                        {group.description}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-muted">
                      <img 
                        src={group.creator_avatar} 
                        alt={group.creator_name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span>创建者：{group.creator_name}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Link 
                    href={`/groups/${group.id}`} 
                    className="btn btn-outline w-full"
                  >
                    查看详情
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}