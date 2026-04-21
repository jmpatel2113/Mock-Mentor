import React from 'react'
import Header from './_components/header'

function DashboardLayout({children}) {
  return (
    <div className='page-shell min-h-screen'>
      <Header/>
      <div className='page-content pt-8'>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
