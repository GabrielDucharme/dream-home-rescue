import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { VideoPlayer } from './VideoPlayer.client'
import { DogHouseIcon, DogBoneIcon, PawIcon } from '@/components/icons'
import { WaveDivider } from '@/components/Divider'
import Image from 'next/image'

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
    <div id="about-us" className="relative bg-gradient-to-b from-[#ECE0CE] to-transparent">
      <WaveDivider 
        fillColor="#ECE0CE" 
        position="top" 
        height={70}
        className="-mt-16"
      />
      
      <div className="container section-spacing-compact">
        <div className="content-spacing flex flex-col items-center">
          <div className="text-center max-w-3xl mx-auto relative content-spacing-small">
            <div className="flex justify-center gap-6 mb-2">
              <DogHouseIcon width={20} height={20} className="text-amber-500 opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-float animation-delay-300" />
              <PawIcon width={18} height={18} className="text-amber-500 opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-bounce" />
              <DogBoneIcon width={20} height={18} className="text-amber-500 opacity-70 hover:opacity-100 transition-all hover:scale-110 animate-float animation-delay-600" />
            </div>
            <p className="text-sm font-medium uppercase tracking-wider text-amber-700 mb-2">À Propos de nous</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{mainHeading}</h2>
            
            {supportingStatement && (
              <p className="text-lg text-gray-700">{supportingStatement}</p>
            )}
          </div>
          
          <div className="relative rounded-xl overflow-hidden shadow-lg max-w-3xl w-full mt-8">
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

        <div className="mt-16 border-t border-black/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mt-16">
            <div className="self-start">
              {coreValuesStatement && (
                <>
                  <h3 className="text-3xl font-light text-gray-700 pt-0 mt-0">{coreValuesStatement}</h3>
                  
                  {displayButton && (
                    <div className="flex items-center mt-6">
                      <Button asChild variant="flame" className="font-medium mr-4">
                        <Link href={buttonLink}>
                          {buttonText}
                        </Link>
                      </Button>
                      
                      {teamMembers?.length > 0 && (
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
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {detailedDescription && (
              <p className="z-10">
                <RichText data={detailedDescription} className='text-lg text-gray-700' />
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Team image at the bottom */}
      <div className="relative w-full overflow-hidden -mb-44 -mt-[500px]">
        <Image 
          src="/team.webp" 
          alt="Our Team" 
          width={1920}
          height={600}
          className="w-full object-cover h-auto mix-blend-overlay"
          priority={false}
          quality={85}
        />
        <div className="absolute inset-0"></div>
        
        {/* Twistie image at bottom left */}
        <div className="absolute bottom-96 left-24 w-32 md:w-40 lg:w-80 h-auto">
          <Image
            src="/twistie2.png"
            alt="Decorative element"
            width={200}
            height={200}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  )
}