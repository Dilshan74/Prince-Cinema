import React from 'react'

import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AddShowForm from '../../components/admin/add-shows/AddShowForm'

const AddShows = () => {
  return (
    <section className="space-y-8">
      <AdminPageHeader
        badge="Add Shows"
        title="Schedule a new show"
        description="Pick a title, set the time slot, and publish the screening."
      />

      <div className="max-w-xl">
        <AddShowForm />
      </div>
    </section>
  )
}

export default AddShows