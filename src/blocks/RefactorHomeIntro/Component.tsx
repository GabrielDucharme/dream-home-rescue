'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { RefactorHomeIntroBlock as RefactorHomeIntroBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { LastAdoption } from './components/lastAdoption'
import { PawPrint, HeartHandshake, Users } from 'lucide-react'
import { DogHouseIcon, PawIcon, DogBoneIcon } from '@/components/icons'
import Link from 'next/link'

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
    link: '/dogs',
  },
  {
    button: 'Faites un don',
    icon: HeartHandshake,
    link: '/donate',
  },
  {
    button: 'Devenez bénévole',
    icon: Users,
    link: '/contact',
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
    <div className="bg-gradient-to-b from-[#FDEFBB] to-transparent">
      <div className="container py-20 pb-24">
        <div className="flex flex-col md:flex-row bg-white/60 rounded-xl shadow-md">
          <div className="w-full flex flex-col lg:items-center align-middle lg:flex-row gap-4 p-4 md:p-8">
            <div className="md:w-2/3">
              <div className="flex flex-col gap-4 max-w-2xl">
                <div className="flex items-center gap-4">
                  <DogHouseIcon
                    width={18}
                    height={18}
                    className="text-[#26483B] opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-float animation-delay-300"
                  />
                  <PawIcon
                    width={16}
                    height={16}
                    className="text-[#26483B] opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-bounce"
                  />
                  <DogBoneIcon
                    width={18}
                    height={16}
                    className="text-[#26483B] opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-float animation-delay-600"
                  />
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold text-[#1B373E]">{title}</h2>
                <div className="flex flex-col gap-2 text-[#051436] text-justify">
                  <p className="">
                    Chez Dream Home Rescue, situé au cœur des Laurentides à
                    Sainte-Marguerite-du-Lac-Masson, nous sommes un sanctuaire où chaque chien
                    reçoit les soins vétérinaires et l&apos;amour nécessaires pour commencer une
                    nouvelle vie.
                  </p>
                  <p>
                    Nous croyons profondément à l&apos;adoption responsable : nous veillons à ce que
                    chaque foyer corresponde parfaitement aux besoins de nos chiens, que ce soit
                    dans les Laurentides, à Montréal ou ailleurs au Québec.
                  </p>
                  <p>
                    Adopter, devenir bénévole ou faire un don, c&apos;est participer directement au
                    sauvetage de ces chiens en détresse. Ensemble, transformons leur histoire en une
                    belle aventure remplie d&apos;amour.
                  </p>
                  <div className="flex gap-2 w-full mt-8 flex-wrap">
                    {CardsData.map(({ button, icon: Icon, link }, idx) => (
                      <Button
                        key={idx}
                        className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold shadow transition"
                        variant="default"
                        size="default"
                        asChild
                      >
                        <Link href={link}>
                          <Icon className="w-5 h-5" />
                          {button}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-lg mt-8 md:mt-0">
              <LastAdoption latestAdoptedDogs={latestAdoptedDogs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
