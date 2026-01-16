import React from "react";
import { DashboardSidebar } from "@/components";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { FaDollarSign, FaBoxOpen, FaShoppingCart } from "react-icons/fa";

const AdminDashboardPage = () => {
  return (
    <div className="bg-gray-50 flex justify-start min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, Admin. Here is what's happening today.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stat Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Total Sales
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  $24,500
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <FaDollarSign className="text-xl" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-500 font-medium flex items-center gap-1">
                <FaArrowUp /> 12%
              </span>
              <span className="text-gray-400 ml-2">from last month</span>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Total Orders
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">1,240</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <FaShoppingCart className="text-xl" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-500 font-medium flex items-center gap-1">
                <FaArrowUp /> 8.5%
              </span>
              <span className="text-gray-400 ml-2">from last month</span>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Products
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">142</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                <FaBoxOpen className="text-xl" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-red-500 font-medium flex items-center gap-1">
                <FaArrowDown /> 2.1%
              </span>
              <span className="text-gray-400 ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <button className="text-sm text-green-700 hover:text-green-900 font-medium">
              View All
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* Activity usage placeholder */}
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">
                    New order #1024
                  </span>{" "}
                  placed by Alex K.
                </p>
                <span className="text-sm text-gray-400 ml-auto">
                  2 mins ago
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Sokchea</span>{" "}
                  updated product "Wireless Headphones"
                </p>
                <span className="text-sm text-gray-400 ml-auto">
                  1 hour ago
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">
                    Low stock alert
                  </span>{" "}
                  for "Smart Watch Series 7"
                </p>
                <span className="text-sm text-gray-400 ml-auto">
                  3 hours ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
