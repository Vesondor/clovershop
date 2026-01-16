"use client";
import React from "react";
import { MdDashboard, MdCategory } from "react-icons/md";
import { FaTable } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: MdDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: FaTable,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: MdCategory,
  },
  // Future links can be added here
];

const DashboardSidebar = () => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-green-800 text-white rounded-md shadow-lg"
      >
        <MdDashboard className="text-xl" />
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-green-800 min-h-screen flex flex-col shadow-xl shrink-0
          transition-transform duration-300 ease-in-out
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        <div className="p-6 border-b border-green-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
            CLOVER{" "}
            <span className="text-xs font-normal bg-green-900 px-2 py-1 rounded">
              ADMIN
            </span>
          </h2>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-green-200 hover:text-white"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="block"
                onClick={() => setIsMobileOpen(false)}
              >
                <div
                  className={`
                  flex items-center gap-x-4 px-6 py-4 
                  transition-all duration-200 ease-in-out
                  ${
                    isActive
                      ? "bg-green-900 border-l-4 border-white text-white"
                      : "text-green-100 hover:bg-green-700 hover:text-white border-l-4 border-transparent"
                  }
                `}
                >
                  <Icon
                    className={`text-xl ${
                      isActive ? "text-white" : "text-green-200"
                    }`}
                  />
                  <span className="font-medium tracking-wide">{link.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-green-700">
          <p className="text-xs text-green-300 text-center">
            © 2026 Clover Admin
          </p>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
