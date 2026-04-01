'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/session';

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error('Unauthorized');
        }
        const userData = await response.json();
        setUser(userData);
        setDescription(userData.description || '');
        setInterests(userData.interests?.map((i: any) => i.name) || []);
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  const handleAddInterest = () => {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, interests }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      router.push('/profile');
    } catch (err) {
      setError('更新失败，请重试');
    } finally {
      setSaving(false);
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

  return (
    <main className="container-responsive py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">编辑个人资料</h1>
          <Link 
            href="/profile" 
            className="btn btn-outline"
          >
            返回
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">基本信息</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">头像</label>
                <img 
                  src={user?.avatar} 
                  alt={user?.nickname} 
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">昵称</label>
                <p className="text-muted">{user?.nickname}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">个人描述</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="介绍一下自己..."
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">兴趣爱好</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                  placeholder="添加兴趣标签..."
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="btn btn-primary"
                >
                  添加
                </button>
              </div>

              {interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <span 
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex gap-4 justify-end">
            <Link 
              href="/profile" 
              className="btn btn-outline"
            >
              取消
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}