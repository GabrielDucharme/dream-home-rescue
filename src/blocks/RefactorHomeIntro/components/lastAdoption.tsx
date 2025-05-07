'use client'

import { Media } from '@/components/Media'
import { Dog } from '@/payload-types'
import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

export const LastAdoption = ({ latestAdoptedDogs }: { latestAdoptedDogs: Dog[] }) => {
  return (
    <Carousel
      className="w-full"
      plugins={[
        Autoplay({
          delay: 3000,
          stopOnInteraction: true,
        }),
      ]}
      opts={{
        align: 'center',
        loop: true,
      }}
    >
      <CarouselContent>
        {latestAdoptedDogs.map((dog: Dog) => (
          <CarouselItem key={dog.id} className="group flex justify-center items-center w-full">
            <div className="relative flex justify-center items-center">
              <Media
                resource={dog.mainImage}
                imgClassName="aspect-square object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay Card */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-white/90 rounded-xl px-6 py-4 flex items-center justify-between gap-4 backdrop-blur-md border border-blue-100">
                <div className="flex flex-col">
                  <p className="text-3xl font-extrabold font-fraunces text-blue-900 leading-tight">
                    {dog.name}
                  </p>
                  <p className="text-lg text-blue-700 font-medium">{dog.breed}</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-1">
                    Adopté le
                  </span>
                  <span className="text-blue-900 text-sm font-semibold">
                    {new Date(dog.adoptionDate || '').toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
