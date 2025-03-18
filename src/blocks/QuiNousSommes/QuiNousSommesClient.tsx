'use client'

import React, { useState, useEffect } from 'react'
import { DogHouseIcon } from '@/components/icons'
import { formatDateTime } from '@/utilities/formatDateTime'
import { motion } from "motion/react"

interface AdoptedDog {
  id: string
  name: string
  slug: string
  status: string
  breed: string
  mainImage: {
    url: string
    alt: string
  }
  adoptionDate?: string
  adoptionFamily?: string
  successStory?: {
    id: string
    adoptionDate: string
    family: string
  }
}

interface QuiNousSommesClientProps {
  adoptionLimit: number
}

export const QuiNousSommesClient: React.FC<QuiNousSommesClientProps> = ({ 
  adoptionLimit = 4 
}) => {
  const [adoptedDogs, setAdoptedDogs] = useState<AdoptedDog[]>([]);
  const [currentDog, setCurrentDog] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdoptedDogs = async () => {
      try {
        const response = await fetch(`/api/dogs?where[status][equals]=adopted&limit=${adoptionLimit}&sort=-updatedAt&depth=1`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch adopted dogs');
        }
        
        const data = await response.json();
        setAdoptedDogs(data.docs || []);
      } catch (error) {
        console.error('Error fetching adopted dogs:', error);
        // Fallback data if API call fails
        setAdoptedDogs([
          {
            id: '1',
            name: 'Max',
            slug: 'max',
            status: 'adopted',
            breed: 'Labrador',
            mainImage: {
              url: '/media/most-beautiful-dog-breeds-300x169.jpg',
              alt: 'Max'
            },
            successStory: {
              id: '1',
              adoptionDate: new Date().toISOString(),
              family: 'Famille Dubois'
            }
          },
          {
            id: '2',
            name: 'Bella',
            slug: 'bella',
            status: 'adopted',
            breed: 'Berger Allemand',
            mainImage: {
              url: '/media/c952118d-52be-482f-b04b-662a71c1b70b-300x400.jpg',
              alt: 'Bella'
            },
            successStory: {
              id: '2',
              adoptionDate: new Date().toISOString(),
              family: 'Famille Martin'
            }
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdoptedDogs();
  }, [adoptionLimit]);

  // Rotate through dogs every 5 seconds
  useEffect(() => {
    if (adoptedDogs.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentDog(prev => (prev + 1) % adoptedDogs.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [adoptedDogs.length]);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-amber-100/50 h-[500px] md:h-[550px] flex items-center justify-center max-w-[360px] md:max-w-[420px] mx-auto">
        <span className="animate-pulse">Chargement des adoptions...</span>
      </div>
    );
  }

  if (adoptedDogs.length === 0) {
    return (
      <div className="rounded-xl bg-amber-100/50 h-[500px] md:h-[550px] flex items-center justify-center max-w-[360px] md:max-w-[420px] mx-auto">
        <DogHouseIcon width={64} height={64} className="text-amber-300" />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg h-[500px] md:h-[550px] bg-amber-100/20 max-w-[360px] md:max-w-[420px] mx-auto transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:rotate-1 group">
      {/* Decorative elements */}
      <div className="absolute -top-12 -left-8 w-24 h-24 rounded-full bg-amber-100/40 z-0"></div>
      <div className="absolute -bottom-12 -right-8 w-24 h-24 rounded-full bg-amber-100/40 z-0"></div>
      
      {adoptedDogs.map((dog, index) => (
        <motion.div
          key={dog.id}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: index === currentDog ? 1 : 0,
            scale: index === currentDog ? 1 : 1.05 
          }}
          transition={{ duration: 0.7 }}
        >
          {/* Status badge */}
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-[#26483B] text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
              Adopté
            </div>
          </div>
          
          {/* Background image with gradient overlay */}
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
            <div className="h-full w-full flex items-center justify-center overflow-hidden">
              <img 
                src={`${dog.mainImage.url}?w=600`}
                alt={dog.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/10"></div>
          </div>
          
          {/* Dog information overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: index === currentDog ? 0 : 20, 
                opacity: index === currentDog ? 1 : 0 
              }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col"
            >
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h3 className="text-3xl font-bold mb-1 text-white group-hover:text-amber-200 transition-colors">{dog.name}</h3>
                  <p className="text-lg opacity-90 mb-1">{dog.breed}</p>
                </div>

                {(dog.adoptionDate || dog.successStory?.adoptionDate) && (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ 
                      x: index === currentDog ? 0 : 20, 
                      opacity: index === currentDog ? 1 : 0 
                    }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="flex-shrink-0 ml-4"
                  >
                    <div className="bg-gradient-to-r from-[#26483B] to-[#1c3529] text-white text-sm px-4 py-2 rounded-lg border border-white/10 shadow-md">
                      <div className="text-xs uppercase font-medium text-amber-200 mb-1 tracking-wide">Adopté le</div>
                      <div className="font-medium">
                        {formatDateTime({
                          date: new Date(dog.adoptionDate || dog.successStory?.adoptionDate || ''),
                          options: {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {(dog.adoptionFamily || dog.successStory?.family) && (
                <div className="flex items-center mt-2 bg-[#26483B]/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#26483B]/90" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <p className="text-sm">
                    Famille {dog.adoptionFamily || dog.successStory?.family}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      ))}
      
      {/* Dots indicator */}
      {adoptedDogs.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {adoptedDogs.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentDog 
                  ? 'bg-amber-400 scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => setCurrentDog(index)}
              aria-label={`View dog ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}