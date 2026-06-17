import React, { useState, useEffect } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import ShowsTable from '../../components/admin/ShowsTable'
import { getScheduledShows } from '../../lib/adminData'

const ListShows = () => {
  const [shows, setShows] = useState([])

  useEffect(() => {
    setShows(getScheduledShows())
  }, [])

  return (
    <section className="space-y-6">
      <AdminPageHeader
        badge="Show management"
        title="List all scheduled shows"
        description="Review every screening, its hall assignment, pricing, and availability status in one table."
      />

      <ShowsTable shows={shows} />
    </section>
  )
}

export default ListShows
