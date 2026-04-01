import Link from 'next/link';
import { getCurrentUser } from '@/app/lib/session';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <main className="container-responsive py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">个人主页</h1>
          <Link 
            href="/profile/edit" 
            className="btn btn-primary"
          >
            编辑资料
          </Link>
        </div>

        <div className="card p-6 mb-6">
          <div className="flex items-start gap-6">
            <img 
              src={user.avatar || '/default-avatar.png'} 
              alt={user.nickname} 
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">{user.nickname}</h2>
              {user.description && (
                <p className="text-muted mb-4">{user.description}</p>
              )}
              <div className="text-sm text-muted">
                加入时间: {new Date(user.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
          </div>
        </div>

        {user.interests && user.interests.length > 0 && (
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4">兴趣爱好</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <span 
                  key={interest.id}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {interest.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}