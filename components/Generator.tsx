'use client';
import { useState } from 'react';
import { saveWallpaper } from '@/app/actions/save-wallpaper'; // 1. 引入保存逻辑

export default function Generator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return alert('请描述你想生成的图片...');
    setLoading(true);
    
    try {
      // --- 第一步：调用 API 生成图片 ---
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();

      if (data.url) {
        // 更新 UI 显示图片
        setImageUrl(data.url);

        // --- 第二步：核心改动 —— 图片生成成功后立刻存入数据库 ---
        const saveResult = await saveWallpaper(prompt, data.url);
        
        if (!saveResult.success) {
          // 如果保存失败（比如没登录），弹窗提醒，但图片依然显示在页面上
          alert(saveResult.message);
        } else {
          console.log('数据已成功入库');
        }

      } else {
        alert(data.error || '生成失败');
      }
    } catch (err) {
      alert('网络连接错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-3xl flex flex-col items-center px-6 z-10">
      <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">壁纸生成器</h1>
      <p className="text-gray-400 mb-12 tracking-widest uppercase text-xs">Unleash Your Imagination Through Words</p>

      <div className="w-full flex items-center gap-6 mb-12">
        <textarea 
          className="flex-1 h-28 p-6 bg-white/5 border border-white/10 rounded-[2rem] focus:outline-none focus:border-cyan-500/50 transition-all placeholder-gray-500 backdrop-blur-lg shadow-2xl text-white"
          placeholder="请描述你想生成的图片..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        
        <div className="relative flex items-center justify-center">
          {loading && <div className="progress-ring absolute"></div>}
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-14 h-14 bg-white/10 border border-white/20 rounded-full text-[10px] font-bold hover:bg-cyan-500 hover:text-black transition-all z-10 disabled:opacity-50"
          >
            {loading ? '生成中' : '生成'}
          </button>
        </div>
      </div>

      <div className="w-full aspect-[16/9] bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-[3rem] mb-16 flex flex-col items-center justify-center text-gray-500 group overflow-hidden relative">
        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {imageUrl ? (
          <img src={imageUrl} alt="Generated" className="w-full h-full object-cover rounded-[3rem]" />
        ) : (
          <p className="z-10 tracking-widest">图片生成区域</p>
        )}
      </div>
    </main>
  );
}