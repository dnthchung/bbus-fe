'use client'

//url file : /fe/src/components/mine/imageCarousel.tsx
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

const images = ['/images/2.jpg', '/images/3.jpg', '/images/4.jpg', '/images/5.jpg', '/images/2023-12-04.jpg']

export function ImageCarousel() {
  return (
    <Carousel className='w-full max-w-[500px]'>
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index} className='p-2'>
            <div className='overflow-hidden rounded-xl shadow-md'>
              <img src={src} alt={`Slide ${index + 1}`} className='h-auto w-full rounded-xl object-cover' />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
