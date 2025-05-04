import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { RefactorHomeIntroBlock as RefactorHomeIntroBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
type Props = RefactorHomeIntroBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
}
export const RefactorHomeIntroBlock: React.FC<Props> = (props) => {
  const { title, description } = props

  return (
    <div className="container py-20 pb-24">
      <h2 className="text-4xl font-bold">{title}</h2>
      <p className="text-lg">
        Chez Dream Home Rescue, niché au cœur des Laurentides à Sainte-Marguerite-du-Lac-Masson,
        nous offrons bien plus qu’un refuge : nous sommes un sanctuaire dédié à la seconde chance.
      </p>
    </div>
  )
}
