'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function WallpaperList() {
  const [wallpapers, setWallpapers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchWallpapers = async (userId: string) => {
    const { data, error } = await supabase
      .from('wallpapers')
      .select('*')
      .eq('user_id', userId) // 核心：只查当前用户的
      .order('created_at', { ascending: false })
    
    if (data) setWallpapers(data)
    setLoading(false)
  }

  useEffect(() => {
    // 1. 初始化检查登录状态并获取数据
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        fetchWallpapers(user.id)
      } else {
        setLoading(false)
      }
    }
    init()

    // 2. 监听登录状态变化 (防止刷新不出来)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchWallpapers(session.user.id)
      } else {
        setWallpapers([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div className="text-white/20 animate-pulse mt-10">星空加载中...</div>
  if (wallpapers.length === 0) return <div className="text-gray-500 mt-10 italic">暂无收藏壁纸</div>

  return (
    <div className="w-full max-w-6xl px-6 py-12">
      <h2 className="text-xl font-bold text-white mb-8 border-l-4 border-cyan-500 pl-4">我的星空馆</h2>
      
      {/* 响应式 Grid 布局 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wallpapers.map((wp) => (
          <div key={wp.id} className="aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 group relative bg-white/5 shadow-2xl">
            <img 
              src={wp.image_url} 
              alt={wp.prompt}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
            />
            
            {/* 悬停显示的描述层 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <p className="text-xs italic text-gray-200 line-clamp-3 leading-relaxed">
                "{wp.prompt}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}    