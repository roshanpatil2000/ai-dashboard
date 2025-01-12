import Configuration from "@/components/image-generation/Configuration";
import GeneratedImages from "@/components/image-generation/GeneratedImages";
import React from "react";

const ImageGeneration = () => {
  return (
    <section className="container mx-auto grid gap-4 grid-cols-3 overflow-hidden p-4">
      <Configuration />
      <div className="col-span-2 p-4 rounded-xl flex items-center justify-center h-fit">
        <GeneratedImages />
      </div>
    </section>
  );
};

export default ImageGeneration;
