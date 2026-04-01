import { NextRequest, NextResponse } from 'next/server';
import { invalidateSession } from '@/app/lib/session';

export async function POST(request: NextRequest) {
  try {
    await invalidateSession();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('登出失败:', error);
    return NextResponse.json({ success: false, error: '登出失败' }, { status: 500 });
  }
}