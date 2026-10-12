
import { supabase } from './supabase';

const BUCKET = 'lumniscate-images';

export function getPreviewImageUrl(filename: string): string {
  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(`previews/${filename}`);

  return data.publicUrl;
}
