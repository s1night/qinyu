'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }

    fetchUser();
  }, []);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">轻</span>
            </div>
            <span className="text-xl font-bold text-foreground">轻遇</span>
          </Link>

          {/* 导航链接 */}
          <nav className="flex items-center gap-4">
            <Link href="/" className="nav-link">
              <span>广场</span>
              <span className="text-xs text-gray-500">(Square)</span>
            </Link>
            <Link href="/groups" className="nav-link">
              <span>圈子</span>
              <span className="text-xs text-gray-500">(Groups)</span>
            </Link>
            <Link href="/profile" className="nav-link">
              <span>我的</span>
              <span className="text-xs text-gray-500">(Profile)</span>
            </Link>
          </nav>

          {/* 登录/用户信息 */}
          {user ? (
            <Link href="/profile" className="flex items-center gap-2">
              {user.avatar ? (
                <img src={user.avatar} alt={user.nickname} className="avatar" />
              ) : (
                <div className="avatar bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium">{user.nickname.charAt(0)}</span>
                </div>
              )}
              <span className="text-sm font-medium">{user.nickname}</span>
            </Link>
          ) : (
            <Link href="/login" className="btn btn-primary">
              登录 (Login)
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}