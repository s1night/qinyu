import Link from 'next/link';
import { getCurrentUser } from '@/app/lib/session';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrentUser();

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) {
      redirect('/');
    }
  };

  return (
    <main className="container-responsive py-12">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-foreground mb-4">
          Welcome to RoCom Haven
        </h1>
        <p className="text-[clamp(1rem,2vw,1.25rem)] text-muted mb-8 max-w-2xl">
          A modern React application built with Next.js, TypeScript, and PostgreSQL
        </p>
        
        {user ? (
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar || '/default-avatar.png'} 
                alt={user.nickname} 
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="text-lg font-medium">欢迎，{user.nickname}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/profile" className="btn btn-primary">
                个人主页
              </Link>
              <Link href="/groups" className="btn btn-outline">
                兴趣小组
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
              >
                退出登录
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/login" className="btn btn-primary">
              登录
            </Link>
            <Link href="#" className="btn btn-outline">
              Learn More
            </Link>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Next.js 14</h3>
            <p className="text-muted">
              Built with the latest Next.js features including App Router and Server Components
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">TypeScript</h3>
            <p className="text-muted">
              Fully typed with TypeScript for better developer experience and type safety
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">PostgreSQL</h3>
            <p className="text-muted">
              Integrated with PostgreSQL database for robust data storage and retrieval
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
