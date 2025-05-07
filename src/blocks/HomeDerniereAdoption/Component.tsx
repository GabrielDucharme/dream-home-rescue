import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { HomeDerniereAdoptionBlock as HomeDerniereAdoptionBlockProps } from '@/payload-types'
import { DogCard } from '@/components/DogCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const HomeDerniereAdoptionBlock: React.FC<HomeDerniereAdoptionBlockProps> = async (
  props,
) => {
  const { title } = props
  const payload = await getPayload({ config: configPromise })

  const { docs: latestAdoptedDogs } = await payload.find({
    collection: 'dogs',
    where: {
      status: {
        equals: 'adopted',
      },
    },
    sort: '-adoptionDate',
    limit: 6,
    depth: 1,
  })

  return (
    <div className="container py-16">
      <div className="flex flex-col gap-4 mb-12">
        <h2 className="text-5xl font-bold text-center">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {latestAdoptedDogs.map((dog) => (
          <DogCard key={dog.id} dog={dog} />
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <Link href="/success-stories">
          <Button
            variant="default"
            size="lg"
            withArrow
            className="font-medium bg-[#051436] text-white text-lg"
          >
            Voir tous les chiens adoptés
          </Button>
        </Link>
      </div>
    </div>
  )
}
