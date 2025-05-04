'use client'

import React from 'react'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dog } from '@/payload-types'
import { Media } from '@/components/Media'

export const DogCard = ({ dog }: { dog: Dog }) => {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent>
        <div className="aspect-square">
          <Media resource={dog.mainImage} imgClassName="aspect-square object-cover rounded-2xl" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-col items-center justify-center">
            <p className="font-medium text-3xl font-fraunces text-center">{dog.name}</p>
            <p className="text-center -mt-2">{dog.breed}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
