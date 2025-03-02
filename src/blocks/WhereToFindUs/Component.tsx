'use client';

import React, { useState } from 'react';
import type { Media } from '@/payload-types';
import { WaveDivider } from '@/components/Divider';
import { Media as MediaComponent } from '@/components/Media';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getClientSideURL } from '@/utilities/getURL';

type PhotoType = {
  photo: string | Media;
  caption?: string;
}

export type WhereToFindUsBlockProps = {
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
  contactFormEnabled?: boolean;
  contactFormTitle?: string;
}

type FormValues = {
  name: string;
  email: string;
  message: string;
}

export const Component: React.FC<WhereToFindUsBlockProps> = ({
  title,
  address,
  phone,
  email,
  hours,
  mapEmbed,
  displayMap,
  photos,
  contactFormEnabled = true,
  contactFormTitle = "Nous contacter",
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const dataToSend = Object.entries(data).map(([field, value]) => ({
        field,
        value,
      }));

      const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form: 'contact',
          submissionData: dataToSend,
        }),
      });

      if (!req.ok) {
        throw new Error('Une erreur est survenue lors de l\'envoi du formulaire.');
      }

      setSubmitSuccess(true);
      reset();
    } catch (error) {
      setSubmitError((error as Error).message || 'Une erreur est survenue lors de l\'envoi du formulaire.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="findus" className="py-10 md:py-16 bg-gray-50 relative">
      <WaveDivider fillColor="#f9fafb" position="top" height={70} className="-mt-16" />
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{title}</h2>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 h-full">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[#26483B]">Adresse</h3>
                <p className="whitespace-pre-line text-gray-700">{address}</p>
              </div>
              
              {phone && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#26483B]">Téléphone</h3>
                  <p><a href={`tel:${phone}`} className="text-blue-600 hover:underline">{phone}</a></p>
                </div>
              )}
              
              {email && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#26483B]">Courriel</h3>
                  <p><a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a></p>
                </div>
              )}
              
              {hours && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#26483B]">Heures d&apos;ouverture</h3>
                  <p className="whitespace-pre-line text-gray-700">{hours}</p>
                </div>
              )}
            </div>
            
            {displayMap && mapEmbed ? (
              <div 
                className="mt-8 w-full h-72 rounded-lg overflow-hidden" 
                dangerouslySetInnerHTML={{ __html: mapEmbed }} 
              />
            ) : photos && photos.length > 0 ? (
              <div className="mt-8 w-full h-72 rounded-lg overflow-hidden bg-gray-100">
                <MediaComponent resource={photos[0]?.photo} imgClassName="object-cover h-full w-full" />
              </div>
            ) : null}
          </div>
          
          {/* Contact Form */}
          {contactFormEnabled && (
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h3 className="text-2xl font-semibold mb-6 text-[#26483B]">{contactFormTitle}</h3>
              
              {submitSuccess ? (
                <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
                  <p className="font-medium">Merci pour votre message!</p>
                  <p>Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {submitError && (
                    <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
                      <p>{submitError}</p>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="name" className="text-gray-700">
                      Nom <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="name"
                      className="mt-1 w-full"
                      {...register('name', { required: 'Ce champ est requis' })} 
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-gray-700">
                      Courriel <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="email"
                      type="email"
                      className="mt-1 w-full"
                      {...register('email', { 
                        required: 'Ce champ est requis',
                        pattern: {
                          value: /^\S+@\S+\.\S+$/,
                          message: 'Veuillez entrer une adresse courriel valide'
                        }
                      })} 
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-gray-700">
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea 
                      id="message"
                      className="mt-1 w-full"
                      rows={5}
                      {...register('message', { required: 'Ce champ est requis' })} 
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    variant="flame"
                    className="w-full font-medium"
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
        
        {/* Photo Gallery */}
        {photos && photos.length > 1 && (
          <div className="mt-16">
            <h3 className="text-2xl font-semibold mb-8 text-center text-[#26483B]">Notre refuge</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {photos.map((item, i) => (
                <div key={i} className="relative h-64 overflow-hidden rounded-xl shadow-sm group transform transition duration-300 hover:scale-105">
                  <MediaComponent resource={item.photo} imgClassName="object-cover h-full w-full" />
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
      
      <WaveDivider fillColor="#f9fafb" position="bottom" height={70} className="-mb-16" />
    </section>
  );
};