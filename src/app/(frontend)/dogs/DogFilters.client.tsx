'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Check, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utilities/ui'

// Interfaces
export interface DogFilterProps {
  dogs: any[] // This prop might be used for deriving uniqueBreeds, or uniqueBreeds can be fetched/passed differently
  // onFiltersChange: (filteredDogs: any[]) => void // No longer needed
}

export default function DogFilters({ dogs }: DogFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get unique breeds from all dogs (consider if this is still the best way or if breeds should be a separate prop/fetch)
  const uniqueBreeds = [...new Set(dogs.map((dog) => dog.breed).filter(Boolean))].sort()

  const getInitialFilters = useCallback(() => {
    return {
      breeds: searchParams.get('breeds')?.split(',').filter(Boolean) || [],
      sex: searchParams.get('sex')?.split(',').filter(Boolean) || [],
      goodWith: {
        kids: (searchParams.get('goodWithKids') as string | null) || null,
        dogs: (searchParams.get('goodWithDogs') as string | null) || null,
        cats: (searchParams.get('goodWithCats') as string | null) || null,
      },
    }
  }, [searchParams])

  // State for filters, initialized from URL
  const [filters, setFilters] = useState(getInitialFilters())

  // Update internal filter state if URL searchParams change (e.g., browser back/forward)
  useEffect(() => {
    setFilters(getInitialFilters())
  }, [searchParams, getInitialFilters])

  // Function to update URL params
  const updateURLParams = (newFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newFilters.breeds.length > 0) {
      params.set('breeds', newFilters.breeds.join(','))
    } else {
      params.delete('breeds')
    }

    if (newFilters.sex.length > 0) {
      params.set('sex', newFilters.sex.join(','))
    } else {
      params.delete('sex')
    }

    if (newFilters.goodWith.kids) {
      params.set('goodWithKids', newFilters.goodWith.kids)
    } else {
      params.delete('goodWithKids')
    }
    if (newFilters.goodWith.dogs) {
      params.set('goodWithDogs', newFilters.goodWith.dogs)
    } else {
      params.delete('goodWithDogs')
    }
    if (newFilters.goodWith.cats) {
      params.set('goodWithCats', newFilters.goodWith.cats)
    } else {
      params.delete('goodWithCats')
    }

    params.delete('page') // Reset to page 1 when filters change
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Count active filters
  const activeFilterCount =
    filters.breeds.length +
    filters.sex.length +
    (filters.goodWith.kids ? 1 : 0) +
    (filters.goodWith.dogs ? 1 : 0) +
    (filters.goodWith.cats ? 1 : 0)

  // Toggle a breed filter
  const toggleBreed = (breed: string) => {
    setFilters((prev) => {
      const newBreeds = prev.breeds.includes(breed)
        ? prev.breeds.filter((b) => b !== breed)
        : [...prev.breeds, breed]
      const newFilters = { ...prev, breeds: newBreeds }
      updateURLParams(newFilters)
      return newFilters
    })
  }

  // Toggle a sex filter
  const toggleSex = (sex: string) => {
    setFilters((prev) => {
      const newSex = prev.sex.includes(sex) ? prev.sex.filter((s) => s !== sex) : [...prev.sex, sex]
      const newFilters = { ...prev, sex: newSex }
      updateURLParams(newFilters)
      return newFilters
    })
  }

  // Set compatibility filter
  const setGoodWith = (type: 'kids' | 'dogs' | 'cats', value: string | null) => {
    setFilters((prev) => {
      const newGoodWithValue = prev.goodWith[type] === value ? null : value
      const newFilters = {
        ...prev,
        goodWith: {
          ...prev.goodWith,
          [type]: newGoodWithValue,
        },
      }
      updateURLParams(newFilters)
      return newFilters
    })
  }

  // Reset all filters
  const resetFilters = () => {
    const clearedFilters = {
      breeds: [],
      sex: [],
      goodWith: {
        kids: null,
        dogs: null,
        cats: null,
      },
    }
    setFilters(clearedFilters)

    const params = new URLSearchParams(searchParams.toString())
    params.delete('breeds')
    params.delete('sex')
    params.delete('goodWithKids')
    params.delete('goodWithDogs')
    params.delete('goodWithCats')
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Remove a specific filter (this will call the toggle/set functions which update URL)
  const removeFilter = (type: string, value: string) => {
    if (type === 'breed') {
      toggleBreed(value)
    } else if (type === 'sex') {
      toggleSex(value)
    } else if (type === 'kids' || type === 'dogs' || type === 'cats') {
      // For goodWith, 'value' is the current 'yes', setting to null removes it
      setGoodWith(type as 'kids' | 'dogs' | 'cats', null)
    }
  }

  // Listen for reset event from parent component - This might be removable if reset is handled internally
  useEffect(() => {
    const handleReset = () => {
      resetFilters()
    }

    window.addEventListener('reset-dog-filters', handleReset)
    return () => {
      window.removeEventListener('reset-dog-filters', handleReset)
    }
  }, []) // resetFilters dependency might be needed if it's not stable

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Breed Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              Race
              <ChevronDown className="ml-2 h-4 w-4" />
              {filters.breeds.length > 0 && (
                <Badge className="ml-2 bg-primary text-xs" variant="default">
                  {filters.breeds.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <div className="max-h-[300px] overflow-auto p-2">
              {uniqueBreeds.map((breed) => (
                <div key={breed} className="flex items-center py-1">
                  <Checkbox
                    id={`breed-${breed}`}
                    checked={filters.breeds.includes(breed)}
                    onCheckedChange={() => toggleBreed(breed)}
                  />
                  <label
                    htmlFor={`breed-${breed}`}
                    className="ml-2 cursor-pointer text-sm flex-grow"
                  >
                    {breed}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Sex Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              Sexe
              <ChevronDown className="ml-2 h-4 w-4" />
              {filters.sex.length > 0 && (
                <Badge className="ml-2 bg-primary text-xs" variant="default">
                  {filters.sex.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <div className="p-2">
              <div className="flex items-center py-1">
                <Checkbox
                  id="sex-male"
                  checked={filters.sex.includes('male')}
                  onCheckedChange={() => toggleSex('male')}
                />
                <label htmlFor="sex-male" className="ml-2 cursor-pointer text-sm">
                  Mâle
                </label>
              </div>
              <div className="flex items-center py-1">
                <Checkbox
                  id="sex-female"
                  checked={filters.sex.includes('female')}
                  onCheckedChange={() => toggleSex('female')}
                />
                <label htmlFor="sex-female" className="ml-2 cursor-pointer text-sm">
                  Femelle
                </label>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Compatibility Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              Compatibilité
              <ChevronDown className="ml-2 h-4 w-4" />
              {(filters.goodWith.kids || filters.goodWith.dogs || filters.goodWith.cats) && (
                <Badge className="ml-2 bg-primary text-xs" variant="default">
                  {(filters.goodWith.kids ? 1 : 0) +
                    (filters.goodWith.dogs ? 1 : 0) +
                    (filters.goodWith.cats ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0" align="start">
            <div className="p-2">
              <div className="mb-2">
                <div className="flex items-center py-1">
                  <Checkbox
                    id="kids-yes"
                    checked={filters.goodWith.kids === 'yes'}
                    onCheckedChange={() => setGoodWith('kids', 'yes')}
                  />
                  <label htmlFor="kids-yes" className="ml-2 cursor-pointer text-sm">
                    Bon avec les enfants
                  </label>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center py-1">
                  <Checkbox
                    id="dogs-yes"
                    checked={filters.goodWith.dogs === 'yes'}
                    onCheckedChange={() => setGoodWith('dogs', 'yes')}
                  />
                  <label htmlFor="dogs-yes" className="ml-2 cursor-pointer text-sm">
                    Bon avec les chiens
                  </label>
                </div>
              </div>

              <div>
                <div className="flex items-center py-1">
                  <Checkbox
                    id="cats-yes"
                    checked={filters.goodWith.cats === 'yes'}
                    onCheckedChange={() => setGoodWith('cats', 'yes')}
                  />
                  <label htmlFor="cats-yes" className="ml-2 cursor-pointer text-sm">
                    Bon avec les chats
                  </label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Reset Filters Button - only show if there are active filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            className="h-10 px-3 text-muted-foreground"
            onClick={resetFilters}
          >
            Réinitialiser
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1 pt-2">
          {filters.breeds.map((breed) => (
            <Badge key={`badge-breed-${breed}`} variant="secondary" className="pl-2">
              {breed}
              <button
                className="ml-1 rounded-full hover:bg-muted inline-flex items-center justify-center w-4 h-4"
                onClick={() => removeFilter('breed', breed)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {filters.sex.map((sex) => (
            <Badge key={`badge-sex-${sex}`} variant="secondary" className="pl-2">
              {sex === 'male' ? 'Mâle' : 'Femelle'}
              <button
                className="ml-1 rounded-full hover:bg-muted inline-flex items-center justify-center w-4 h-4"
                onClick={() => removeFilter('sex', sex)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {filters.goodWith.kids === 'yes' && (
            <Badge key="badge-kids" variant="secondary" className="pl-2">
              Bon avec les enfants
              <button
                className="ml-1 rounded-full hover:bg-muted inline-flex items-center justify-center w-4 h-4"
                onClick={() => removeFilter('kids', filters.goodWith.kids)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.goodWith.dogs === 'yes' && (
            <Badge key="badge-dogs" variant="secondary" className="pl-2">
              Bon avec les chiens
              <button
                className="ml-1 rounded-full hover:bg-muted inline-flex items-center justify-center w-4 h-4"
                onClick={() => removeFilter('dogs', filters.goodWith.dogs)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.goodWith.cats === 'yes' && (
            <Badge key="badge-cats" variant="secondary" className="pl-2">
              Bon avec les chats
              <button
                className="ml-1 rounded-full hover:bg-muted inline-flex items-center justify-center w-4 h-4"
                onClick={() => removeFilter('cats', filters.goodWith.cats)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
