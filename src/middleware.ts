import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // 需要登录的路由
  const protectedRoutes = [
    '/create-group',
    '/profile/edit',
    '/api/profile',
    '/api/groups/[...path]/join',
    '/api/groups/[...path]/leave',
  ];

  // 检查当前路径是否需要登录
  const isProtected = protectedRoutes.some(route => {
    if (route.includes('[...path]')) {
      const baseRoute = route.split('[...path]')[0];
      return pathname.startsWith(baseRoute);
    }
    return pathname === route;
  });

  // 如果是受保护的路由但没有登录，重定向到登录页
  if (isProtected && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};