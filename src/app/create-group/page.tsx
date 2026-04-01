'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CreateGroupPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar: '',
    interests: ''
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          router.push('/login');
        } else {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');
    setSuccess(false);

    try {
      const interestsArray = formData.interests
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => interest.length > 0);

      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          interests: interestsArray
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '创建小组失败');
      }

      const data = await response.json();
      setSuccess(true);
      
      setTimeout(() => {
        router.push(`/groups/${data.groupId}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建小组失败');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="container-responsive py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted">加载中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container-responsive py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">创建兴趣小组</h1>
          <Link 
            href="/groups" 
            className="btn btn-outline"
          >
            返回小组列表
          </Link>
        </div>

        {success ? (
          <div className="card p-8 text-center">
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold mb-2">小组创建成功！</h2>
            <p className="text-muted mb-4">正在跳转到小组详情页面...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  小组名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入小组名称"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  小组描述
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入小组描述"
                />
              </div>

              <div>
                <label htmlFor="avatar" className="block text-sm font-medium mb-2">
                  小组头像URL
                </label>
                <input
                  type="url"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入头像URL"
                />
              </div>

              <div>
                <label htmlFor="interests" className="block text-sm font-medium mb-2">
                  兴趣标签
                </label>
                <input
                  type="text"
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入兴趣标签，用逗号分隔"
                />
                <p className="text-sm text-muted mt-1">
                  例如：音乐,电影,旅行,阅读
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={actionLoading}
                className="btn btn-primary w-full"
              >
                {actionLoading ? '创建中...' : '创建小组'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}