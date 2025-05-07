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
          <CarouselItem
            key={dog.id}
            className="group flex justify-center items-center w-full h-full shadow-sm"
          >
            <div className="relative justify-center items-center">
              <Media
                resource={dog.mainImage}
                imgClassName="aspect-[9/12] object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
              />
              {/* Dark to transparent overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-[#1B373E] to-black/0" />
              {/* Overlay Card */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] rounded-xl p-4 flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[#F3F2E8] m-0 text-3xl font-bold font-fraunces">{dog.name}</p>
                  <p className="text-[#F3F2E8] mt-1">{dog.breed}</p>
                </div>
                <div className="flex flex-col">
                  <p className="bg-[#F3F2E8] text-[#1B373E] m-0 text-xs font-semibold text-center px-2 py-1 rounded-full">Adopté le</p>
                  <p className="text-[#F3F2E8] mt-2">
                    {new Date(dog.adoptionDate || '').toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
