'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ApplyPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({ 
    info: '', ageGender: '', rpDefinition: '', nonRpDefinition: '', 
    badRpDefinition: '', icOocDefinition: '', fivemExp: '', 
    serverExp: '', activityRate: '', motive: '', resolution: '' 
  });
  
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('전송 중...');
    
    const res = await fetch('/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setStatus('지원서가 성공적으로 전송되었습니다.');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      setStatus('전송에 실패했습니다. 관리자에게 문의하세요.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* ✨ 1. 배경 이미지 투명도를 높여서 이미지가 훨씬 선명하게 보이도록 수정 */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center blur-[6px] scale-105 opacity-90 pointer-events-none"
        style={{ backgroundImage: "url('/img.png')" }} 
      />
      {/* ✨ 2. 너무 어두웠던 검은색 오버레이를 가볍게 줄여서 밝은 톤 유지 */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/40 via-black/10 to-black/50 pointer-events-none" />

      {/* 3. 지원서 폼 영역 */}
      <div className="relative z-10 flex-grow flex items-center justify-center py-12 px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          /* ✨ 폼 배경을 밝은 반투명(white/5)으로 변경하여 화사한 유리 질감 극대화 */
          className="w-full max-w-3xl bg-white/5 p-6 sm:p-10 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl mt-4"
        >
          <div className="mb-10 text-center border-b border-white/10 pb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 drop-shadow-lg">
              블러드 조직 지원서
            </h2>
            <div className="text-gray-200 text-sm sm:text-base space-y-2 text-left bg-black/30 border border-white/10 p-6 rounded-xl inline-block backdrop-blur-md shadow-inner">
              <p className="font-bold text-red-400 mb-3 text-lg border-b border-white/10 pb-2">필수 자격 요건</p>
              <p>1. 나이 17세 이상 (10년생 이상)</p>
              <p>2. RP 지식이 빠삭하신 분</p>
              <p>3. 철새, 여미새, 남미새가 아니신 분</p>
              <p>4. 상명하복이 가능 하신 분</p>
              <p>5. 접률이 좋으신 분</p>
              <p>6. 즐겁게 팩션 활동 하면서 열심히 하실 분</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-100 mb-2 font-semibold drop-shadow-md">고유번호 및 인게임 이름 *</label>
                <input 
                  type="text" required name="info" placeholder="예: 1234 홍길동"
                  /* ✨ 입력창도 뒷배경이 살짝 비치는 반투명 블랙으로 변경 */
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/40 transition-all backdrop-blur-sm shadow-inner"
                  value={formData.info} onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-100 mb-2 font-semibold drop-shadow-md">나이 및 성별 *</label>
                <input 
                  type="text" required name="ageGender" placeholder="예: 20세, 남"
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/40 transition-all backdrop-blur-sm shadow-inner"
                  value={formData.ageGender} onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-100 mb-2 font-semibold drop-shadow-md">RP 정의 및 예시 5가지 (기본적인 예시는 탈락) *</label>
              <textarea 
                required name="rpDefinition" rows="3"
                className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/40 resize-none transition-all backdrop-blur-sm shadow-inner"
                value={formData.rpDefinition} onChange={handleChange}
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-100 mb-2 font-semibold drop-shadow-md">Non-RP 정의 및 예시 5가지 *</label>
              <textarea 
                required name="nonRpDefinition" rows="3"
                className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/40 resize-none transition-all backdrop-blur-sm shadow-inner"
                value={formData.nonRpDefinition} onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-100 mb-2 font-semibold drop-shadow-md">Bad-RP 정의 및 예시 5가지 *</label>
              <textarea 
                required name="badRpDefinition" rows="3"
                className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/40 resize-none transition-all backdrop-blur-sm shadow-inner"
                value={formData.badRpDefinition} onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-100 mb-2 font-semibold drop-shadow-md">IC & OOC 뜻 *</label>
              <input 
                type="text" required name="icOocDefinition"
                className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/40 transition-all backdrop-blur-sm shadow-inner"
                value={formData.icOocDefinition} onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-100 mb-2 font-semibold drop-shadow-md">FIVEM 경력 *</label>
                <input 
                  type="text" required name="fivemExp" placeholder="예: 1년"
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/40 transition-all backdrop-blur-sm shadow-inner"
                  value={formData.fivemExp} onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-100 mb-2 font-semibold drop-shadow-md">서버 경력 *</label>
                <input 
                  type="text" required name="serverExp" placeholder="예: 3개월"
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/40 transition-all backdrop-blur-sm shadow-inner"
                  value={formData.serverExp} onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-100 mb-2 font-semibold drop-shadow-md">접속률 *</label>
                <input 
                  type="text" required name="activityRate" placeholder="예: 주 5일"
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/40 transition-all backdrop-blur-sm shadow-inner"
                  value={formData.activityRate} onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-100 mb-2 font-semibold drop-shadow-md">블러드을 지원하게 된 계기 *</label>
              <textarea 
                required name="motive" rows="2"
                className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/40 resize-none transition-all backdrop-blur-sm shadow-inner"
                value={formData.motive} onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-100 mb-2 font-semibold drop-shadow-md">각오와 포부 *</label>
              <textarea 
                required name="resolution" rows="3"
                className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-black/40 resize-none transition-all backdrop-blur-sm shadow-inner"
                value={formData.resolution} onChange={handleChange}
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full py-4 mt-8 bg-red-600/90 hover:bg-red-500 text-white text-lg font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] backdrop-blur-md"
            >
              블러드 조직 지원서 제출하기
            </button>
            
            {status && (
              <p className={`text-center mt-4 font-bold drop-shadow-md ${status.includes('성공') ? 'text-green-400' : 'text-red-400'}`}>
                {status}
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </>
  );
}