// app/api/track/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase'; // <-- @/app/lib/supabase 로 수정!

export async function GET(req) {
  const ip = req.headers.get('x-forwarded-for') || '알 수 없음';
  
  if (ip !== '알 수 없음') {
    await supabase.from('visitor_ips').insert([{ ip_address: ip }]);
  }
  return NextResponse.json({ success: true });
}