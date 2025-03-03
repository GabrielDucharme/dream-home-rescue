'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { formatDateTime } from '@/utilities/formatDateTime'
import { DogBoneIcon, PawIcon } from '@/components/icons'
import type { DonationGoal } from '@/payload-types'
import { WaveDivider } from '@/components/Divider'

export const DonationGoalContent: React.FC<{
  goal: DonationGoal
  heading?: string
  description?: any
  showMilestones?: boolean
  showNextGoals?: boolean
  showDonationButton?: boolean
  donationButtonText?: string
  layout?: 'standard' | 'compact' | 'wide'
}> = ({ 
  goal,
  heading,
  description,
  showMilestones = true,
  showNextGoals = true,
  showDonationButton = true,
  donationButtonText = 'Faire un don',
  layout = 'standard'
}) => {
  // Handle missing or zero values to prevent errors
  const currentAmount = goal.currentAmount || 0
  const targetAmount = goal.targetAmount || 100
  
  const progressPercentage = Math.min(Math.round((currentAmount / targetAmount) * 100), 100)
  const remainingAmount = targetAmount - currentAmount
  
  // Safely handle milestones that might be missing
  const sortedMilestones = Array.isArray(goal.milestones) 
    ? [...goal.milestones].sort((a, b) => a.amount - b.amount) 
    : []
  
  // Find nearest upcoming milestone
  const upcomingMilestone = sortedMilestones.find(m => m.amount > currentAmount)
  
  // Safely handle nextGoals that might be missing
  const sortedNextGoals = Array.isArray(goal.nextGoals)
    ? [...goal.nextGoals].sort((a, b) => a.amount - b.amount)
    : []

  const getProgressBarColorClass = () => {
    // Default to primary if color is missing
    if (!goal.color) return 'bg-primary'
    
    switch (goal.color) {
      case 'primary': return 'bg-primary'
      case 'secondary': return 'bg-secondary'
      case 'success': return 'bg-green-500'
      case 'danger': return 'bg-red-500'
      case 'warning': return 'bg-yellow-500'
      default: return 'bg-primary'
    }
  }

  const isWideLayout = layout === 'wide'
  const isCompactLayout = layout === 'compact'

  // Set to true for debugging when needed
  const debugMode = false;
  
  return (
    <div id="donation" className={`w-full py-10 md:py-16 ${isCompactLayout ? 'bg-gray-50' : ''} relative`}>
      <WaveDivider position="top" fillColor={isCompactLayout ? '#F0F3F7' : '#F0F3F7'} height={70} className="-mt-16" />
      
      {/* Debug info panel at the top if debug mode is on */}
      {debugMode && (
        <div className="container mb-4">
          <details className="bg-gray-100 p-3 rounded-lg text-sm mb-4">
            <summary className="font-bold cursor-pointer">Infos de débogage (cliquer pour ouvrir)</summary>
            <div className="mt-2 pl-4 text-xs font-mono">
              <p>ID: {goal.id}</p>
              <p>Titre: {goal.title || 'Non défini'}</p>
              <p>Montant actuel: {currentAmount}</p>
              <p>Montant cible: {targetAmount}</p>
              <p>Pourcentage: {progressPercentage}%</p>
              <p>Nombre de jalons: {sortedMilestones.length}</p>
              <p>Nombre d'objectifs futurs: {sortedNextGoals.length}</p>
              <p>Couleur: {goal.color || 'Non définie'}</p>
              <p>Image? {goal.image ? 'Oui' : 'Non'}</p>
            </div>
          </details>
        </div>
      )}
      
      <div className={`container mx-auto px-4 relative z-10 ${isWideLayout ? 'max-w-6xl' : ''}`}>
        {/* Header Section */}
        <div className={`${isWideLayout ? 'text-center mb-8' : 'mb-6'}`}>
          {heading && <h2 className="mb-3">{heading}</h2>}
          {description && <RichText data={description} className="mb-4" />}
        </div>

        {/* Main Goal Card */}
        <div className={`${isCompactLayout ? 'p-4 bg-white shadow rounded-lg' : 'p-6 bg-white shadow-md rounded-xl'}`}>
          {/* Top Section with Title and Image */}
          <div className={`flex ${isWideLayout ? 'flex-col md:flex-row' : 'flex-col'} gap-6 mb-6`}>
            <div className={`${isWideLayout ? 'md:w-2/3' : 'w-full'}`}>
              <h3 className="text-xl font-bold mb-2">{goal.title}</h3>
              {goal.description && <RichText data={goal.description} className="mb-4 text-gray-700" />}
              
              {/* Current/Target Amount */}
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-lg font-medium">
                  <span className="text-2xl font-bold text-primary">{currentAmount.toLocaleString()}$</span>
                  {' '} / {targetAmount.toLocaleString()}$
                </span>
                <span className="text-sm text-gray-600">
                  {progressPercentage}% atteint
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-6 bg-gray-200 rounded-full mb-4 relative overflow-hidden">
                <div 
                  className={`h-full ${getProgressBarColorClass()} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${progressPercentage}%` }}
                />
                
                {/* Milestone Markers on Progress Bar */}
                {showMilestones && sortedMilestones.map((milestone) => {
                  const milestonePosition = Math.min((milestone.amount / goal.targetAmount) * 100, 100)
                  return (
                    <div 
                      key={milestone.id}
                      className={`absolute top-0 bottom-0 w-1 ${milestone.isReached ? 'bg-white' : 'bg-gray-600'}`}
                      style={{ 
                        left: `${milestonePosition}%`,
                        transform: 'translateX(-50%)'
                      }}
                      title={milestone.description}
                    />
                  )
                })}
              </div>
              
              {/* Remaining Amount */}
              {remainingAmount > 0 && (
                <p className="text-sm text-gray-700 mb-4">
                  <span className="font-medium">{remainingAmount.toLocaleString()}$</span> restants pour atteindre notre objectif
                </p>
              )}
              
              {/* Time Information */}
              {goal.endDate && (
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <span className="mr-1">⏱️</span>
                  <span>
                    Se termine le {formatDateTime({
                      date: new Date(goal.endDate),
                      options: {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    })}
                  </span>
                </div>
              )}
            </div>
            
            {goal.image && !isCompactLayout && (
              <div className={`${isWideLayout ? 'md:w-1/3' : 'w-full'} flex justify-center`}>
                <div className="relative w-full max-w-xs rounded-lg overflow-hidden h-64">
                  <Media 
                    resource={goal.image} 
                    imgClassName="object-contain h-full w-full"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Next Milestone */}
          {showMilestones && upcomingMilestone && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <DogBoneIcon className="w-5 h-5 text-primary" />
                <h4 className="font-medium">Prochain jalon</h4>
              </div>
              <p className="text-gray-800">
                <span className="font-bold">{upcomingMilestone.amount.toLocaleString()}$</span>
                <span className="mx-2">-</span>
                <span>{upcomingMilestone.description}</span>
              </p>
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">{(upcomingMilestone.amount - goal.currentAmount).toLocaleString()}$</span> de plus nécessaires
              </div>
            </div>
          )}
          
          {/* Donation Button */}
          {showDonationButton && (
            <div className="mt-6 text-center">
              <Button asChild size="lg">
                <Link href="#donation-form">
                  {donationButtonText}
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Next Goals Section */}
        {showNextGoals && sortedNextGoals?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <PawIcon className="w-5 h-5 mr-2 text-primary" />
              Prochains objectifs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedNextGoals.map((nextGoal) => (
                <div 
                  key={nextGoal.id} 
                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 className="font-bold text-gray-800">{nextGoal.title}</h4>
                  <p className="text-primary font-medium mt-1">{nextGoal.amount.toLocaleString()}$</p>
                  {nextGoal.description && (
                    <p className="mt-2 text-sm text-gray-600">{nextGoal.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}