'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Generator from '@/components/Generator';
import WallpaperList from '@/components/WallpaperList'; // 确保引入了

export default function Home() {
  return (
    <div className="min-h-screen text-white flex flex-col items-center relative bg-[#0a0e17] overflow-x-hidden">
      {/* 100% 还原您的星空底层 */}
      <div className="stars-container"></div>

      <Header />
      
      {/* 这里的容器改为 flex-col，并移除 items-center 的垂直居中限制 */}
      <div className="w-full flex-grow flex flex-col items-center py-10">
        
        {/* 生成器区域 */}
        <section className="min-h-[70vh] flex items-center justify-center w-full">
          <Generator />
        </section>

        {/* 画廊展示区域：就在生成器下方 */}
        <section className="w-full bg-black/20 backdrop-blur-sm py-20 flex justify-center">
          <WallpaperList />
        </section>

      </div>

      <Footer />
    </div>
  );
}