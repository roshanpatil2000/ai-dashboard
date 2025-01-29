import { getImages } from "@/app/actions/image-actions";
import GalleryComponent from "@/components/gallery/GalleryComponent";
import Header from "@/components/Header";
import React from "react";

const Gallery = async () => {
  const { data: imags } = await getImages();
  return (
    <section className="container mx-auto`">
      <Header title="Gallery" subtitle="View your generated images" />
      <GalleryComponent images={imags || []} />
    </section>
  );
};

export default Gallery;
