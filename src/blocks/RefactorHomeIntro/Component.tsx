'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { RefactorHomeIntroBlock as RefactorHomeIntroBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { LastAdoption } from './components/lastAdoption'
import { PawPrint, HeartHandshake, Users } from 'lucide-react'

type Props = RefactorHomeIntroBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
}

const CardsData = [
  {
    button: 'Découvrez nos chiens à adopter',
    icon: PawPrint,
  },
  {
    button: 'Faites un don',
    icon: HeartHandshake,
  },
  {
    button: 'Devenez bénévole',
    icon: Users,
  },
]
export const RefactorHomeIntroBlock: React.FC<Props> = async (props) => {
  const { title, description } = props

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
    <div className="container py-20 pb-24">
      <div className="flex flex-col md:flex-row gap-10">
        <div>
          <div className="md:p-12">
            <LastAdoption latestAdoptedDogs={latestAdoptedDogs} />
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 md:items-end">
          <h2 className="text-4xl font-semibold text-balance max-w-2xl">{title}</h2>
          <div className="flex flex-col gap-2 max-w-2xl">
            <p className="">
              Chez Dream Home Rescue, situé au cœur des Laurentides à
              Sainte-Marguerite-du-Lac-Masson, nous sommes un sanctuaire où chaque chien reçoit les
              soins vétérinaires et l&apos;amour nécessaires pour commencer une nouvelle vie.
            </p>
            <p>
              Nous croyons profondément à l&apos;adoption responsable : nous veillons à ce que chaque
              foyer corresponde parfaitement aux besoins de nos chiens, que ce soit dans les
              Laurentides, à Montréal ou ailleurs au Québec.
            </p>
            <p>
              Adopter, devenir bénévole ou faire un don, c&apos;est participer directement au
              sauvetage de ces chiens en détresse. Ensemble, transformons leur histoire en une belle
              aventure remplie d&apos;amour.
            </p>
            <div className="flex gap-2 w-full mt-8">
              {CardsData.map(({ button, icon: Icon }, idx) => (
                <Button
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold shadow transition"
                  variant="default"
                  size="default"
                >
                  <Icon className="w-5 h-5" />
                  {button}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
