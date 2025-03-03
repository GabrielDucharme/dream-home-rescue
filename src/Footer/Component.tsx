import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { WaveDivider } from '@/components/Divider'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto text-gray-800 relative">
      <div className="bg-[#EDEBE0] relative pt-16 pb-8">
        {/* Main footer content */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 mb-12">
            {/* Logo and tagline column */}
            <div className="lg:col-span-4 mb-6 lg:mb-0">
              <Link className="flex items-center mb-4" href="/">
                <Logo />
              </Link>
              <p className="text-sm text-gray-700 mb-6 max-w-xs">
                Donnant une deuxième chance aux chiens abandonnés et maltraités à travers le Québec depuis 2010.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Grouped columns with visual container */}
            <div className="lg:col-span-8 bg-white/30 rounded-lg shadow-sm p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Navigation column */}
                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Navigation</h4>
                  <nav className="flex flex-col space-y-2">
                    {navItems.map(({ link }, i) => {
                      return <CMSLink key={i} {...link} className="text-gray-700 hover:text-primary transition-colors" />
                    })}
                  </nav>
                </div>
                
                {/* Contact column */}
                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Contact</h4>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700 flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      123 Rue des Chiens<br />Montréal, QC H2K 1A1
                    </p>
                    <p className="text-sm text-gray-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      (514) 123-4567
                    </p>
                    <p className="text-sm text-gray-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      info@dhr.org
                    </p>
                  </div>
                </div>
                
                {/* Hours column */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <h4 className="text-base font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Heures d&apos;ouverture</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700 flex justify-between">
                      <span>Lundi - Vendredi:</span>
                      <span>9h - 17h</span>
                    </p>
                    <p className="text-sm text-gray-700 flex justify-between">
                      <span>Samedi:</span>
                      <span>10h - 16h</span>
                    </p>
                    <p className="text-sm text-gray-700 flex justify-between">
                      <span>Dimanche:</span>
                      <span>Fermé</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dog illustrations */}
        <div className="relative w-full" style={{ height: '10rem' }}>
          <div className="absolute left-0 bottom-0">
            <div className="w-[50vw] max-w-[600px]">
              <Image 
                src="/footer-dhr.png" 
                alt="Dog illustrations" 
                width={600} 
                height={180} 
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
        </div>
        
        {/* Copyright bar */}
        <div className="container mx-auto px-4 pt-8 mt-12 border-t border-gray-300/30">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-600">
              © {currentYear} Dog Happy Rescue. Tous droits réservés.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <a href="#" className="text-xs text-gray-600 hover:text-primary">Politique de confidentialité</a>
              <a href="#" className="text-xs text-gray-600 hover:text-primary">Conditions d&apos;utilisation</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
