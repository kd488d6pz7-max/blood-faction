/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  
  // ✨ 왼쪽 아래 N 마크 및 알림 끄기 추가
  devIndicators: {
    appIsrStatus: false, 
    buildActivity: false, 
  },
  
  // 기존 설정 유지
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;