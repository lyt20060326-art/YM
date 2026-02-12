import { createClient } from '@/utils/supabase/client'

export const uploadWallpaper = async (file: File, prompt: string) => {
  const supabase = createClient()
  
  // 1. 上传图片到 Storage 存储桶
  const fileName = `${Date.now()}-${file.name}`
  const { data: storageData, error: storageError } = await supabase.storage
    .from('wallpapers')
    .upload(fileName, file)

  if (storageError) throw storageError

  // 2. 获取图片的公开访问链接
  const { data: { publicUrl } } = supabase.storage
    .from('wallpapers')
    .getPublicUrl(fileName)

  // 3. 将图片信息存入数据库表
  const { data, error } = await supabase
    .from('wallpapers')
    .insert([
      { 
        prompt: prompt, 
        image_url: publicUrl,
        user_id: (await supabase.auth.getUser()).data.user?.id // 需要登录后才能获取
      }
    ])

  return { data, error }
}