import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase'; // 본인 경로에 맞게 확인

export async function POST(req) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown Device';

    const now = new Date();
    
    // 1. 같은 IP와 기기로 '최근 30분 이내'에 기록된 내역이 있는지 확인
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000).toISOString();

    const { data: existingLogs, error: searchError } = await supabase
      .from('visitor_ips')
      .select('id, created_at')
      .eq('ip', ip)
      .eq('device', userAgent)
      .gte('created_at', thirtyMinutesAgo)
      .limit(1);

    if (searchError) {
      console.error('방문 기록 조회 오류:', searchError.message);
    }

    // 2. 30분 이내 기록이 이미 존재한다면 새로 추가하지 않고 패스!
    if (existingLogs && existingLogs.length > 0) {
      return NextResponse.json({ success: true, message: 'Recent visit already logged.' });
    }

    // 3. 30분 동안 기록이 없었다면 새로 DB에 저장
    const { error: insertError } = await supabase
      .from('visitor_ips')
      .insert([
        { 
          ip: ip, 
          device: userAgent,
          created_at: now.toISOString() 
        }
      ]);

    if (insertError) {
      console.error('IP 저장 오류:', insertError.message);
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'New visit logged successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}