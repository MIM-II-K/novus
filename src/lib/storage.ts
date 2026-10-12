
import { supabase, isSupabaseConfigured } from './supabase';

const BUCKET = 'lumniscate-images';

export function getPreviewImageUrl(filename: string): string {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(`previews/${filename}`);

      if (data?.publicUrl) {
        return data.publicUrl;
      }
    } catch (err) {
      console.warn('Failed to resolve Supabase storage image URL for', filename, err);
    }
  }

  // Fallback to local asset preview path
  return `/src/assets/images/${filename}`;
}
