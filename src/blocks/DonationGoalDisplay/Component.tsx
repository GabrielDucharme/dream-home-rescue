import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { formatDateTime } from '@/utilities/formatDateTime'
import { DogBoneIcon, PawIcon } from '@/components/icons'
// Import Payload's local API from the payload package
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { DonationGoal } from '@/payload-types'

// Client-side component for interactivity
import { DonationGoalContent } from './DonationGoalContent.client'
import { WaveDivider } from '@/components/Divider'

// Function to check if an event is upcoming
function isUpcoming(dateStr: string): boolean {
  const eventDate = new Date(dateStr)
  const now = new Date()
  return eventDate > now
}

export const Component: React.FC<{
  heading?: string
  description?: any
  goalID?: { 
    relationTo: string
    value: string 
  } | string // Allow for both relationship object and direct ID string
  showMilestones?: boolean
  showNextGoals?: boolean
  showDonationButton?: boolean
  donationButtonText?: string
  layout?: 'standard' | 'compact' | 'wide'
}> = async ({ 
  heading,
  description,
  goalID,
  showMilestones = true,
  showNextGoals = true,
  showDonationButton = true,
  donationButtonText = 'Faire un don',
  layout = 'standard'
}) => {
  // Extract the goal ID value regardless of format
  let goalIdValue: string | undefined
  
  // Log the entire goalID structure for debugging
  console.log('Raw goalID structure:', goalID)
  console.log('Type of goalID:', typeof goalID)
  
  if (typeof goalID === 'string') {
    console.log('goalID is a string')
    goalIdValue = goalID
  } else if (goalID && typeof goalID === 'object') {
    console.log('goalID is an object with keys:', Object.keys(goalID))
    
    if ('value' in goalID) {
      console.log('goalID has value property:', goalID.value)
      goalIdValue = goalID.value as string
    } else if ('id' in goalID) {
      console.log('goalID has id property:', goalID.id)
      goalIdValue = goalID.id as string
    }
  }
  
  // If no goal ID provided, show error message
  if (!goalIdValue) {
    return (
      <div className="w-full py-12">
        <div className="container">
          <div className="text-center p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-bold mb-4">Aucun objectif de don trouvé</h3>
            <p>Veuillez sélectionner un objectif de don dans l'administration.</p>
          </div>
        </div>
      </div>
    )
  }
  
  // Fetch goal data and upcoming events using server component and the payload API
  let goal: DonationGoal | null = null
  let upcomingEvent: any = null
  
  try {
    // Initialize the Payload client with our config
    const payload = await getPayload({ config: configPromise })
    
    // Query goals with proper depth to ensure all relationships are populated
    const allGoals = await payload.find({
      collection: 'donation-goals',
      depth: 2 // Ensure relationships are populated to a depth of 2
    })
    
    // Also fetch upcoming events
    const events = await payload.find({
      collection: 'funding-events',
      depth: 1,
      where: {
        status: {
          equals: 'published'
        }
      },
      sort: 'eventDate',
      limit: 3 // Just fetch a few events
    })
    
    // Find the first upcoming event
    if (events && events.docs && events.docs.length > 0) {
      upcomingEvent = events.docs.find(event => event.eventDate && isUpcoming(event.eventDate))
      
      if (upcomingEvent) {
        console.log('Found upcoming event:', upcomingEvent.title)
      }
    }
    
    if (allGoals.docs.length > 0) {
      // If we have any goals, use the first one
      goal = allGoals.docs[0]
      
      // Detailed logging to see what fields the goal has
      console.log('Found goal with ID:', goal.id)
      console.log('Title:', goal.title)
      console.log('Current amount:', goal.currentAmount)
      console.log('Target amount:', goal.targetAmount)
      console.log('Has milestones:', Boolean(goal.milestones?.length))
      console.log('Has nextGoals:', Boolean(goal.nextGoals?.length))
      console.log('Has image:', Boolean(goal.image))
      
      // Check if the goal has all the required properties for the client component
      const requiredProps = ['id', 'title', 'currentAmount', 'targetAmount', 'color', 'isActive']
      const missingProps = requiredProps.filter(prop => !(prop in goal))
      
      if (missingProps.length > 0) {
        console.log('WARNING: Goal is missing required properties:', missingProps)
      }
    } else {
      console.log('No donation goals found in the database - please create one in the Payload admin')
    }
  } catch (error) {
    console.error('Error fetching donation goal or events:', error)
  }

  // Create debug data for frontend display
  const debugInfo = {
    selectedGoalId: goalIdValue,
    foundGoals: 'Unknown', // We'll update this with actual count if available
    error: null as string | null
  }
  
  // Even if we don't have a goal, we might have an upcoming event
  // Pass what we have to the client component
  if (!goal && upcomingEvent) {
    // If we have an upcoming event but no goal, we still want to render the event section
    return (
      <DonationGoalContent
        goal={null} 
        heading={heading}
        description={description}
        showMilestones={false} // No milestones without a goal
        showNextGoals={false} // No next goals without a goal
        showDonationButton={showDonationButton}
        donationButtonText={donationButtonText}
        layout={layout}
        upcomingEvent={upcomingEvent}
      />
    )
  }
  
  // If no goal and no upcoming event, show minimal error without debug info
  if (!goal) {
    return (
      <div className="w-full">
        <div className="container py-8">
          {/* No debug info, just a clean container ready for events */}
        </div>
      </div>
    )
  }
  
  // Pass all props to the client component for rendering
  return (
    <DonationGoalContent
      goal={goal}
      heading={heading}
      description={description}
      showMilestones={showMilestones}
      showNextGoals={showNextGoals}
      showDonationButton={showDonationButton}
      donationButtonText={donationButtonText}
      layout={layout}
      upcomingEvent={upcomingEvent}
    />
  )
}