'use client'

import React from 'react'
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Heart, Users, Dog, Cat, Calendar, Scale, Ruler, MapPin, Sparkles } from 'lucide-react'

// Type definition for dog data
interface DogData {
  id: string
  name: string
  breed: string
  sex: 'male' | 'female'
  status: 'available' | 'pending' | 'adopted' | 'foster' | 'medical'
  mainImage: any
  slug: string
  age?: {
    years: number
    months?: number
  }
  size?: 'small' | 'medium' | 'large'
  weight?: number
  goodWith?: {
    kids?: 'yes' | 'no' | 'unknown'
    dogs?: 'yes' | 'no' | 'unknown'
    cats?: 'yes' | 'no' | 'unknown'
  }
  adoptionDate?: string
}

interface DogsCarouselProps {
  dogs: DogData[]
}

// Helper function to format age
const formatAge = (age?: { years: number; months?: number }) => {
  if (!age) return ''

  const { years, months = 0 } = age

  if (years === 0) {
    return months === 1 ? '1 mois' : `${months} mois`
  } else if (years === 1 && months === 0) {
    return '1 an'
  } else if (months === 0) {
    return `${years} ans`
  } else {
    return `${years} an${years > 1 ? 's' : ''} ${months} mois`
  }
}

// Enhanced helper function to get status badge info
const getStatusBadge = (status: string, adoptionDate?: string) => {
  const statusConfig: Record<
    string,
    { label: string; color: string; bgColor: string; icon?: any }
  > = {
    available: {
      label: 'Disponible',
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      icon: Sparkles,
    },
    pending: {
      label: 'En cours',
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
    },
    adopted: {
      label: 'Adopté',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      icon: Heart,
    },
    foster: {
      label: "Famille d'accueil",
      color: 'text-purple-700',
      bgColor: 'bg-purple-100',
    },
    medical: {
      label: 'Soins médicaux',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
    },
  }

  return statusConfig[status] || { label: status, color: 'text-gray-700', bgColor: 'bg-gray-100' }
}

// Helper function to get size label
const getSizeLabel = (size?: string) => {
  const sizeLabels: Record<string, string> = {
    small: 'Petit',
    medium: 'Moyen',
    large: 'Grand',
  }
  return size ? sizeLabels[size] || size : ''
}

export const DogsCarousel = ({ dogs }: DogsCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="relative mx-auto w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {dogs.map((dog, index) => {
          const statusBadge = getStatusBadge(dog.status, dog.adoptionDate)
          const ageText = formatAge(dog.age)
          const sizeLabel = getSizeLabel(dog.size)

          return (
            <CarouselItem
              key={dog.id || `dog-${index}`}
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-2 md:pl-4"
            >
              <Link
                href={`/dogs/${dog.slug}`}
                className="group block overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full"
              >
                {/* Image Section */}
                {dog.mainImage && typeof dog.mainImage !== 'string' && (
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                    <ImageMedia
                      resource={dog.mainImage}
                      alt={dog.name}
                      imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      fill
                    />

                    {/* Gradient overlay for better badge visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Status badge - enhanced design */}
                    <div className="absolute top-3 right-3">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 ${statusBadge.bgColor} ${statusBadge.color} text-xs font-semibold rounded-full shadow-md backdrop-blur-sm`}
                      >
                        {statusBadge.icon && <statusBadge.icon className="w-3 h-3" />}
                        {statusBadge.label}
                      </div>
                    </div>

                    {/* Compatibility badges - improved layout */}
                    {dog.goodWith &&
                      (dog.goodWith.kids === 'yes' ||
                        dog.goodWith.dogs === 'yes' ||
                        dog.goodWith.cats === 'yes') && (
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex flex-wrap gap-1.5">
                            {dog.goodWith.kids === 'yes' && (
                              <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md flex items-center gap-1 hover:scale-105 transition-transform">
                                <Users className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-xs font-medium text-gray-700">Enfants</span>
                              </div>
                            )}
                            {dog.goodWith.dogs === 'yes' && (
                              <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md flex items-center gap-1 hover:scale-105 transition-transform">
                                <Dog className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-xs font-medium text-gray-700">Chiens</span>
                              </div>
                            )}
                            {dog.goodWith.cats === 'yes' && (
                              <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md flex items-center gap-1 hover:scale-105 transition-transform">
                                <Cat className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-xs font-medium text-gray-700">Chats</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* Content Section - refined spacing and typography */}
                <div className="p-4 space-y-3">
                  {/* Name and breed section - enhanced hierarchy */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {dog.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1.5">
                      <span className="font-medium">{dog.breed}</span>
                      <span className="text-gray-400">•</span>
                      <span
                        className={`inline-flex items-center gap-1 ${dog.sex === 'male' ? 'text-blue-600' : 'text-pink-600'}`}
                      >
                        {dog.sex === 'male' ? '♂ Mâle' : '♀ Femelle'}
                      </span>
                    </p>
                  </div>

                  {/* Details section - improved grid layout */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    {/* Age */}
                    {ageText && (
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-7 h-7 bg-amber-100 rounded-lg">
                          <Calendar className="w-3.5 h-3.5 text-amber-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{ageText}</p>
                        </div>
                      </div>
                    )}

                    {/* Size and Weight - compact layout */}
                    {(sizeLabel || dog.weight) && (
                      <div className="flex items-center gap-3">
                        {sizeLabel && (
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="flex items-center justify-center w-7 h-7 bg-blue-100 rounded-lg flex-shrink-0">
                              <Ruler className="w-3.5 h-3.5 text-blue-700" />
                            </div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {sizeLabel}
                            </p>
                          </div>
                        )}

                        {dog.weight && (
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="flex items-center justify-center w-7 h-7 bg-green-100 rounded-lg flex-shrink-0">
                              <Scale className="w-3.5 h-3.5 text-green-700" />
                            </div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {dog.weight} lbs
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Call to action - subtle but clear */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700">
                        En savoir plus →
                      </span>
                      {dog.status === 'available' && (
                        <Heart className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          )
        })}
      </CarouselContent>

      {/* Enhanced carousel controls */}
      <CarouselPrevious className="left-2 w-10 h-10 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white border-gray-200" />
      <CarouselNext className="right-2 w-10 h-10 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white border-gray-200" />
    </Carousel>
  )
}
