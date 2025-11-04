import React from 'react'
import { StatsCard } from '../component/dashboard/dashboardmaintab/StatsCard'
import { getDashboardCounts } from '../lib/api'

function page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard stat={{ title: 'Products', value: '0', change: '', changeColor: '' }} />
        <StatsCard stat={{ title: 'Artists', value: '0', change: '', changeColor: '' }} />
        <StatsCard stat={{ title: 'Courses', value: '0', change: '', changeColor: '' }} />
        <StatsCard stat={{ title: 'Events', value: '0', change: '', changeColor: '' }} />
      </div>
    </div>
  )
}

export default page
