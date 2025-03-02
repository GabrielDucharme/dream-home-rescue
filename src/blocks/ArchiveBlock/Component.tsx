import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { WaveDivider } from '@/components/Divider/WaveDivider'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 3

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedPosts.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return post.value
      }) as Post[]

      posts = filteredSelectedPosts
    }
  }

  return (
    <div className="relative my-0" id={`block-${id}`}>
      <div className="relative h-16">
        <WaveDivider fillColor="#EDEBE0" height={64} />
      </div>
      <div className="py-16" style={{ background: '#EDEBE0', marginTop: '-1px' }}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Features story</h2>
            <Link href="/posts" className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors">
              View all
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => {
              if (!post) return null
              
              return (
                <div key={index} className="group transition-all duration-300 hover:-translate-y-1">
                  <Link href={`/posts/${post.slug}`} className="block">
                    <div className="rounded-lg overflow-hidden mb-4 bg-white">
                      {post.meta?.image && typeof post.meta.image !== 'string' && (
                        <Media 
                          resource={post.meta.image} 
                          imgClassName="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{post.title}</h3>
                  </Link>
                  
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.categories.map((category, catIndex) => {
                        if (typeof category === 'object' && category !== null) {
                          return (
                            <span 
                              key={catIndex} 
                              className="inline-block px-3 py-1 text-sm rounded-full bg-white text-gray-700 border border-gray-200"
                            >
                              {category.title}
                            </span>
                          )
                        }
                        return null
                      })}
                      
                      {index === 0 && (
                        <span className="inline-block px-3 py-1 text-sm rounded-full bg-white text-gray-700 border border-gray-200">
                          <span className="inline-flex items-center">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {introContent && (
            <div className="mt-12">
              <RichText data={introContent} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
