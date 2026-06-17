import React from 'react'

const AdminPageHeader = ({ badge, title, description, actions, align = 'end' }) => {
  return (
    <div
      className={`flex flex-col gap-4 lg:flex-row lg:justify-between ${
        align === 'start' ? 'lg:items-start' : 'lg:items-end'
      }`}
    >
      <div>
        <p className="text-sm font-medium text-slate-400">{badge}</p>
        <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
      </div>

      {actions ? <div className="flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
    </div>
  )
}

export default AdminPageHeader
