"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Slider } from "@/components/ui/slider";

import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Info } from "lucide-react";
import { generateImageAction } from "@/app/actions/image-actions";
import useGenetatedStore from "@/store/useGenetatedStore";

export const imageGenerationFormSchema = z.object({
  model: z.string({
    required_error: "model is required",
  }),
  prompt: z.string({
    required_error: "prompt is required",
  }),
  guidance: z.number({
    required_error: "guidance scale is required",
  }),
  num_outputs: z
    .number()
    .min(1, {
      message: "number of outputs should be atleast 1",
    })
    .max(4, {
      message: "number of outputs should be less than and equals to 4",
    }),
  aspect_ratio: z.string({
    required_error: "aspect_ratio is required",
  }),
  output_format: z.string({
    required_error: "output_format is required",
  }),
  output_quality: z
    .number()
    .min(1, {
      message: "output quality  should be atleast 1",
    })
    .max(100, {
      message: "output quality should be less than and equals to 100",
    }),
  num_inference_steps: z
    .number()
    .min(1, {
      message: "Number of inference steps should be atleast 1",
    })
    .max(50, {
      message:
        "Number of inference steps should be less than and equals to 100",
    }),
});

const Configuration = () => {
  const generateImage = useGenetatedStore((state) => state.generateImage);

  const form = useForm<z.infer<typeof imageGenerationFormSchema>>({
    resolver: zodResolver(imageGenerationFormSchema),
    defaultValues: {
      model: "black-forest-labs/flux-schnell",
      prompt: "",
      guidance: 3.5,
      num_outputs: 1,
      output_format: "png",
      aspect_ratio: "1:1",
      output_quality: 80,
      num_inference_steps: 4,
    },
  });

  useEffect(() => {
    const suscription = form.watch((value, { name }) => {
      if (name === "model") {
        let newSteps;
        if (value.model === "black-forest-labs/flux-schnell") {
          newSteps = 4;
        } else {
          newSteps = 28;
        }
        if (newSteps !== undefined) {
          form.setValue("num_inference_steps", newSteps);
        }
      }

      return () => suscription.unsubscribe();
    });
  }, [form]);

  async function onSubmit(values: z.infer<typeof imageGenerationFormSchema>) {
    await generateImage(values);
  }

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <fieldset className="grid gap-6 p-4 bg-background rounded-lg border">
            <legend className="text-sm -ml-1 px-1 font-medium">Settings</legend>

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Model
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>You can select any model from the dropdown</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model " />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="black-forest-labs/flux-schnell">
                        Flux Schnell
                      </SelectItem>
                      <SelectItem value="black-forest-labs/flux-dev">
                        Flux Dev
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="aspect_ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Aspect Ratio
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Aspect Ratio for gnerate images</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Aspect Ratio " />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1:1">1:1</SelectItem>
                        <SelectItem value="16:9">16:9</SelectItem>
                        <SelectItem value="9:16">9:16</SelectItem>
                        <SelectItem value="21:9">21:9</SelectItem>
                        <SelectItem value="9:21">9:21</SelectItem>
                        <SelectItem value="4:5">4:5</SelectItem>
                        <SelectItem value="5:4">5:4</SelectItem>
                        <SelectItem value="4:3">4:3</SelectItem>
                        <SelectItem value="3:4">3:4</SelectItem>
                        <SelectItem value="2:3">2:3</SelectItem>
                        <SelectItem value="3:2">3:2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="num_outputs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      No. of Outputs{" "}
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            total number of output images to generate. Choise
                            between 1 to 4
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={4}
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* row 3 */}
            <FormField
              control={form.control}
              name="guidance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center justify-between">
                      <div>
                        guidance
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Prompt guidance. Higher values give more creative
                              results
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p>{field.value}</p>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      min={0}
                      max={10}
                      step={0.5}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* row 4 */}
            <FormField
              control={form.control}
              name="num_inference_steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center justify-between">
                      <div>
                        Number of Inference Step
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              No. of denoising steps. Recommended range is 28-50
                              for dev model and 1-4 for schnell model
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p>{field.value}</p>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      min={0}
                      max={
                        form.getValues("model") ===
                        "black-forest-labs/flux-schnell"
                          ? 4
                          : 50
                      }
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* row 5 */}
            <FormField
              control={form.control}
              name="output_quality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center justify-between">
                      <div>
                        Output Quality
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Quality when saving the output image. 100 for best
                              quality 0 for lowest quality.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p>{field.value}</p>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      min={50}
                      max={100}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* row 6 */}
            <FormField
              control={form.control}
              name="output_format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Output Format
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Format of the output image. PNG, JPEG, WebP</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Output format " />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* row 7 */}
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Prompt
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Prompt for generating image.</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter prompt to generate image..."
                      rows={6}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="font-medium w-full">
              Generate
            </Button>
          </fieldset>
        </form>
      </Form>
    </TooltipProvider>
  );
};

export default Configuration;
