'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    async function fetchData() {
      try {
        // 获取用户信息
        const authResponse = await fetch('/api/profile');
        if (authResponse.ok) {
          const userData = await authResponse.json();
          setUser(userData);
        }

        // 获取任务列表（模拟数据）
        const mockTasks = [
          {
            id: 1,
            title: '周末下午去植物园散步发呆',
            description: '不需要强行找话题，可以各走各的，或者一起找个草坪坐着吹风。限3人，主打一个陪伴但不...',
            user: {
              nickname: '匿名小白',
              avatar: null,
              distance: '1.2 km'
            },
            tags: ['散步 (Walking)', '低能量 (Low Energy)'],
            time: '周六 14:00',
            participants: '1/3人'
          },
          {
            id: 2,
            title: '寻找看猫猫展的搭子',
            description: 'XX美术馆有个流浪猫主题展，一个人去有点孤单，找个同样喜欢猫的朋友一起去。看完就散...',
            user: {
              nickname: '匿名树叶',
              avatar: null,
              distance: '3.5 km'
            },
            tags: ['看展 (Exhibition)', '宠物 (Pets)'],
            time: '明天 10:30',
            participants: '1/2人'
          },
          {
            id: 3,
            title: '新开的独立书店打卡',
            description: '想去那边喝杯咖啡看半天书。我可能会戴耳机，你可以做你自己的事。只是体验一下有个人在...',
            user: {
              nickname: '匿名云朵',
              avatar: null,
              distance: '0.8 km'
            },
            tags: ['探店 (Cafes)', '安静 (Quiet)'],
            time: '今晚 19:00',
            participants: '1/2人'
          }
        ];
        setTasks(mockTasks);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filters = [
    { value: 'all', label: '全部 (All)' },
    { value: 'nearby', label: '<3km' },
    { value: 'weekend', label: '周末 (Weekend)' },
    { value: 'exhibition', label: '看展 (Exhibitions)' },
    { value: 'walking', label: '散步 (Walking)' },
    { value: 'chilling', label: '发呆 (Chilling)' }
  ];

  if (loading) {
    return (
      <main className="container-responsive py-12">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container-responsive py-12">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">轻出门广场</h1>
            <p className="text-muted">找个近处的搭子，做件小事，没压力。(Low-pressure meetups nearby)</p>
          </div>
          {user && (
            <Link href="/create-task" className="btn btn-primary">
              + 发布轻约 (Create Task)
            </Link>
          )}
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索感兴趣的活动... (Search)"
              className="input-search pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" fill="currentColor">
              <path d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" />
            </svg>
          </div>
        </div>

        {/* 筛选标签 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFilter === filter.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* 任务列表 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task.id} className="card hover:shadow-lg">
              {/* 用户信息 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {task.user.avatar ? (
                    <img src={task.user.avatar} alt={task.user.nickname} className="avatar" />
                  ) : (
                    <div className="avatar bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">{task.user.nickname.charAt(2)}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium">{task.user.nickname}</span>
                    <span className="text-xs text-muted ml-2">距你 {task.user.distance}</span>
                  </div>
                </div>
                <span className="text-xs text-primary font-medium">{task.participants}</span>
              </div>

              {/* 任务内容 */}
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{task.title}</h3>
              <p className="text-muted text-sm mb-4 line-clamp-3">{task.description}</p>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {task.tags.map((tag: string, index: number) => (
                  <span key={index} className="tag tag-primary">
                    {tag}
                  </span>
                ))}
              </div>

              {/* 底部操作 */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{task.time}</span>
                </div>
                {user ? (
                  <button className="btn btn-primary text-sm">
                    我想去 (Join)
                  </button>
                ) : (
                  <Link href="/login" className="btn btn-primary text-sm">
                    登录参与
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
