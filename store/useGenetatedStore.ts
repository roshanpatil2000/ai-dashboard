import { create } from "zustand";
import { z } from "zod";
import { imageGenerationFormSchema } from "@/components/image-generation/Configuration";
import { generateImageAction, storeImages } from "@/app/actions/image-actions";
import { toast } from "sonner";

interface GenerateState {
  loading: boolean;
  images: Array<{ url: string }>;
  error: String | null;
  generateImage: (
    values: z.infer<typeof imageGenerationFormSchema>
  ) => Promise<void>;
}

const useGenetatedStore = create<GenerateState>((set) => ({
  loading: false,
  images: [],
  error: null,

  generateImage: async (values: z.infer<typeof imageGenerationFormSchema>) => {
    set({ loading: true, error: null });
    const toastId = toast.loading("Generating Image....");
    try {
      const { error, success, data } = await generateImageAction(values);
      if (!success) {
        set({ error: error, loading: false });
        return;
      }
      const dataWithUrl = data.map((url: string) => {
        return {
          url,
          ...values,
        };
      });
      set({ images: dataWithUrl, loading: false });
      toast.success("Image Generated Successfully", { id: toastId });
      await storeImages(dataWithUrl);
      toast.success("Image Stored Successfully", { id: toastId });
    } catch (error) {
      set({
        error: "Failed to generate image, Please try again",
        loading: false,
      });
    }
  },
}));
export default useGenetatedStore;
