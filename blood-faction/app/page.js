// app/page.js
'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from './lib/supabase'; 

export default function Home() {
  const containerRef = useRef(null);
  
  const [activityImages, setActivityImages] = useState({});
  const [siteData, setSiteData] = useState({ intro_text: '', org_chart: '' });

  useEffect(() => {
    // 💡 [수정된 부분] 1시간 동안 중복 방문(새로고침) DB 저장 방지 로직
    const trackVisitor = async () => {
      const lastVisited = localStorage.getItem('lastVisited');
      const now = new Date().getTime();
      const cooldown = 3600000; // 1시간 (밀리초). 24시간으로 하려면 86400000으로 변경하세요.

      // 마지막 방문 기록이 있고, 1시간이 채 지나지 않았다면 함수 종료 (DB API 호출 안 함)
      if (lastVisited && now - parseInt(lastVisited) < cooldown) {
        return; 
      }

      // 1시간이 지났거나 첫 접속일 때만 API 호출하여 DB에 기록
      try {
        await fetch('/api/visit', { method: 'POST' });
        // 호출 성공 후 현재 접속 시간을 브라우저에 저장
        localStorage.setItem('lastVisited', now.toString());
      } catch (err) {
        console.error('방문 기록 전송 실패:', err);
      }
    };

    trackVisitor(); // 방문자 추적 실행

    // --- 기존 이미지/데이터 불러오기 로직 유지 ---
    const fetchImages = async () => {
      const { data } = await supabase.from('activity_images').select('*').order('id', { ascending: true });
      if (data) {
        const imageMap = {};
        data.forEach(item => { imageMap[item.id] = item.image_url; });
        setActivityImages(imageMap);
      }
    };
    
    const fetchSiteData = async () => {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (data) {
        setSiteData({ 
          intro_text: data.intro_text || '', 
          org_chart: data.org_chart || '' 
        });
      }
    };

    fetchImages();
    fetchSiteData();
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"]);

  return (
    <div ref={containerRef} className="relative min-h-[220vh]">
      
      {/* 배경 이미지 패럴랙스 */}
      <motion.div 
        className="fixed inset-0 z-0 w-full h-full bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/img.png')", y: backgroundY }} 
      />

      {/* 메인 타이틀 */}
      <motion.div 
        className="relative z-10 h-screen flex flex-col items-center justify-center px-4 pointer-events-none"
        style={{ opacity: titleOpacity, y: titleY }}
      >
        <h1 className="text-7xl sm:text-9xl font-extrabold text-red-700 tracking-[0.2em] mb-4 drop-shadow-2xl">블러드</h1>
        <p className="text-xl sm:text-3xl text-gray-300 font-light tracking-widest uppercase">블러드가 도시를 지배한다</p>
      </motion.div>

      {/* 컨텐츠 영역 */}
      <div className="relative z-20 bg-black/90 border-t border-red-900/50 backdrop-blur-xl pb-32 pt-20">
        <div className="container mx-auto px-4 space-y-32">
          
          {/* 1. INTRODUCTION (소개글) */}
          <section id="intro-section" className="pt-10 scroll-mt-24">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-bold text-red-600 mb-10 text-center tracking-widest">INTRODUCTION</h2>
              <div className="max-w-4xl mx-auto text-lg text-gray-300 whitespace-pre-wrap leading-loose text-center bg-white/5 p-8 rounded-xl border border-white/10 shadow-inner">
                {siteData.intro_text || '등록된 팩션 소개글이 없습니다.'}
              </div>
            </motion.div>
          </section>

          {/* 2. ORGANIZATION (조직도) */}
          <section id="org-section" className="pt-10 scroll-mt-24">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-bold text-red-600 mb-10 text-center tracking-widest">ORGANIZATION</h2>
              <div className="max-w-3xl mx-auto bg-[#0a0a0a] border border-red-900/30 p-10 sm:p-14 rounded-xl shadow-[0_0_30px_rgba(204,0,0,0.1)]">
                <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed font-mono text-center text-sm sm:text-base">
                  {siteData.org_chart || '등록된 조직도가 없습니다.'}
                </div>
              </div>
            </motion.div>
          </section>

          {/* 3. ACTIVITIES (활동 사진 갤러리) */}
          <section id="activity-section" className="pt-10 scroll-mt-24">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-bold text-red-600 mb-10 text-center tracking-widest">ACTIVITIES</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="aspect-video bg-[#151515] rounded-xl overflow-hidden border border-zinc-800/50 flex items-center justify-center shadow-2xl relative group transition-transform hover:scale-[1.02]">
                    {activityImages[num] ? (
                      <>
                        <div className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${activityImages[num]})` }} />
                        <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/20 transition-colors duration-300 z-10" />
                      </>
                    ) : (
                      <span className="text-zinc-600 relative z-10 font-bold">활동 기록 {num} (미등록)</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </section>

        </div>
      </div>
    </div>
  );
}