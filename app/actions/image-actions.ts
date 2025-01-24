"use server";

import { imageGenerationFormSchema } from "@/components/image-generation/Configuration";
import { z } from "zod";
import Replicate from "replicate";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/database.types";
import { imageMeta } from "image-meta";
import { randomUUID } from "crypto";
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput: false,
});
interface ImageResponse {
  error: string | null;
  success: boolean;
  data: any | null;
}
export async function generateImageAction(
  input: z.infer<typeof imageGenerationFormSchema>
): Promise<ImageResponse> {
  const modalInput = {
    prompt: input.prompt,
    go_fast: true,
    guidance: input.guidance,
    megapixels: "1",
    num_outputs: input.num_outputs,
    aspect_ratio: input.aspect_ratio,
    output_format: input.output_format,
    output_quality: input.output_quality,
    prompt_strength: 0.8,
    num_inference_steps: input.num_inference_steps,
  };
  try {
    const output = await replicate.run(input.model as `${string}/${string}`, {
      input: modalInput,
    });
    //   console.log(output);

    return {
      error: null,
      success: true,
      data: output,
    };
  } catch (error: any) {
    return {
      error: (error.message as string) || "Failed to generate image",
      success: false,
      data: null,
    };
  }
}

export async function imgUrlToBlob(url: string) {
  const response = await fetch(url);
  const blob = (await response).blob();
  return (await blob).arrayBuffer();
}

type storeImageInput = {
  url: string;
} & Database["public"]["Tables"]["generated_images"]["Insert"];

export async function storeImages(data: storeImageInput[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      error: "Unauthorized",
      success: false,
      data: null,
    };
  }

  const uploadResult = [];
  for (const image of data) {
    const arrayBuffer = await imgUrlToBlob(image.url);
    const { width, height, type } = imageMeta(new Uint8Array(arrayBuffer));
    const fileName = `image-${randomUUID()}.${type}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: storageError } = await supabase.storage
      .from("generated_images")
      .upload(filePath, arrayBuffer, {
        contentType: `image/${type}`,
        cacheControl: "3600",
        upsert: false,
      });
    if (storageError) {
      uploadResult.push({
        fileName,
        error: storageError.message,
        success: false,
        data: null,
      });
      continue;
    }

    const { data: dbData, error: dbError } = await supabase
      .from("generated_images")
      .insert([
        {
          user_id: user.id,
          model: image.model,
          prompt: image.prompt,
          aspect_ratio: image.aspect_ratio,
          guidance: image.guidance,
          num_inference_steps: image.num_inference_steps,
          output_format: image.output_format,
          image_name: fileName,
          width,
          height,
        },
      ])
      .select();

    if (dbError) {
      uploadResult.push({
        fileName,
        error: dbError.message,
        success: !dbError,
        data: dbData || null,
      });
    }
  }
  console.log("uploadResult:", uploadResult);
  return {
    error: null,
    success: true,
    data: { resules: uploadResult },
  };
}
