import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import Link from 'next/link';
import Header from './components/Header';
import ClientProviders from './components/ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '轻遇',
  description: '找个近处的搭子，做件小事，没压力',
  keywords: ['轻遇', '社交', '搭子', '线下活动'],
  authors: [{ name: '轻遇' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ClientProviders>
          <div className="min-h-screen bg-background">
            {/* 顶部导航栏 */}
            <Header />

            {/* 主内容区 */}
            <main>
              {children}
            </main>

            {/* 页脚 */}
            <footer className="bg-white border-t border-border py-8 mt-12">
              <div className="container-responsive text-center text-sm text-muted">
                <p>© 2024 轻遇. 找个近处的搭子，做件小事，没压力.</p>
              </div>
            </footer>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
