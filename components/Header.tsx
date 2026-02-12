'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    // 检查是否有登录用户
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    
    // 监听登录/退出状态，实时更新界面
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="w-full p-8 flex justify-between items-center z-10">
      <div className="text-white font-bold tracking-widest">ASTRA GEN</div>
      <div className="flex gap-6 items-center">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-yellow-400 text-sm italic">HI, {user.email.split('@')[0]}</span>
            <button onClick={() => supabase.auth.signOut()} className="text-white/40 text-xs hover:text-white">EXIT</button>
          </div>
        ) : (
          <Link href="/login" className="bg-white text-black px-6 py-2 rounded-full font-bold text-xs">LOGIN</Link>
        )}
      </div>
    </header>
  )
}