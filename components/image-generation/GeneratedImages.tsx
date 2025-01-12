"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const images = [
  {
    src: "/hero-images/Charismatic Young Man with a Warm Smile and Stylish Tousled Hair.jpeg",
    alt: "Charismatic Young Man with a Warm Smile and Stylish Tousled Hair",
  },
  {
    src: "/hero-images/Confident Businesswoman on Turquoise Backdrop.jpeg",
    alt: "Confident Businesswoman on Turquoise Backdrop",
  },
  {
    src: "/hero-images/Confident Woman in Red Outfit.jpeg",
    alt: "Confident Woman in Red Outfit",
  },
];
const GeneratedImages = () => {
  if (images.length === 0) {
    return (
      <Card className="w-full max-w-2xl bg-muted">
        <CardContent className="flex aspect-square items-center justify-center p-6">
          <span className="text-2xl">No images generated</span>
        </CardContent>
      </Card>
    );
  }
  return (
    <Carousel className="w-full max-w-2xl bg-muted">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="flex relative items-center justify-center rounded-lg overflow-hidden aspect-square">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="w-full h-full object-contain"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default GeneratedImages;
