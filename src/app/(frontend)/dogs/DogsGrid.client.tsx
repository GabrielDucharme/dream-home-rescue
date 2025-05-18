'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import { Media } from '@/components/Media'
import DogFilters from './DogFilters.client'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export interface Dog {
  id?: string
  name: string
  breed: string
  sex: string
  status: string
  mainImage: any
  slug?: string
  age?:
    | {
        years: number
        months: number
      }
    | string
  goodWith?: {
    kids: string
    dogs: string
    cats: string
  }
}

interface PaginationData {
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

interface DogsGridProps {
  dogs: Dog[]
  pagination?: PaginationData
}

export default function DogsGrid({ dogs, pagination }: DogsGridProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>(dogs)
  const [filters, setFilters] = useState({})

  // Reset filters function for the empty state
  const resetFilters = () => {
    setFilteredDogs(dogs)
    // Need to trigger the filter reset in DogFilters component
    const event = new CustomEvent('reset-dog-filters')
    window.dispatchEvent(event)
  }

  // Create page navigation links
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    if (!pagination) return []

    const { page, totalPages } = pagination
    const delta = 1 // Number of pages to show before and after current page
    const pages: (number | null)[] = []

    // Always show first page
    pages.push(1)

    // Calculate range of pages to show around current page
    const rangeStart = Math.max(2, page - delta)
    const rangeEnd = Math.min(totalPages - 1, page + delta)

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push(null) // null represents ellipsis
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i)
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push(null)
    }

    // Always show last page if different from first
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <>
      <DogFilters dogs={dogs} onFiltersChange={setFilteredDogs} />

      {dogs.length === 0 ? (
        <div className="text-center py-16 px-6 border border-dashed border-muted-foreground/20 rounded-xl bg-muted/30">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Aucun chien disponible à l'adoption</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            Nous n'avons pas de chiens disponibles à l'adoption pour le moment. Veuillez revenir
            plus tard ou nous contacter directement pour plus d'informations.
          </p>
        </div>
      ) : filteredDogs.length === 0 ? (
        <div className="text-center py-16 px-6 border border-dashed border-muted-foreground/20 rounded-xl bg-muted/30">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Aucun chien ne correspond à vos critères</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            Veuillez essayer d'autres filtres ou moins de critères pour voir plus de résultats.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredDogs.map((dog) => (
            <Link
              key={dog.id || `dog-${dog.slug}`}
              href={dog.slug ? `/dogs/${dog.slug}` : `/dogs/${dog.id}`}
              className="group overflow-hidden flex flex-col h-full relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative">
                {dog.mainImage && typeof dog.mainImage !== 'string' ? (
                  <div className="relative aspect-square overflow-hidden">
                    <Media
                      resource={dog.mainImage}
                      alt={dog.name}
                      imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fill
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Status Badge - Top Right */}
                    <div className="absolute top-4 right-4 px-4 py-1.5 text-xs font-semibold rounded-full shadow-md bg-green-500 text-white">
                      Disponible
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground">
                    <span>Image non disponible</span>
                  </div>
                )}

                {/* Quick Stats - Bottom */}
                {dog.mainImage && typeof dog.mainImage !== 'string' && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
                        {dog.sex === 'male' ? 'Mâle' : 'Femelle'}
                      </span>
                      {dog.age && (
                        <span className="rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
                          {typeof dog.age === 'object'
                            ? `${dog.age.years || 0} an${dog.age.years !== 1 ? 's' : ''} ${dog.age.months && dog.age.months > 0 ? `${dog.age.months} m` : ''}`
                            : dog.age}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {dog.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">{dog.breed}</p>
                  </div>
                </div>

                {/* Compatibility Icons */}
                {dog.goodWith && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {dog.goodWith.kids === 'yes' && (
                      <span className="inline-flex items-center text-xs bg-green-50 text-green-700 py-1.5 px-3 rounded-full border border-green-100">
                        <Check className="w-3 h-3 mr-1.5" /> Enfants
                      </span>
                    )}
                    {dog.goodWith.dogs === 'yes' && (
                      <span className="inline-flex items-center text-xs bg-green-50 text-green-700 py-1.5 px-3 rounded-full border border-green-100">
                        <Check className="w-3 h-3 mr-1.5" /> Chiens
                      </span>
                    )}
                    {dog.goodWith.cats === 'yes' && (
                      <span className="inline-flex items-center text-xs bg-green-50 text-green-700 py-1.5 px-3 rounded-full border border-green-100">
                        <Check className="w-3 h-3 mr-1.5" /> Chats
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-5 text-center">
                  <div className="inline-flex items-center justify-center px-5 py-2.5 bg-primary/10 text-primary text-sm font-medium rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    Voir le profil
                  </div>
                </div>
              </div>

              {/* Adopt Button - Absolutely positioned at the top left */}
              <div
                className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (dog.id) {
                    window.location.href = `/adopt/application/${dog.id}`
                  }
                }}
              >
                <div
                  className={`flex justify-center items-center px-4 py-1.5 bg-flame text-white text-xs font-semibold rounded-full shadow-lg hover:bg-flame/90 transition-colors ${!dog.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  Adopter {dog.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        {filteredDogs.length < dogs.length ? (
          <div className="inline-flex items-center px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
            <span className="font-medium text-primary mr-1">{filteredDogs.length}</span> chien
            {filteredDogs.length !== 1 ? 's' : ''} affichés sur {dogs.length} disponibles
          </div>
        ) : (
          <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-800 rounded-full text-sm">
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Affichage de tous les <span className="font-medium mx-1">{dogs.length}</span> chiens
            disponibles
          </div>
        )}
      </div>

      {/* Pagination Component */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-10">
          <Pagination>
            <PaginationContent>
              {pagination.hasPrevPage && (
                <PaginationItem>
                  <PaginationPrevious href={createPageURL(pagination.prevPage || 1)} />
                </PaginationItem>
              )}

              {getPageNumbers().map((pageNum, index) =>
                pageNum === null ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`page-${pageNum}`}>
                    <PaginationLink
                      href={createPageURL(pageNum)}
                      isActive={pageNum === pagination.page}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              {pagination.hasNextPage && (
                <PaginationItem>
                  <PaginationNext
                    href={createPageURL(pagination.nextPage || pagination.totalPages)}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  )
}
