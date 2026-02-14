import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
// 导入 Supabase 官方 Cookie 类型，替代 any，更规范
import type { CookieOptions } from '@supabase/ssr'

// 定义 cookiesToSet 的精确类型，避免 any 同时解决类型报错
type SupabaseCookie = {
  name: string
  value: string
  options: CookieOptions
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // 显式标注精确类型，解决 TypeScript 隐式 any 报错
        setAll(cookiesToSet: SupabaseCookie[]) {
          try {
            // 空值保护 + 正确解构，避免运行时报错
            cookiesToSet?.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // Cloudflare Pages 环境下的友好日志
            console.error('设置 Supabase Cookie 失败:', error)
          }
        },
      },
    }
  )
}