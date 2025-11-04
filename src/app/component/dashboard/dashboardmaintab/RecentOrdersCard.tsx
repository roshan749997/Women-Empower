'use client';
import { RecentOrder } from "@/app/data/dashboardmaintabdata";

interface RecentOrdersCardProps {
  orders: RecentOrder[];
}

export function RecentOrdersCard({ orders }: RecentOrdersCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
        <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-150">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-gray-900">{order.orderId}</p>
                <p className="font-bold text-gray-900">{order.amount}</p>
              </div>
              <p className="text-sm text-gray-500">{order.customer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
