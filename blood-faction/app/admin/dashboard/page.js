'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // 본인의 supabase 설정 파일 경로에 맞게 수정

export default function ActivityAdminManager() {
  const [images, setImages] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  // 1. 기존 이미지 데이터 불러오기
  const fetchImages = async () => {
    const { data, error } = await supabase.from('activity_images').select('*').order('id', { ascending: true });
    if (data) {
      const imageMap = {};
      data.forEach(item => { imageMap[item.id] = item.image_url; });
      setImages(imageMap);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // 2. 이미지 업로드 (삽입/변경)
  const handleUpload = async (e, slotId) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `slot_${slotId}_${Date.now()}.${fileExt}`;

    try {
      // Storage에 파일 업로드
      const { error: uploadError } = await supabase.storage
        .from('activities')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Public URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('activities')
        .getPublicUrl(fileName);

      // DB 업데이트
      const { error: dbError } = await supabase
        .from('activity_images')
        .update({ image_url: publicUrl, updated_at: new Date() })
        .eq('id', slotId);

      if (dbError) throw dbError;

      alert(`${slotId}번 사진이 등록/변경되었습니다.`);
      fetchImages(); // 화면 새로고침
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 3. 이미지 삭제
  const handleDelete = async (slotId) => {
    if (!confirm(`${slotId}번 사진을 삭제하시겠습니까?`)) return;

    try {
      const { error } = await supabase
        .from('activity_images')
        .update({ image_url: null, updated_at: new Date() })
        .eq('id', slotId);

      if (error) throw error;
      
      alert('삭제되었습니다.');
      fetchImages();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  return (
    <div className="p-6 bg-[#0a0a0a] border border-red-900/30 rounded-lg mt-8">
      <h2 className="text-xl font-bold text-red-600 mb-6">ACTIVITIES (활동 기록) 사진 관리</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((slotId) => (
          <div key={slotId} className="bg-zinc-900 p-4 rounded-md border border-zinc-800 flex flex-col items-center">
            <h3 className="text-white mb-4">{slotId}번 슬롯</h3>
            
            {/* 사진 미리보기 영역 */}
            <div className="w-full h-32 bg-black flex items-center justify-center overflow-hidden mb-4 rounded border border-zinc-700">
              {images[slotId] ? (
                <img src={images[slotId]} alt={`slot_${slotId}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-zinc-600 text-sm">이미지 없음</span>
              )}
            </div>

            {/* 관리 버튼 영역 */}
            <div className="flex gap-2 w-full">
              <label className="flex-1 text-center bg-red-900/80 hover:bg-red-800 text-white py-2 rounded cursor-pointer text-sm transition">
                {isUploading ? '처리중...' : (images[slotId] ? '변경' : '삽입')}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleUpload(e, slotId)} 
                  disabled={isUploading}
                />
              </label>
              
              {images[slotId] && (
                <button 
                  onClick={() => handleDelete(slotId)}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded text-sm transition"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}