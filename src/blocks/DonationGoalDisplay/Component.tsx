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
  
  // Fetch goal data using server component and the payload API
  let goal: DonationGoal | null = null
  
  try {
    // Initialize the Payload client with our config
    const payload = await getPayload({ config: configPromise })
    
    // Query with proper depth to ensure all relationships are populated
    const allGoals = await payload.find({
      collection: 'donation-goals',
      depth: 2 // Ensure relationships are populated to a depth of 2
    })
    
    console.log('All donation goals:', allGoals)
    
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
    console.error('Error fetching donation goal:', error)
  }

  // Create debug data for frontend display
  const debugInfo = {
    selectedGoalId: goalIdValue,
    foundGoals: 'Unknown', // We'll update this with actual count if available
    error: null as string | null
  }
  
  // If goal not found or error occurred
  if (!goal) {
    return (
      <div id="donation" className="w-full">
        <div className="container">
          <div className="text-center p-6 bg-white shadow rounded-lg">
            <h3 className="text-xl font-bold mb-4">Aucun objectif de don trouvé</h3>
            <p className="mb-4">L'objectif de don n'a pas pu être chargé. Veuillez vérifier:</p>
            <ul className="text-left list-disc pl-8 mb-4">
              <li>Que l'objectif de don est bien créé dans l'administration</li>
              <li>Que vous avez sélectionné le bon ID d'objectif dans le bloc</li>
              <li>Que l'objectif est actif</li>
            </ul>
            
            {/* Debug info visible in frontend */}
            <div className="mt-6 border-t pt-4 text-left">
              <h4 className="font-bold mb-2">Informations de débogage:</h4>
              <pre className="bg-gray-100 p-4 overflow-auto text-xs whitespace-pre-wrap">
                ID sélectionné: {JSON.stringify(goalIdValue)}<br />
                Type d'ID: {typeof goalIdValue}<br />
                Objectifs trouvés: {debugInfo.foundGoals || 'Aucun'}<br />
                {debugInfo.error && `Erreur: ${debugInfo.error}`}
              </pre>
            </div>
          </div>
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
    />
  )
}