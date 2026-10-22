// app/policy/page.js
export const metadata = {
  title: '블러드 - 사이트 규정 및 보안 정책',
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 py-12 px-6 sm:px-16 lg:px-32 font-sans selection:bg-red-900 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-12 bg-[#0a0a0a] p-8 sm:p-12 border border-red-900/30 rounded-lg shadow-2xl shadow-red-900/10">
        
        <div className="border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold text-red-600 mb-2 tracking-widest">사이트 규정 및 보안 정책</h1>
          <p className="text-sm text-zinc-500">마지막 업데이트: 2026년 10월 20일</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-l-4 border-red-600 pl-3">제 1조 (목적 및 관리 권한)</h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            본 규정은 가상 롤플레잉(Role-Playing) 게임의 일부 조직인 '블러드'(이하 "조직")이 활용하는 웹사이트 및 디스코드 연동 서비스의 이용 조건, 개인정보 수집 및 보안 정책을 규정함을 목적으로 합니다. 
            <br /><br />
            <strong className="text-zinc-200">본 웹사이트의 시스템 구축, 데이터베이스(DB) 보안 및 전반적인 사이트 운영 관리는 '가나디'가 단독으로 담당합니다.</strong> 본 사이트를 방문하거나 지원서를 제출하는 모든 이용자는 본 규정에 동의한 것으로 간주됩니다.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-l-4 border-red-600 pl-3">제 2조 (개인정보 및 접속 기록 수집)</h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            사이트 및 DB 관리자 '가나디'는 시스템 보안 유지, 어뷰징(악성 도배) 방지 및 원활한 지원서 관리를 위해 다음과 같은 정보를 자동 수집하고 보관합니다.
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2 ml-2">
            <li><span className="text-zinc-200">수집 항목:</span> 접속 IP 주소, 접속 일시, 브라우저 및 기기 정보(User-Agent), 디스코드 고유 식별 ID(지원서 제출 시)</li>
            <li><span className="text-zinc-200">수집 목적:</span> 사이트 보안 시스템 유지, 사이버 테러(DDoS, 악성 봇) 방어, 중복 지원 필터링</li>
            <li><span className="text-zinc-200">보유 기간:</span> 수집된 정보는 서버 및 DB 보안 유지를 위해 보관되며, 내부 규정에 따라 주기적으로 영구 파기됩니다.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-l-4 border-red-600 pl-3">제 3조 (보안 및 사이버 범죄 대응)</h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            본 웹사이트는 비정상적인 접근 및 해킹 시도를 엄격히 금지합니다. 웹사이트의 취약점을 공격하거나 SQL 인젝션, 무차별 대입 공격(Brute Force), 데이터베이스 무단 열람을 시도하는 경우, 기록된 IP 주소 및 디스코드 ID를 바탕으로 조직 내 영구 블랙리스트 조치가 취해지며, 법적 제재 대상이 될 수 있습니다.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-l-4 border-red-600 pl-3">제 4조 (데이터베이스 암호화 및 접근 권한)</h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            제출된 지원서 및 수집된 모든 데이터베이스 자료는 암호화 통신을 통해 전송될 뿐만 아니라, <strong className="text-zinc-200">데이터베이스(Supabase) 서버 내에서도 강력하게 암호화되어 안전하게 보관</strong>됩니다. 관리자 패널 및 암호화된 데이터는 디스코드 연동 일회용 비밀번호(OTP)를 통해 인증된 지정 관리자만이 복호화 및 열람할 수 있으며, 지원자의 개인정보는 가입 심사 용도로만 사용된 후 외부에 절대 유출되지 않습니다.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white border-l-4 border-red-600 pl-3">제 5조 (법적 면책 조항 및 고지사항)</h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            본 웹사이트와 '블러드' 조직은 GTA5 파이브엠(FiveM) 등 게임 내 롤플레잉(Role-Playing)을 목적으로 운영되는 <strong className="text-red-500 font-bold">가상의 단체</strong>입니다. 
            <br /><br />
            웹사이트 내에 묘사된 '어둠', '보안', '조직' 등의 용어는 모두 게임 세계관 내의 설정일 뿐이며, 현실의 불법 행위, 폭력, 범죄 단체와는 어떠한 연관도 없음을 명확히 밝힙니다. 이용자가 게임 외 현실에서 본 단체의 이름을 사칭하여 발생하는 어떠한 문제에 대해서도 사이트/DB 관리자 '가나디'는 일체의 책임을 지지 않습니다.
          </p>
        </section>

        <section className="space-y-4 bg-zinc-900/50 p-6 rounded-md border border-zinc-800">
          <h2 className="text-xl font-semibold text-white border-l-4 border-red-600 pl-3">제 6조 (저작권 및 디지털 라이선스 보호)</h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            1. 롤플레잉 세계관 명칭을 제외한 본 웹사이트의 모든 텍스트, 이미지, UI/UX 디자인, 시스템 코드, 데이터베이스 구조 및 레이아웃 등에 대한 <strong>모든 저작권 및 지적재산권은 사이트 및 DB 관리자인 '가나디'에게 귀속</strong>됩니다. <br />
            2. 본 사이트의 시스템 및 디지털 콘텐츠는 <strong>대한민국 저작권법 및 관련 디지털 라이선스 보호법</strong>에 의해 엄격하게 보호받습니다. <br />
            3. '가나디'의 사전 서면 동의 없이 본 웹사이트의 코드, 디자인 요소 및 데이터베이스 구조를 무단으로 복제, 배포, 수정, 리버스 엔지니어링, 크롤링하거나 타 서버 및 단체에서 도용하는 행위를 엄격히 금지하며, 위반 시 민·형사상의 법적 책임을 물을 수 있습니다.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-600">
            © 2026 가나디. All rights reserved. <br />
            본 규정은 게시된 시점부터 효력이 발생합니다.
          </p>
        </div>
      </div>
    </div>
  );
}