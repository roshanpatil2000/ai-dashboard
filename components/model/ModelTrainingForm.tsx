"use client";
import React, { useId } from "react";
import { z } from "zod";

const ACCEPTED_ZIP_FORMATS = [
  "application/x-zip-compressed",
  "application/zip",
];
const MAX_FILE_SIZE = 45 * 1024 * 1024;

const formSchema = z.object({
  modelName: z
    .string({ required_error: "Model name is required" })
    .min(2)
    .max(50),
  geneder: z.enum(["man", "women"], { required_error: "Gender is required" }),
  zipFile: z
    .any({ required_error: "file is required" })

    .refine((files) => files?.[0] instanceof File, "Please select a valid file")
    .refine(
      (files) =>
        files?.[0].type && ACCEPTED_ZIP_FORMATS.includes(files?.[0].type),
      "only zip files are allowed"
    )
    .refine(
      (files) => files?.[0].size <= MAX_FILE_SIZE,
      "File size should be less than 45 mb"
    ),
});
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getPresignedStorageUrl } from "@/app/actions/model-actions";
const ModelTrainingForm = () => {
  const toadstId = useId();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelName: "",
      geneder: "man",
      zipFile: undefined,
    },
  });

  const fileRef = form.register("zipFile");
  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Uploading the image...", { id: toadstId });
    try {
      const data = await getPresignedStorageUrl(values.zipFile[0].name);
      console.log(data);
      if (data.error) {
        toast.error(data.error, { id: toadstId });
        return;
      }

      const urlResponse = await fetch(data.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": values.zipFile[0].type,
        },
        body: values.zipFile[0],
      });

      if (!urlResponse.ok) {
        throw new Error("Failed to upload file");
      }
      const res = await urlResponse.json();

      toast.success("File uploaded successfully", { id: toadstId });
      console.log(res);

      const formData = new FormData();
      formData.append("filekey", res.Key);
      formData.append("modalName", values.modelName);
      formData.append("gender", values.geneder);
      const response = await fetch("/api/train", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || result?.error) {
        throw new Error(result?.error || "Failed to start training");
      }
      toast.success(
        "Training started successfully, you will get nofication once training is completed",
        {
          id: toadstId,
        }
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start training";
      toast.error(errorMessage, { id: toadstId, duration: 5000 });
    }
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <fieldset className="grid max-w-5xl bg-background p-8 rounded-lg gap-6 border">
          {/* <legend className="text-sm -ml-1 px-1 font-medium">
            {"How to Train Model"}
          </legend> */}
          <FormField
            control={form.control}
            name="modelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ModalName</FormLabel>
                <FormControl>
                  <Input placeholder="Enter modal name" {...field} />
                </FormControl>
                <FormDescription>
                  This will be name your trained modal.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="geneder"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Please select gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="man" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="women" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipFile"
            render={() => (
              <FormItem>
                <FormLabel>
                  Traning data (Zip file){" "}
                  <span className="text-destructive">
                    read the requirment below
                  </span>
                </FormLabel>
                <div className="mb-4 ml-6 rounded-lg shadow-sm pb-4 text-card-foreground">
                  <ul className="space-y-2 text-sm text-muted-foreground list-decimal">
                    <li>Provide 10, 12 or 15 images in total</li>
                    <li>Ideal breakdown for 12 images:</li>
                    <ul className=" ml-5 space-y-1 list-disc">
                      <li>6 face closeups</li>
                      <li>3/4 half body closeups (till stomach)</li>
                      <li>2/3 full body shots</li>
                    </ul>
                    <li>No accessories on face/head ideally</li>
                    <li>No other people in images</li>
                    <li>
                      Different expressions, clothing, backgrounds with good
                      lighting
                    </li>
                    <li>
                      Images to be in 1:1 resolution (1048x1048 or higher)
                    </li>
                    <li>
                      Use images of similar age group (ideally within past few
                      months)
                    </li>
                    <li>Provide only zip file (under 45MB size)</li>
                  </ul>
                </div>
                <FormControl>
                  <Input
                    type="file"
                    accept=".zip"
                    placeholder="Enter modal name"
                    // {...field}
                    // onChange={(e) => field.onChange(e.target.files?.[0])}
                    {...fileRef}
                  />
                </FormControl>
                <FormDescription>
                  Upload a zip file containing your training images (max 45 MB).
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-fit">
            Submit
          </Button>
        </fieldset>
      </form>
    </Form>
  );
};

export default ModelTrainingForm;
