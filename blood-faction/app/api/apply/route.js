import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function POST(req) {
  try {
    const data = await req.json();
    const ip = req.headers.get('x-forwarded-for') || '알 수 없음';
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const adminDashboardUrl = "http://localhost:3000/admin"; 

    // 1. Supabase 데이터베이스에 지원서 내용 및 IP 저장
    const { error } = await supabase.from('applications').insert([{
      info: data.info, 
      age_gender: data.ageGender, 
      rp_definition: data.rpDefinition,
      non_rp_definition: data.nonRpDefinition, 
      bad_rp_definition: data.badRpDefinition,
      ic_ooc_definition: data.icOocDefinition, 
      fivem_exp: data.fivemExp,
      server_exp: data.serverExp, 
      activity_rate: data.activityRate,
      motive: data.motive, 
      resolution: data.resolution, 
      ip_address: ip
    }]);

    if (error) {
      console.error("Supabase 저장 오류:", error);
      throw error;
    }

    // 2. 디스코드 웹훅 전송 (보내주신 디자인 양식 적용)
    const payload = {
      embeds: [
        {
          title: "🩸 블러드 조직 신규 지원서 도착",
          description: "새로운 조직원 지원서가 접수되었습니다. 내용을 꼼꼼히 확인해주세요.",
          color: 13632027, // 다크 레드
          fields: [
            { name: "고번/이름", value: data.info, inline: true },
            { name: "나이/성별", value: data.ageGender, inline: true },
            { name: "접속률", value: data.activityRate, inline: true },
            { name: "FIVEM 경력", value: data.fivemExp, inline: true },
            { name: "서버 경력", value: data.serverExp, inline: true },
            { name: "IC & OOC 뜻", value: data.icOocDefinition, inline: false },
            { name: "RP 정의 및 예시", value: data.rpDefinition, inline: false },
            { name: "Non-RP 정의 및 예시", value: data.nonRpDefinition, inline: false },
            { name: "Bad-RP 정의 및 예시", value: data.badRpDefinition, inline: false },
            { name: "지원 계기", value: data.motive, inline: false },
            { name: "각오와 포부", value: data.resolution, inline: false },
            { name: "작성자 IP", value: ip, inline: false }
          ],
          footer: {
            text: "License by NADI"
          },
          timestamp: new Date().toISOString(),
        }
      ],
      components: [
        {
          type: 1, 
          components: [
            {
              type: 2, 
              style: 5, 
              label: "💻 대시보드로 바로가기",
              url: adminDashboardUrl
            }
          ]
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return NextResponse.json({ message: "성공" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "웹훅 전송 실패" }, { status: 500 });
    }
  } catch (error) {
    console.error("서버 오류 발생:", error);
    return NextResponse.json({ message: "서버 오류", error: error.message }, { status: 500 });
  }
}