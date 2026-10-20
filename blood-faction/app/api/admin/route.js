// app/api/admin/route.js
import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function POST(req) {
  try {
    const { action, code } = await req.json();

    if (action === 'verify_otp') {
      // 💡 핵심 변경점: id=1 칸을 찾는게 아니라, 사용자가 누른 '6자리 숫자(code)' 자체를 찾습니다.
      // maybeSingle()을 쓰면 없는 숫자를 쳐도 서버 에러(500)가 나지 않고 깔끔하게 튕겨냅니다.
      const { data, error } = await supabase
        .from('admin_otp')
        .select('code, created_at')
        .eq('code', code) 
        .maybeSingle();

      if (error || !data) {
        console.log(`[OTP 검증 실패] 입력한 코드(${code})는 DB에 존재하지 않습니다.`);
        return NextResponse.json({ success: false, message: 'wrong' }, { status: 401 });
      }

      const issuedTime = new Date(data.created_at).getTime();
      const currentTime = new Date().getTime();
      const elapsedSeconds = Math.floor((currentTime - issuedTime) / 1000);

      console.log(`[OTP 조회 성공] 일치하는 코드 발견! 경과 시간: ${elapsedSeconds}초`);

      // 1. 발급 후 2분(120초) 경과 여부 체크
      if (elapsedSeconds > 120 || elapsedSeconds < -10) {
        console.log('[OTP 검증 실패] 코드가 만료되었습니다.');
        return NextResponse.json({ success: false, message: 'expired' }, { status: 401 });
      }

      // 시간 통과 시 성공
      console.log('[OTP 검증 성공] 로그인 승인');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 400 });
  } catch (error) {
    console.error('API 에러:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const { data: apps, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(apps);
}