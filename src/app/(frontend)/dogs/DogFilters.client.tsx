'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Check, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utilities/ui'

// Interfaces
export interface DogFilterProps {
  dogs: any[]
  onFiltersChange: (filteredDogs: any[]) => void
}

export default function DogFilters({ dogs, onFiltersChange }: DogFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get unique breeds from all dogs
  const uniqueBreeds = [...new Set(dogs.map((dog) => dog.breed))].sort()

  // State for filters
  const [filters, setFilters] = useState({
    breeds: [] as string[],
    sex: [] as string[],
    goodWith: {
      kids: null as string | null,
      dogs: null as string | null,
      cats: null as string | null,
    },
  })

  // Count active filters
  const activeFilterCount =
    filters.breeds.length +
    filters.sex.length +
    (filters.goodWith.kids ? 1 : 0) +
    (filters.goodWith.dogs ? 1 : 0) +
    (filters.goodWith.cats ? 1 : 0)

  // Apply filters whenever filters change
  useEffect(() => {
    const filteredDogs = dogs.filter((dog) => {
      // Filter by breed if any breeds are selected
      if (filters.breeds.length > 0 && !filters.breeds.includes(dog.breed)) {
        return false
      }

      // Filter by sex if any sexes are selected
      if (filters.sex.length > 0 && !filters.sex.includes(dog.sex)) {
        return false
      }

      // Filter by compatibility with kids
      if (filters.goodWith.kids && dog.goodWith?.kids !== filters.goodWith.kids) {
        return false
      }

      // Filter by compatibility with dogs
      if (filters.goodWith.dogs && dog.goodWith?.dogs !== filters.goodWith.dogs) {
        return false
      }

      // Filter by compatibility with cats
      if (filters.goodWith.cats && dog.goodWith?.cats !== filters.goodWith.cats) {
        return false
      }

      return true
    })

    onFiltersChange(filteredDogs)

    // Reset to page 1 when filters change, but only if there are active filters
    if (activeFilterCount > 0) {
      // Reset to page 1 when filters are applied
      const params = new URLSearchParams(searchParams.toString())
      params.delete('page') // Remove the page parameter to go back to page 1
      router.push(`${pathname}?${params.toString()}`)
    }
  }, [filters, dogs, onFiltersChange, activeFilterCount, router, pathname, searchParams])

  // Listen for reset event from parent component
  useEffect(() => {
    const handleReset = () => {
      resetFilters()
    }

    window.addEventListener('reset-dog-filters', handleReset)
    return () => {
      window.removeEventListener('reset-dog-filters', handleReset)
    }
  }, [])

  // Toggle a breed filter
  const toggleBreed = (breed: string) => {
    setFilters((prev) => {
      const newBreeds = prev.breeds.includes(breed)
        ? prev.breeds.filter((b) => b !== breed)
        : [...prev.breeds, breed]

      return {
        ...prev,
        breeds: newBreeds,
      }
    })
  }

  // Toggle a sex filter
  const toggleSex = (sex: string) => {
    setFilters((prev) => {
      const newSex = prev.sex.includes(sex) ? prev.sex.filter((s) => s !== sex) : [...prev.sex, sex]

      return {
        ...prev,
        sex: newSex,
      }
    })
  }

  // Set compatibility filter
  const setGoodWith = (type: 'kids' | 'dogs' | 'cats', value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      goodWith: {
        ...prev.goodWith,
        [type]: prev.goodWith[type] === value ? null : value,
      },
    }))
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      breeds: [],
      sex: [],
      goodWith: {
        kids: null,
        dogs: null,
        cats: null,
      },
    })

    // Also reset URL to remove pagination params when filters are reset
    if (searchParams.has('page')) {
      router.push(pathname)
    }
  }

  // Remove a specific filter
  const removeFilter = (type: string, value: string) => {
    if (type === 'breed') {
      toggleBreed(value)
    } else if (type === 'sex') {
      toggleSex(value)
    } else if (type === 'kids' || type === 'dogs' || type === 'cats') {
      setGoodWith(type as 'kids' | 'dogs' | 'cats', null)
    }
  }

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
