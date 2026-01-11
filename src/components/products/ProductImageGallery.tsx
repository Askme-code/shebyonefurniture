'use client';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductImageGalleryProps {
  images: Product['images'];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
       <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={cn(
              "relative aspect-square w-20 h-20 shrink-0 rounded-md overflow-hidden border-2 transition-colors",
              selectedImage.url === image.url ? "border-primary" : "border-transparent"
            )}
          >
            <Image
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
              data-ai-hint={image.hint}
            />
          </button>
        ))}
      </div>
      <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
        <Image
          src={selectedImage.url}
          alt="Main product"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          data-ai-hint={selectedImage.hint}
        />
      </div>
    </div>
  );
}
