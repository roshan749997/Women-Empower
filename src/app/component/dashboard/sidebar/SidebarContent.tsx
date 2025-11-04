"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { menuItems } from "@/app/component/dashboard/sidebar/menuItems";
import { MenuItem } from "@/app/types/dashboardsidebar";
import "@/app/globals.css";
import { usePathname } from "next/navigation";

interface SidebarContentProps {
  onClose?: () => void;
  isOpen?: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  onClose = () => {},
  isOpen = true,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  // expand parent if any child is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.subItems) {
        const hasActiveChild = item.subItems.some((sub) => sub.href === pathname);
        if (hasActiveChild && !expandedItems.includes(item.name)) {
          setExpandedItems((prev) => [...prev, item.name]);
        }
      }
    });
  }, [pathname]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((item) => item !== itemName)
        : [...prev, itemName]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.subItems) {
      toggleExpanded(item.name);
    } else {
      onClose();
    }
  };

  const handleSubItemClick = () => {
    onClose();
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href;
  };

  return (
    <>
      {/* overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 bg-black/50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-50 bg-gradient-to-b from-white to-gray-50 shadow-xl transform transition-transform duration-300 ease-in-out
          lg:static lg:shadow-none lg:w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          w-[75%] lg:w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between p-5 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm">
            <h2 className="font-semibold text-lg">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-blue-50/50 transition-all duration-200"
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.subItems ? (
                  <div>
                    {/* Parent */}
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
                        expandedItems.includes(item.name)
                          ? "bg-blue-50 text-blue-900 border border-blue-100"
                          : "text-gray-700 hover:bg-white hover:shadow-sm hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <span
                          className={`transition-colors duration-200 ${
                            expandedItems.includes(item.name)
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="font-semibold text-[15px]">
                          {item.name}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-all duration-300 ${
                          expandedItems.includes(item.name)
                            ? "text-blue-600 rotate-180"
                            : "text-gray-400"
                        }`}
                      />
                    </button>

                    {/* Sub items */}
                    {expandedItems.includes(item.name) && (
                      <div className="ml-3 mt-2 space-y-1 border-l-2 border-blue-100 pl-2">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={handleSubItemClick}
                            className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                              isActive(subItem.href)
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full mr-3.5 transition-all duration-200 ${
                                isActive(subItem.href)
                                  ? "bg-white shadow-sm"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <span
                              className={
                                isActive(subItem.href) ? "font-medium" : ""
                              }
                            >
                              {subItem.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Normal links
                  <Link
                    href={item.href ?? "/"}
                    onClick={() => handleItemClick(item)}
                    className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-white hover:shadow-sm hover:text-gray-900"
                    }`}
                  >
                    <span
                      className={`mr-3.5 transition-colors duration-200 ${
                        isActive(item.href) ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`font-semibold text-[15px] ${
                        isActive(item.href) ? "text-white" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-5 border-t border-gray-200/60 bg-gradient-to-t from-gray-50 to-white/50 backdrop-blur-sm">
            <div className="text-xs text-gray-500 text-center font-medium tracking-wide">
              © 2025 Whoemen Empower
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarContent;
