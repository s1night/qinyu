'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function GroupsPage() {
  const [user, setUser] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        // 获取用户信息（如果已登录）
        const authResponse = await fetch('/api/profile');
        if (authResponse.ok) {
          const userData = await authResponse.json();
          setUser(userData);
        }

        // 获取小组列表（无需登录）
        const groupsResponse = await fetch('/api/groups');
        if (!groupsResponse.ok) {
          throw new Error('获取小组列表失败');
        }
        const groupsData = await groupsResponse.json();
        
        // 添加模拟数据以匹配设计稿
        const mockGroups = groupsData.length > 0 ? groupsData : [
          {
            id: 1,
            name: '周末不说话读书会',
            description: '找个咖啡馆，大家坐在一起看自己的书，不需要寒暄，享受安静共处的时光。',
            avatar: null,
            tags: ['读书 (Reading)', '安静 (Quiet)'],
            memberCount: 128,
            creator: {
              nickname: '书虫'
            }
          },
          {
            id: 2,
            name: 'i人深夜情绪收容所',
            description: '只在深夜活跃的匿名倾诉地。不评判，不指导，只倾听。发完即走。',
            avatar: null,
            tags: ['树洞 (Venting)', '匿名 (Anonymous)'],
            memberCount: 456,
            creator: {
              nickname: '夜猫子'
            }
          },
          {
            id: 3,
            name: '极简徒步爱好者',
            description: '不需要专业装备，不需要强健体魄。只是选一条平缓的路线，走一走，出出汗。',
            avatar: null,
            tags: ['徒步 (Hiking)', '运动 (Sports)'],
            memberCount: 89,
            creator: {
              nickname: '行者'
            }
          },
          {
            id: 4,
            name: '微型胶片摄影互赏',
            description: '随手拍的日常角落，不需要构图完美，记录生活的质感就好。',
            avatar: null,
            tags: ['摄影 (Photography)', '艺术 (Art)'],
            memberCount: 210,
            creator: {
              nickname: '摄影师'
            }
          },
          {
            id: 5,
            name: '手作烘焙小聚',
            description: '一起做蛋糕、饼干，分享烘焙心得，享受动手的乐趣和美食的香气。',
            avatar: null,
            tags: ['烘焙 (Baking)', '手工 (Handmade)'],
            memberCount: 76,
            creator: {
              nickname: '烘焙师'
            }
          },
          {
            id: 6,
            name: '城市探索者',
            description: '探索城市的小众角落，发现隐藏的咖啡馆、书店和艺术空间。',
            avatar: null,
            tags: ['探索 (Exploration)', '城市 (City)'],
            memberCount: 156,
            creator: {
              nickname: '探索者'
            }
          },
          {
            id: 7,
            name: '冥想放松小组',
            description: '一起练习冥想，放松身心，缓解压力，寻找内心的平静。',
            avatar: null,
            tags: ['冥想 (Meditation)', '健康 (Health)'],
            memberCount: 98,
            creator: {
              nickname: '冥想师'
            }
          }
        ];
        
        setGroups(mockGroups);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
            <h1 className="text-3xl font-bold text-foreground mb-2">兴趣圈子</h1>
            <p className="text-muted">找到同频的人，不尬聊，自然相处。(Find your vibe, no awkward chats)</p>
          </div>
          {user && (
            <Link href="/create-group" className="btn btn-primary">
              + 创建圈子 (Create Group)
            </Link>
          )}
        </div>

        {/* 搜索框 */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索圈子名称或标签... (Search groups)"
              className="input-search pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" fill="currentColor">
              <path d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" />
            </svg>
          </div>
        </div>

        {/* 小组列表 */}
        <h2 className="text-lg font-semibold mb-4">为你推荐 (Recommended)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((group: any) => (
            <div key={group.id} className="card hover:shadow-lg">
              {/* 小组头像 */}
              <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                {group.avatar ? (
                  <img 
                    src={group.avatar} 
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">
                      {group.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* 小组信息 */}
              <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
              
              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {group.tags?.map((tag: string, index: number) => (
                  <span key={index} className="tag tag-primary">
                    {tag}
                  </span>
                ))}
              </div>

              {/* 描述 */}
              <p className="text-muted text-sm mb-4 line-clamp-3">{group.description}</p>

              {/* 底部信息 */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{group.memberCount || 0} 成员 (Members)</span>
                </div>
                
                <Link 
                  href={`/groups/${group.id}`} 
                  className="btn btn-outline text-sm"
                >
                  进入交流 (Enter)
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}