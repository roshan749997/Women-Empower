// lib/services/dashboardService.ts

import { getLatestEvents } from '../lib/api';

export interface DashboardStats {
  title: string;
  value: string;
  change: string;
  changeColor: string;
}

export interface RecentOrder {
  orderId: string;
  customer: string;
  amount: string;
}

export interface UpcomingEvent {
  name: string;
  date: string;
  time: string;
}

export interface QuickAction {
  action: string;
  description: string;
}

export interface DashboardData {
  stats: DashboardStats[];
  recentOrders: RecentOrder[];
  upcomingEvents: UpcomingEvent[];
  quickActions: QuickAction[];
}

// Server-side data fetching function
export async function getDashboardData(): Promise<DashboardData> {
  // Fetch latest events from API
  const upcomingEvents = await getLatestEvents();
  
  return {
    stats: [
      {
        title: "Total Products",
        value: "1,234",
        change: "+12%",
        changeColor: "text-green-600",
      },
      {
        title: "Active Artists",
        value: "89",
        change: "+5%",
        changeColor: "text-green-600",
      },
      {
        title: "Courses",
        value: "45",
        change: "+8%",
        changeColor: "text-green-600",
      },
      {
        title: "Events",
        value: "23",
        change: "+3%",
        changeColor: "text-green-600",
      },
    ],
    recentOrders: [
      {
        orderId: "#ORD-1234",
        customer: "Sarah Johnson",
        amount: "₹2,490",
      },
      {
        orderId: "#ORD-1235",
        customer: "Mike Chen",
        amount: "₹1,450",
      },
      {
        orderId: "#ORD-1236",
        customer: "Emma Davis",
        amount: "₹3,890",
      },
      {
        orderId: "#ORD-1237",
        customer: "John Smith",
        amount: "₹1,120",
      },
    ],
    upcomingEvents,
    quickActions: [
      {
        action: "Add New Product",
        description: "Create a new product listing",
      },
      {
        action: "Schedule Event",
        description: "Plan upcoming workshops",
      },
      {
        action: "Manage Artists",
        description: "Update artist profiles",
      },
    ],
  };
}





















