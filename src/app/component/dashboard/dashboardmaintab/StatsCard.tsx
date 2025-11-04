'use client';

import { DashboardStats } from "@/app/data/dashboardmaintabdata";

interface StatsCardProps {
  stat: DashboardStats;
}

export function StatsCard({ stat }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{stat.title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
        </div>
        <span
          className={`text-sm font-semibold ${stat.changeColor} bg-green-50 px-2 py-1 rounded-full`}
        >
          {stat.change}
        </span>
      </div>
    </div>
  );
}