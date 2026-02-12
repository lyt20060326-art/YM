'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveWallpaper(prompt: string, imageUrl: string) {
  const supabase = await createClient()

  // 1. 获取当前登录用户信息
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, message: '请先登录后再保存壁纸' }
  }

  // 2. 将数据插入数据库
  const { error: dbError } = await supabase
    .from('wallpapers')
    .insert([
      {
        user_id: user.id,
        prompt: prompt,
        image_url: imageUrl,
      },
    ])

  if (dbError) {
    console.error('Database Error:', dbError)
    return { success: false, message: '保存到数据库失败' }
  }

  // 3. 刷新页面缓存，让新生成的图片立刻出现在列表中
  revalidatePath('/')
  
  return { success: true, message: '壁纸已成功保存到您的收藏' }
}