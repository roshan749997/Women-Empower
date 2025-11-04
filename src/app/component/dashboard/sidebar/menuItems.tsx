import {
  LayoutDashboard,
  Package,
  Users,
  BookOpen,
  Calendar,
  Image,
  ShoppingCart,
  Phone,
} from "lucide-react";
import { MenuItem } from "@/app/types/dashboardsidebar";

export const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: "/dashboardmaintab",
  },
  {
    name: "Products",
    icon: <Package className="w-5 h-5" />,
    subItems: [
      { name: "All Products", href: "/dashboardallproductstab" },
      { name: "Trending Products", href: "/dashboardtrandingproductstab" },
      { name: "Category", href: "/dashboardcategorytab"},
    ],
  },
  { name: "Artists", icon: <Users className="w-5 h-5" />, href: "/dashboardartiststab" },
  { name: "Courses", icon: <BookOpen className="w-5 h-5" />, href: "/dashboardcoursestab" },
  { name: "Events", icon: <Calendar className="w-5 h-5" />, href: "/dashboardeventstab" },
  { name: "Orderlist", icon: <ShoppingCart className="w-5 h-5" />, href: "/dashboard-orderlist-tab" },
  {name: "Banners",icon: <Image className="w-5 h-5" />, href: "/dashboardbannerstab"},
  { name: "Users", icon: <Users className="w-5 h-5" />, href: "/dashboarduserstab" },
  { name: "Contact", icon: <Phone className="w-5 h-5" />, href: "/dashboardcontact" },
];
