import React, { useState, useEffect } from 'react'
import AdminMetricCards from '../../components/admin/AdminMetricCards'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import DemandSnapshotPanel from '../../components/admin/dashboard/DemandSnapshotPanel'
import TopPerformingTitlesPanel from '../../components/admin/dashboard/TopPerformingTitlesPanel'
import UpcomingReleasesPanel from '../../components/admin/dashboard/UpcomingReleasesPanel'
import { getAdminMovies, dashboardStats, upcomingReleases } from '../../lib/adminData'

const Dashboard = () => {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    setMovies(getAdminMovies())
  }, [])

  return (
    <section className="space-y-8">
      <AdminPageHeader
        badge="Operations overview"
        title="Admin dashboard"
        description="Track active screenings, audience demand, and the next releases from one polished overview."
      />

      <AdminMetricCards stats={dashboardStats} />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <DemandSnapshotPanel />
          <TopPerformingTitlesPanel movies={movies} />
        </div>

        <UpcomingReleasesPanel releases={upcomingReleases} />
      </div>
    </section>
  )
}

export default Dashboard
