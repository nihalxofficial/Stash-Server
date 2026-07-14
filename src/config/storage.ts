// src/config/storage.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_PUBLISHABLE_KEY as string
);

export const uploadFile = async (buffer: Buffer, key: string, contentType: string) => {
  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET as string)
    .upload(key, buffer, { contentType });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from(process.env.SUPABASE_BUCKET as string)
    .getPublicUrl(key);

  return data.publicUrl;
};