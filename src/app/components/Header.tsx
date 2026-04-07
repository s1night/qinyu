'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const sessionData = useSession();
  const session = sessionData?.data;

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
          {session && session.user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="flex items-center gap-2">
                {session.user.image ? (
                <img src={session.user.image} alt={session.user.name || ''} className="avatar" />
              ) : (
                  <div className="avatar bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">{session.user.name?.charAt(0) || '?'}</span>
                  </div>
                )}
                <span className="text-sm font-medium">{session.user.name}</span>
              </Link>
              <button 
                onClick={() => signOut()}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                退出
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="btn btn-primary">
              登录 (Login)
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}