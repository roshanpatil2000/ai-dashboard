import Configuration from "@/components/image-generation/Configuration";
import GeneratedImages from "@/components/image-generation/GeneratedImages";
import React from "react";

const ImageGeneration = () => {
  return (
    <section className="container mx-auto grid gap-4 p-4 md:grid-cols-3 grid-cols-1">
      {/* Configuration Section */}
      <div className="p-4 bg-white rounded-xl shadow-lg md:col-span-1">
        <Configuration />
      </div>

      {/* Generated Images Section */}
      <div className="col-span-1 md:col-span-2 p-4 rounded-xl flex items-center justify-center h-fit bg-gray-100 shadow-lg">
        <GeneratedImages />
      </div>
    </section>
  );
};

export default ImageGeneration;
