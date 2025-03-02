import React from 'react';
import { Block, Media } from 'payload/types';
import { Divider } from '../../components/Divider';
import { Media as MediaComponent } from '../../components/Media';

type PhotoType = {
  photo: string | Media;
  caption?: string;
}

export type WhereToFindUsProps = {
  blockName?: string;
  blockType: 'whereToFindUs';
  title: string;
  address: string;
  phone?: string;
  email?: string;
  hours?: string;
  mapEmbed?: string;
  displayMap: boolean;
  photos?: PhotoType[];
}

export const WhereToFindUs: React.FC<WhereToFindUsProps> = ({
  title,
  address,
  phone,
  email,
  hours,
  mapEmbed,
  displayMap,
  photos,
}) => {
  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{title}</h2>
        <Divider className="mb-8" />
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Adresse</h3>
              <p className="whitespace-pre-line">{address}</p>
            </div>
            
            {phone && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Téléphone</h3>
                <p><a href={`tel:${phone}`} className="text-blue-600 hover:underline">{phone}</a></p>
              </div>
            )}
            
            {email && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Courriel</h3>
                <p><a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a></p>
              </div>
            )}
            
            {hours && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Heures d'ouverture</h3>
                <p className="whitespace-pre-line">{hours}</p>
              </div>
            )}
          </div>
          
          <div>
            {displayMap && mapEmbed ? (
              <div 
                className="w-full h-72 md:h-80 lg:h-96 rounded-lg overflow-hidden" 
                dangerouslySetInnerHTML={{ __html: mapEmbed }} 
              />
            ) : photos && photos.length > 0 ? (
              <div className="w-full h-72 md:h-80 lg:h-96 rounded-lg overflow-hidden bg-gray-100">
                <MediaComponent resource={photos[0].photo} />
              </div>
            ) : null}
          </div>
        </div>
        
        {photos && photos.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-6 text-center">Notre refuge</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {photos.map((item, i) => (
                <div key={i} className="relative h-64 overflow-hidden rounded-lg group">
                  <MediaComponent resource={item.photo} imgClassName="object-cover" />
                  {item.caption && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p>{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};