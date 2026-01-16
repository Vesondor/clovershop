"use client";
import React, { useState } from "react";
import { DashboardSidebar } from "@/components";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const AddNewCategory = () => {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const response = await apiClient.post("/api/categories", { name });
      if (response.ok) {
        toast.success("Category created successfully!");
        router.push("/admin/categories");
      } else {
        toast.error("Failed to create category");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="bg-gray-50 flex justify-start min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 p-8">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="btn btn-circle btn-ghost"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Add Category</h1>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Category Name <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. Smart Phones"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => router.back()} className="btn btn-ghost">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn bg-green-800 hover:bg-green-700 text-white border-none gap-2"
              >
                <FaSave /> Save Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewCategory;
