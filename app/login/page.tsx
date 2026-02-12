'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // 统一的处理函数
  const handleAuth = async (type: 'login' | 'signup') => {
    setLoading(true)
    
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) {
      alert(type === 'login' ? "登录失败: " + error.message : "注册失败: " + error.message)
    } else {
      if (type === 'signup') {
        alert("注册成功！现在请点击登录进入。")
      } else {
        router.push('/')
        router.refresh()
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
      <div className="p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-8 text-center tracking-widest text-yellow-400">ASTRA LOGIN</h2>
        
        <div className="space-y-4">
          <input 
            type="email" placeholder="邮箱地址" required
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-yellow-400/50 transition-all"
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="密码" required
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-yellow-400/50 transition-all"
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          <div className="flex flex-col gap-4 mt-4">
            <button 
              onClick={() => handleAuth('login')}
              disabled={loading}
              className="w-full py-4 bg-yellow-400 text-black font-black rounded-2xl hover:bg-yellow-500 transition shadow-lg shadow-yellow-400/20 disabled:opacity-50"
            >
              {loading ? '处理中...' : '立即进入'}
            </button>
            
            <button 
              onClick={() => handleAuth('signup')}
              disabled={loading}
              className="w-full py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition"
            >
              第一次来？点此注册
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}