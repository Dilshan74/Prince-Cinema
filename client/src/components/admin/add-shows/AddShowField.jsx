import React from 'react'

const AddShowField = ({ label, children }) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      {children}
    </label>
  )
}

export default AddShowField
