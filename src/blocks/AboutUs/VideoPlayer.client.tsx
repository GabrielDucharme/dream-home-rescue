'use client'

import React, { useState } from 'react'
import { PlayIcon } from '@/components/icons'

interface VideoPlayerProps {
  videoUrl: string
  thumbnailUrl?: string
  heading: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, thumbnailUrl, heading }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Function to extract YouTube or Vimeo video ID
  const getVideoEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // YouTube
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = url.match(ytRegex);
    
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    }
    
    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|)(\d+)(?:|\/\?)|player\.vimeo\.com\/video\/(\d+))/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (vimeoMatch && (vimeoMatch[1] || vimeoMatch[2])) {
      const vimeoId = vimeoMatch[1] || vimeoMatch[2];
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
    }
    
    return url; // Return original URL if no match
  };

  const embedUrl = videoUrl ? getVideoEmbedUrl(videoUrl) : null;

  return (
    <>
      {isPlaying ? (
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl || ''}
            title={heading}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div 
          className="relative aspect-video w-full cursor-pointer group"
          onClick={() => setIsPlaying(true)}
        >
          {thumbnailUrl ? (
            <img 
              src={`${thumbnailUrl}?w=800&h=450&fit=crop`} 
              alt={`Aperçu de ${heading}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Aperçu non disponible</span>
            </div>
          )}
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="bg-black bg-opacity-50 text-white text-sm uppercase tracking-wider font-medium px-3 py-1 rounded-md mb-4">
              Regarder la vidéo
            </div>
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center bg-opacity-90 group-hover:bg-opacity-100 transition-all">
              <PlayIcon width={30} height={30} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}