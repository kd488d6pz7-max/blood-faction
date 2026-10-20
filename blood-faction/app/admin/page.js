'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase'; 

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [code, setCode] = useState('');
  const [apps, setApps] = useState([]);
  const [statusMsg, setStatusMsg] = useState('');

  // 사진 및 텍스트 설정 상태
  const [images, setImages] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [settings, setSettings] = useState({ intro_text: '', org_chart: '' });

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setStatusMsg('코드 확인 중...');
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_otp', code })
      });

      if (res.ok) {
        setIsLoggedIn(true);
        fetchApps(); 
        fetchImages(); 
        fetchSettings(); // 사이트 설정 데이터 불러오기
      } else {
        const result = await res.json();
        setStatusMsg(result.message === 'expired' ? '인증 코드가 만료되었습니다! 디스코드에서 다시 발급받으세요.' : '코드가 틀렸습니다.');
        setCode('');
      }
    } catch (error) {
      setStatusMsg('서버 통신 오류가 발생했습니다.');
    }
  };

  const fetchApps = async () => {
    const res = await fetch('/api/admin');
    const data = await res.json();
    setApps(data);
  };

  // 🗑️ 지원서 삭제 함수
  const handleDeleteApp = async (id) => {
    if (!confirm('정말 이 지원서를 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.')) return;
    try {
      await supabase.from('applications').delete().eq('id', id);
      alert('지원서가 삭제되었습니다.');
      fetchApps();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  // 텍스트 및 사진 데이터 페칭
  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (data) setSettings({ intro_text: data.intro_text, org_chart: data.org_chart });
  };

  const fetchImages = async () => {
    const { data } = await supabase.from('activity_images').select('*').order('id', { ascending: true });
    if (data) {
      const imageMap = {};
      data.forEach(item => { imageMap[item.id] = item.image_url; });
      setImages(imageMap);
    }
  };

  // 💾 소개글/조직도 저장 함수
  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase.from('site_settings').update({
        intro_text: settings.intro_text,
        org_chart: settings.org_chart
      }).eq('id', 1);

      if (error) throw error;
      alert('설정이 성공적으로 저장되었습니다!');
    } catch (error) {
      alert('저장 실패: ' + error.message);
    }
  };

  // 사진 관리 로직
  const handleUpload = async (e, slotId) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fileName = `slot_${slotId}_${Date.now()}.${file.name.split('.').pop()}`;
    try {
      await supabase.storage.from('activities').upload(fileName, file, { upsert: true });
      const { data: { publicUrl } } = supabase.storage.from('activities').getPublicUrl(fileName);
      await supabase.from('activity_images').update({ image_url: publicUrl, updated_at: new Date() }).eq('id', slotId);
      alert(`${slotId}번 사진 등록 완료!`);
      fetchImages();
    } catch (error) {
      alert(`업로드 실패: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImg = async (slotId) => {
    if (!confirm(`${slotId}번 사진을 삭제하시겠습니까?`)) return;
    await supabase.from('activity_images').update({ image_url: null }).eq('id', slotId);
    fetchImages();
  };

  if (!isLoggedIn) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-black/40 p-8 rounded-2xl border border-red-950 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-red-600 mb-2">JEOGUN ADMIN</h1>
            <p className="text-gray-400 text-sm">적운 조직 관리자 보안 인증</p>
          </div>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input type="text" maxLength={6} placeholder="000000" className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-center text-white text-2xl tracking-[0.5em] focus:border-red-500 transition-all outline-none" value={code} onChange={(e) => setCode(e.target.value)} />
            <button type="submit" className="w-full py-4 bg-red-800/80 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(204,0,0,0.4)]">접속</button>
          </form>
          {statusMsg && <p className="text-red-400 text-sm text-center mt-6 bg-red-950/30 p-3 rounded-lg border border-red-900/30">{statusMsg}</p>}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative z-10 container mx-auto px-4 py-16 min-h-screen">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-black/40 p-6 sm:p-10 rounded-2xl border border-red-900/50 backdrop-blur-xl space-y-12">
        
        {/* 상단 타이틀 및 로그아웃 */}
        <div className="flex justify-between items-center border-b border-red-900/40 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">적운 관리자 패널</h2>
            <p className="text-gray-400 text-sm mt-1">지원서 관리, 팩션 소개글 및 조직도 설정</p>
          </div>
          <button onClick={() => { setIsLoggedIn(false); setCode(''); }} className="px-4 py-2 border border-red-900/50 text-red-400 hover:bg-red-900/30 rounded-lg text-sm font-bold transition-colors">로그아웃</button>
        </div>

        {/* 1. 팩션 소개글 수정 섹션 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-red-500 font-bold">팩션 소개글 수정</h3>
            <button onClick={handleSaveSettings} className="bg-red-800/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition">변경사항 저장</button>
          </div>
          <textarea 
            value={settings.intro_text} 
            onChange={(e) => setSettings({...settings, intro_text: e.target.value})}
            className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-4 text-white placeholder-gray-600 focus:border-red-500 outline-none resize-none"
            placeholder="팩션 소개글을 입력하세요..."
          />
        </div>

        {/* 2. 적운 조직도 수정 섹션 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-red-500 font-bold">적운 조직도 수정</h3>
            <button onClick={handleSaveSettings} className="bg-red-800/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition">변경사항 저장</button>
          </div>
          <textarea 
            value={settings.org_chart} 
            onChange={(e) => setSettings({...settings, org_chart: e.target.value})}
            className="w-full h-96 bg-black/50 border border-white/10 rounded-lg p-4 text-zinc-300 font-mono text-sm placeholder-gray-600 focus:border-red-500 outline-none resize-none"
            placeholder="조직도 텍스트를 입력하세요..."
          />
        </div>

        {/* 3. 접수된 지원서 목록 섹션 (삭제 기능 포함) */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-xl text-red-500 font-bold mb-4">접수된 지원서 목록 ({apps.length}건)</h3>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {apps.map((app) => (
              <div key={app.id} className="bg-black/40 border border-white/10 p-5 rounded-xl flex flex-col space-y-3 relative group">
                <button onClick={() => handleDeleteApp(app.id)} className="absolute top-4 right-4 bg-red-900/60 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition">
                  지원서 삭제
                </button>
                <div className="border-b border-white/5 pb-3">
                  <span className="font-bold text-white text-lg">{app.info} <span className="text-sm text-gray-400 font-normal">({app.age_gender})</span></span>
                  <div className="text-xs text-zinc-400 mt-1">접속 IP: {app.ip_address} | 접수일: {new Date(app.created_at).toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300 bg-black/20 p-3 rounded-lg">
                  <p><strong className="text-red-400">지원 계기:</strong> {app.motive}</p>
                  <p><strong className="text-red-400">각오와 포부:</strong> {app.resolution}</p>
                </div>
                <div className="text-xs text-gray-400 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <span>FIVEM 경력: <strong className="text-white">{app.fivem_exp}</strong></span>
                  <span>서버 경력: <strong className="text-white">{app.server_exp}</strong></span>
                  <span>접속률: <strong className="text-white">{app.activity_rate}</strong></span>
                  <span>IC/OOC: <strong className="text-white">{app.ic_ooc_definition}</strong></span>
                </div>
              </div>
            ))}
            {apps.length === 0 && <div className="text-center py-10 text-gray-400">아직 접수된 지원서가 없습니다.</div>}
          </div>
        </div>

        {/* 4. ACTIVITIES 사진 관리 섹션 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-xl text-red-500 font-bold mb-6">ACTIVITIES 사진 관리 (1번~6번 슬롯)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((slotId) => (
              <div key={slotId} className="bg-black/40 p-3 rounded-xl border border-white/10 flex flex-col items-center">
                <span className="text-white font-bold text-sm mb-2">{slotId}번 슬롯</span>
                <div className="w-full aspect-video bg-black/50 mb-3 rounded-lg border border-white/10 relative overflow-hidden flex items-center justify-center">
                  {images[slotId] ? <img src={images[slotId]} className="w-full h-full object-cover" /> : <span className="text-zinc-600 text-xs">이미지 없음</span>}
                </div>
                <div className="flex gap-1 w-full">
                  <label className="flex-1 text-center bg-red-800/80 hover:bg-red-700 text-white py-1.5 rounded text-xs cursor-pointer font-bold">
                    {images[slotId] ? '변경' : '삽입'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, slotId)} disabled={isUploading} />
                  </label>
                  {images[slotId] && <button onClick={() => handleDeleteImg(slotId)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-1.5 rounded text-xs font-bold">삭제</button>}
                </div>
              </div>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
}