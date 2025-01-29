"use client";
import { Tables } from "@/database.types";
import Image from "next/image";
import React, { useState } from "react";
import ImageDialog from "./ImageDialog";

type ImageProps = {
  url: string | undefined;
} & Tables<"generated_images">;

interface GallerProps {
  images: ImageProps[];
}
const GalleryComponent = ({ images }: GallerProps) => {
  const [setselectedImage, setSetselectedImage] = useState<ImageProps | null>(
    null
  );
  console.log("images", images);

  if (images.length === 0) {
    return (
      <div className="text-xl flex items-center justify-center h-[75vh] text-muted-foreground">
        No images to display
      </div>
    );
  }

  return (
    <section className="container flex mx-auto py-8 justify-center items-center px-2 border boreder-muted-foreground rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => {
          return (
            <div
              key={index}
              className="relative group overflow-hidden cursor-pointer transition-transform"
            >
              <div
                className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-70 rounded"
                onClick={() => setSetselectedImage(image)}
              >
                <div className="flex justify-center items-center h-full">
                  <p className="text-primary-foreground text-lg font-semibold">
                    View Details
                  </p>
                </div>
              </div>
              <Image
                src={image.url || ""}
                alt={image.prompt || ""}
                width={image.width || 0}
                height={image.height || 0}
                className="object-cover rounded"
              />
            </div>
          );
        })}
      </div>
      {setselectedImage && (
        <ImageDialog
          image={setselectedImage}
          onClose={() => setSetselectedImage(null)}
        />
      )}
    </section>
  );
};

export default GalleryComponent;
