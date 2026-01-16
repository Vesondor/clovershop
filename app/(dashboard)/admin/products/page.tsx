"use client";
import { DashboardProductTable, DashboardSidebar } from "@/components";
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
