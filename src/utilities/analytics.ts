'use client'

import { track } from '@vercel/analytics'

type TrackProperties = Parameters<typeof track>[1]

/**
 * Tracks a custom event with Vercel Analytics
 * 
 * @param eventName - The name of the event
 * @param properties - Optional properties to include with the event
 * @param options - Optional configuration options
 * 
 * Example:
 * ```ts
 * // Track a simple event
 * trackEvent('button_click')
 * 
 * // Track an event with properties
 * trackEvent('donation_started', { amount: 50, currency: 'CAD' })
 * 
 * // Track an event with options
 * trackEvent('form_submitted', { formType: 'adoption' }, { attribution: true })
 * ```
 */
export function trackEvent(
  eventName: string,
  properties?: TrackProperties,
) {
  try {
    track(eventName, properties)
  } catch (error) {
    // Silently fail in case analytics is blocked or fails
    console.error('Analytics tracking error:', error)
  }
}

