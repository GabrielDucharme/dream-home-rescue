'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@payloadcms/ui'

export const NewsletterStats: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    unsubscribed: 0,
    thisMonth: 0,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/newsletter-subscriptions', {
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error("Échec de récupération des statistiques de l'infolettre")
        }

        const data = await response.json()

        // Calculate statistics from the data
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const activeCount = data.docs.filter((sub) => sub.status === 'active').length
        const unsubscribedCount = data.docs.filter((sub) => sub.status === 'unsubscribed').length
        const thisMonthCount = data.docs.filter((sub) => {
          const subDate = new Date(sub.createdAt)
          return subDate >= startOfMonth
        }).length

        setStats({
          total: data.totalDocs || 0,
          active: activeCount,
          unsubscribed: unsubscribedCount,
          thisMonth: thisMonthCount,
          loading: false,
          error: null,
        })
      } catch (error) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }))
      }
    }

    fetchStats()
  }, [])

  if (stats.loading) {
    return (
      <Card>
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Chargement des statistiques de l'infolettre...</div>
        </div>
      </Card>
    )
  }

  if (stats.error) {
    return (
      <Card>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">Abonnements à l'infolettre</h3>
          <div className="text-red-500">Erreur lors du chargement des statistiques</div>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-6">Abonnements à l'infolettre</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 mt-1">Total des abonnés</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600 mt-1">Actifs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">{stats.unsubscribed}</div>
            <div className="text-sm text-gray-600 mt-1">Désabonnés</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.thisMonth}</div>
            <div className="text-sm text-gray-600 mt-1">Ce mois-ci</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
