"use client";
import DashboardProductTable from "@/components/DashboardProductTable";
import DashboardSidebar from "@/components/DashboardSidebar";
import React from "react";

const DashboardProducts = () => {
  return (
    <div className="bg-white flex justify-start mx-auto h-full">
      <DashboardSidebar />
      <DashboardProductTable />
    </div>
  );
};

export default DashboardProducts;
