// app/layout.js
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: "적운 - JEOGUN",
  description: "적운이 도시를 지배한다",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="bg-black text-white relative min-h-screen flex flex-col selection:bg-red-600 selection:text-white">
        
        {/* 상단 고정 네비게이션 바 */}
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-black/70 border-b border-red-900/50 backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              {/* 좌측 로고 */}
              <div className="flex-shrink-0">
                <Link href="/" className="text-2xl font-bold text-red-600 tracking-widest hover:text-red-500 transition-colors">
                  적운
                </Link>
              </div>
              
              {/* 우측 메뉴 및 버튼들 (오류 없는 표준 href 앵커 링크 방식) */}
              <div className="flex items-center space-x-6 sm:space-x-8 text-sm font-bold text-gray-300">
                <a href="/#intro-section" className="hover:text-red-500 transition-colors cursor-pointer hidden sm:block">소개</a>
                <a href="/#org-section" className="hover:text-red-500 transition-colors cursor-pointer hidden sm:block">조직도</a>
                <a href="/#activity-section" className="hover:text-red-500 transition-colors cursor-pointer hidden sm:block">활동사진</a>
                
                <Link href="/apply" className="text-red-500 hover:text-white border border-red-900/50 rounded-md px-4 py-2 transition-all hover:bg-red-900 shadow-[0_0_10px_rgba(204,0,0,0.3)]">
                  지원서 제출
                </Link>
              </div>

            </div>
          </div>
        </nav>

        {/* 메인 콘텐츠 영역 */}
        <main className="relative flex-grow flex flex-col pt-16">
          {children}
        </main>
        
        {/* 하단 넷플릭스 스타일 풋터 */}
        <footer className="relative z-50 text-zinc-500 text-xs py-8 px-6 sm:px-16 lg:px-32 border-t border-red-900/30 bg-[#0a0a0a] mt-auto">
          <div className="max-w-6xl mx-auto space-y-4">
            <div>
              <p className="font-semibold text-zinc-400">적운 사이트</p>
            </div>

            <div className="space-y-2 leading-relaxed text-zinc-600">
              <p>사이트 대표: 가나디 | 이메일 주소: blackskirts2017@gmail.com</p>
              <p>디스코드 아이디 : 1444136852440481896</p>
              <p>클라우드 호스팅: Amazon Web Services Inc. / Supabase Database</p>
              <p>
                <Link href="/policy" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 hover:underline transition-colors font-medium">
                  사이트 규정 및 보안 정책
                </Link>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 border-t border-zinc-900 gap-4 mt-6">
              <p className="text-zinc-600">이 사이트는 대한민국의 저작권법으로 보호를 받아 무단 복제 및 카피를 금지합니다.</p>
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full border border-red-900/50 flex items-center justify-center text-[10px] font-bold text-red-500 bg-red-950/30">
                  赤
                </div>
                <Link href="/admin" className="text-zinc-500 hover:text-red-500 transition-colors font-medium">
                  Admin Login
                </Link>
              </div>
            </div>

          </div>
        </footer>
      </body>
    </html>
  );
}