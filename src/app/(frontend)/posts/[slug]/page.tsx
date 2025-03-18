import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import { generateArticleSchema } from '@/utilities/schema'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const posts = await payload.find({
      collection: 'posts',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    // Filter out any posts that don't have a valid slug
    const params = posts.docs
      .filter(post => post && typeof post.slug === 'string' && post.slug.length > 0)
      .map(({ slug }) => {
        return { slug }
      })

    return params
  } catch (error) {
    console.error('Error generating static params for posts:', error)
    return [] // Return empty array to prevent build failures
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  try {
    const { isEnabled: draft } = await draftMode()
    const params = await paramsPromise
    
    // Handle case where slug is undefined
    if (!params || typeof params.slug !== 'string') {
      return <div className="container py-16">
        <h1 className="text-3xl font-bold mb-4">Article non trouvé</h1>
        <p>L'article que vous cherchez n'existe pas ou a été supprimé.</p>
      </div>
    }
    
    const { slug } = params
    const url = '/posts/' + slug
    const post = await queryPostBySlug({ slug })

    if (!post) return <PayloadRedirects url={url} />

    return (
      <article className="pt-16 pb-16">
        <PageClient />

        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={url} />

        {draft && <LivePreviewListener />}

        <PostHero post={post} />

        {/* Add JSON-LD schema for the article */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateArticleSchema(post))
          }}
        />

        <div className="flex flex-col items-center gap-4 pt-8">
          <div className="container">
            <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
            {post.relatedPosts && Array.isArray(post.relatedPosts) && post.relatedPosts.length > 0 && (
              <RelatedPosts
                className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
                docs={post.relatedPosts.filter((post) => typeof post === 'object' && post !== null)}
              />
            )}
          </div>
        </div>
      </article>
    )
  } catch (error) {
    console.error('Error rendering post page:', error)
    return (
      <div className="container py-16">
        <h1 className="text-3xl font-bold mb-4">Erreur</h1>
        <p>Une erreur s'est produite lors du chargement de l'article.</p>
      </div>
    )
  }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  try {
    const params = await paramsPromise
    
    // If slug is missing or invalid, return default metadata
    if (!params || typeof params.slug !== 'string') {
      return {
        title: 'Article non trouvé | Dream Home Rescue',
        description: 'L\'article que vous cherchez n\'existe pas ou a été supprimé.',
      }
    }
    
    const { slug } = params
    const post = await queryPostBySlug({ slug })

    if (!post) {
      return {
        title: 'Article non trouvé | Dream Home Rescue',
        description: 'L\'article que vous cherchez n\'existe pas ou a été supprimé.',
      }
    }

    return generateMeta({ doc: post })
  } catch (error) {
    console.error('Error generating metadata for post:', error)
    return {
      title: 'Erreur | Dream Home Rescue',
      description: 'Une erreur s\'est produite lors du chargement de l\'article.',
    }
  }
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  try {
    // If slug is empty or not valid, return null immediately
    if (typeof slug !== 'string' || slug.trim() === '') {
      return null
    }
    
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'posts',
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  } catch (error) {
    console.error(`Error querying post by slug "${slug}":`, error)
    return null
  }
})
