import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
        // 保留你要求的 any 类型，修复 forEach 解构核心错误
        setAll(cookiesToSet: any) {
          try {
            // 关键修复：forEach 回调的参数必须用 {} 解构（你之前漏了）
            cookiesToSet?.forEach(({ name, value, options }: any) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // 仅在 Server Actions/Route Handler 外报错时忽略，补充明确注释
            // Server Components 中无法设置 Cookie，此错误属于预期情况
            console.error('Cookie 设置失败（Server Components 中可忽略）：', error)
          }
        },
      },
    }
  )
}