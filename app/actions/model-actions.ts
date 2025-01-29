"use server";

import { supaebaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function getPresignedStorageUrl(filepath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: urlData, error } = await supaebaseAdmin.storage
    .from("training_data")
    .createSignedUploadUrl(`${user?.id}/${new Date().getTime()}_${filepath}`);

  return {
    signedUrl: urlData?.signedUrl || "",
    error: error?.message || null,
  };
}
