'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Media } from '@/components/Media'
import DogFilters from './DogFilters.client'

export interface Dog {
  id?: string
  name: string
  breed: string
  sex: string
  status: string
  mainImage: any
  slug?: string
  age?: {
    years: number
    months: number
  } | string
  goodWith?: {
    kids: string
    dogs: string
    cats: string
  }
}

interface DogsGridProps {
  dogs: Dog[]
}

export default function DogsGrid({ dogs }: DogsGridProps) {
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>(dogs)
  const [filters, setFilters] = useState({})
  
  // Reset filters function for the empty state
  const resetFilters = () => {
    setFilteredDogs(dogs)
    // Need to trigger the filter reset in DogFilters component
    const event = new CustomEvent('reset-dog-filters')
    window.dispatchEvent(event)
  }
  
  return (
    <>
      <DogFilters dogs={dogs} onFiltersChange={setFilteredDogs} />
      
      {filteredDogs.length === 0 ? (
        <div className="text-center py-16 px-6 border border-dashed border-muted-foreground/20 rounded-xl bg-muted/30">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Aucun chien ne correspond à vos critères</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">Veuillez essayer d'autres filtres ou moins de critères pour voir plus de résultats.</p>
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
                    <div 
                      className={`absolute top-4 right-4 px-4 py-1.5 text-xs font-semibold rounded-full shadow-md ${
                        dog.status === 'available' ? 'bg-green-500 text-white' : 
                        dog.status === 'pending' ? 'bg-yellow-500 text-white' : 
                        dog.status === 'foster' ? 'bg-blue-500 text-white' : 
                        dog.status === 'medical' ? 'bg-red-500 text-white' : 
                        'bg-gray-500 text-white'
                      }`}
                    >
                      {dog.status === 'available' ? 'Disponible' : 
                       dog.status === 'pending' ? 'Adoption en cours' : 
                       dog.status === 'foster' ? 'Famille d\'accueil' : 
                       dog.status === 'medical' ? 'Soins médicaux' : 
                       'Adopté'}
                    </div>
                    
                    {/* Quick Stats - Bottom */}
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
                  </div>
                ) : (
                  <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground">
                    <span>Image non disponible</span>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors">{dog.name}</h2>
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
              {(dog.status === 'available' || dog.status === 'disponible') && (
                <div 
                  className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (dog.id) {
                      window.location.href = `/adopt/application/${dog.id}`;
                    }
                  }}
                >
                  <div className={`flex justify-center items-center px-4 py-1.5 bg-flame text-white text-xs font-semibold rounded-full shadow-lg hover:bg-flame/90 transition-colors ${!dog.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                    Adopter {dog.name}
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-8 text-center">
        {filteredDogs.length < dogs.length ? (
          <div className="inline-flex items-center px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
            <span className="font-medium text-primary mr-1">{filteredDogs.length}</span> chien{filteredDogs.length !== 1 ? 's' : ''} affichés sur {dogs.length} disponibles
          </div>
        ) : (
          <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-800 rounded-full text-sm">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Affichage de tous les <span className="font-medium mx-1">{dogs.length}</span> chiens disponibles
          </div>
        )}
      </div>
    </>
  )
}