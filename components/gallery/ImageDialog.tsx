import { Tables } from "@/database.types";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { Badge } from "../ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeleteImage from "./DeleteImage";

interface ImageProps {
  image: { url: string | undefined } & Tables<"generated_images">;
  onClose: () => void;
}
const ImageDialog = ({ image, onClose }: ImageProps) => {
  const handleDownload = async () => {
    // const response = await fetch(image.url || "");
    // const blob = (await response).blob();
    fetch(image.url || "").then((response) => {
      response
        .blob()
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `generated-image-${Date.now()}.${image.output_format}`
          );
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);
        })
        .catch((error) => {
          console.log("error", error);
        });
    });
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="max-w-full sm:max-w-xl w-full">
        <SheetHeader>
          <SheetTitle className="text-2xl w-full">Image Details</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col h-[100vh]">
          <div className="relative w-fit h-fit">
            <Image
              src={image.url || ""}
              alt={image.prompt || ""}
              width={image.width || 0}
              height={image.height || 0}
              className="w-full h-auto flex rounded-xl mt-5 mb-3 "
            />

            <div className="flex gap-4 absolute bottom-4  right-4 ">
              <Button
                className="w-fit"
                variant={"default"}
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <DeleteImage
                imageId={image.id.toString()}
                onDelete={onClose}
                className={"w-fit"}
                imageName={image.image_name}
              />
            </div>
          </div>
          <hr className="inline-block w-full border-dotted border-primary/30 mb-2" />
          <p className="text-primary/90 w-full flex flex-col">
            <span className="text-primary text-xl font-semibold">Prompt</span>
            {image.prompt}
          </p>
          <hr className="inline-block w-full border-dotted border-primary/30 my-2" />

          <div className="flex flex-wrap gap-3">
            <Badge
              variant={"secondary"}
              className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal"
            >
              <span className="text-primary uppercase mr-2 font-semibold">
                Modal ID:
              </span>
              {image.model}
            </Badge>
            <Badge
              variant={"secondary"}
              className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal"
            >
              <span className="text-primary uppercase mr-2 font-semibold">
                Aspect Ratio:
              </span>
              {image.aspect_ratio}
            </Badge>
            <Badge
              variant={"secondary"}
              className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal"
            >
              <span className="text-primary uppercase mr-2 font-semibold">
                Dimentions:
              </span>
              {image.width} x {image.height}
            </Badge>
            <Badge
              variant={"secondary"}
              className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal"
            >
              <span className="text-primary uppercase mr-2 font-semibold">
                Guidene:
              </span>
              {image.guidance}
            </Badge>
            <Badge
              variant={"secondary"}
              className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal"
            >
              <span className="text-primary uppercase mr-2 font-semibold">
                Inference steps:
              </span>
              {image.num_inference_steps}
            </Badge>
            <Badge
              variant={"secondary"}
              className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal"
            >
              <span className="text-primary uppercase mr-2 font-semibold">
                Output Format:
              </span>
              {image.output_format}
            </Badge>
            <Badge
              variant={"secondary"}
              className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal"
            >
              <span className="text-primary uppercase mr-2 font-semibold">
                created at:
              </span>
              {new Date(image.created_at).toLocaleDateString()}
            </Badge>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ImageDialog;
