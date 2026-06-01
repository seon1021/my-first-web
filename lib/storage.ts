import { supabase } from './supabase'

// 업로드 후 public URL을 반환
export async function uploadAvatarFile(file: File, userId: string): Promise<string | null> {
  const bucket = 'avatars'
  const ext = file.name.split('.').pop()
  const filePath = `${userId}/avatar.${ext}`

  try {
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error('storage.upload error:', uploadError)
      return null
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath)
    return publicData.publicUrl || null
  } catch (err) {
    console.error('uploadAvatarFile unexpected error:', err)
    return null
  }
}

export async function uploadPostImage(file: File, postId: string): Promise<string | null> {
  const bucket = 'posts'
  const ext = file.name.split('.').pop()
  const filePath = `${postId}/image.${ext}`

  try {
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error('uploadPostImage storage.upload error:', uploadError)
      return null
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath)
    return publicData.publicUrl || null
  } catch (err) {
    console.error('uploadPostImage unexpected error:', err)
    return null
  }
}
