'use client';

import { QuickAction } from "@/app/data/dashboardmaintabdata";

interface QuickActionsCardProps {
  actions: QuickAction[];
}

export function QuickActionsCard({ actions }: QuickActionsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((item, index) => (
          <button
            key={index}
            className="text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-150 border border-gray-100"
          >
            <p className="font-semibold text-gray-900 mb-2">{item.action}</p>
            <p className="text-sm text-gray-500">{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}