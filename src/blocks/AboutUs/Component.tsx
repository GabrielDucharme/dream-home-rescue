import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { VideoPlayer } from './VideoPlayer.client'
import { DogHouseIcon, DogBoneIcon, PawIcon } from '@/components/icons'
import { WaveDivider } from '@/components/Divider'


import type { AboutUsBlock } from '@/payload-types'

export const AboutUsBlock: React.FC<AboutUsBlock> = (props) => {
  const { 
    mainHeading = 'Notre mission est de fournir amour, soins et secondes chances aux chiens dans le besoin.', 
    supportingStatement = 'Nous sommes une équipe dévouée d\'amoureux des animaux qui travaille pour secourir, réhabiliter et reloger des chiens de toutes races, tailles et origines.',
    detailedDescription,
    teamMembers = [],
    coreValuesStatement = 'Fondé par des amoureux des animaux dédiés au bien-être des chiens, nous nous efforçons de créer un environnement sûr et nourrissant où chaque chien peut se sentir aimé et valorisé.',
    mediaType = 'image',
    image,
    videoUrl,
    videoThumbnail,
    displayButton = true, 
    buttonText = 'Rejoignez-nous', 
    buttonLink = '/a-propos',
  } = props

  return (
    <div className="pt-20 pb-28 relative mt-16" style={{ background: 'linear-gradient(180deg, #ECE0CE 0%, rgba(236, 224, 206, 0) 100%)' }}>
      <WaveDivider 
        fillColor="#ECE0CE" 
        position="top" 
        height={70}
        className="-mt-16"
      />
      
      <div className="container">
        <div className="flex flex-col items-center">
          <div className="text-center mb-8 max-w-3xl mx-auto relative">
            <div className="flex justify-center gap-6 mb-2">
              <DogHouseIcon width={20} height={20} className="text-amber-500 opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-float animation-delay-300" />
              <PawIcon width={18} height={18} className="text-amber-500 opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-bounce" />
              <DogBoneIcon width={20} height={18} className="text-amber-500 opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-float animation-delay-600" />
            </div>
            <p className="text-sm font-medium uppercase tracking-wider text-amber-700 mb-2">À Propos de nous</p>
            <h2 className="text-3xl font-bold mb-4">{mainHeading}</h2>
            
            {supportingStatement && (
              <p className="text-lg mb-6 text-gray-700">{supportingStatement}</p>
            )}
          </div>
          
          <div className="relative rounded-xl overflow-hidden shadow-lg max-w-3xl w-full">
            {mediaType === 'image' && image && typeof image !== 'string' && (
              <img 
                src={`${image.url}?w=800&h=600&fit=crop`} 
                alt={mainHeading}
                className="w-full h-auto"
              />
            )}
            
            {mediaType === 'video' && videoUrl && (
              <VideoPlayer 
                videoUrl={videoUrl} 
                thumbnailUrl={videoThumbnail && typeof videoThumbnail !== 'string' ? videoThumbnail.url : undefined}
                heading={mainHeading}
              />
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-black relative">
          {teamMembers?.length > 0 && (
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-6">
              <div className="flex items-center">
                {teamMembers
                  .filter(tm => tm?.member && typeof tm.member !== 'string' && tm.member.photo)
                  .map((teamMember, index) => {
                    const member = teamMember.member;
                    
                    return (
                      <div
                        key={`team-member-${index}`}
                        className="relative rounded-full overflow-hidden border-2 border-white shadow-lg hover:scale-110 hover:z-10 transition-transform"
                        style={{
                          width: '50px',
                          height: '50px',
                          marginLeft: index === 0 ? 0 : '-12px',
                          zIndex: 10 - index,
                        }}
                      >
                        <img
                          src={`${member.photo.url}?w=100&h=100&fit=crop`}
                          alt={member.name || 'Team member'}
                          className="w-full h-full object-cover"
                          title={`${member.name || ''}${member.title ? ` - ${member.title}` : ''}`}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              {coreValuesStatement && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Nos valeurs</h2>
                  <p className="text-lg mb-6 text-gray-700">{coreValuesStatement}</p>
                  
                  {displayButton && (
                    <div>
                      <Button asChild>
                        <Link href={buttonLink}>
                          {buttonText}
                        </Link>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {detailedDescription && (
              <div className="prose max-w-none">
                <RichText data={detailedDescription} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}