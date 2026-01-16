"use client";
import React, { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setIsLoading(true);
    apiClient
      .get("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load categories");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="bg-gray-50 flex justify-start min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          <button className="btn bg-green-800 hover:bg-green-700 text-white border-none normal-case gap-2">
            <FaPlus /> Add Category
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center">
              <span className="loading loading-spinner loading-lg text-green-800"></span>
            </div>
          ) : (
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                  <th className="py-4 pl-6 text-left">Name</th>
                  <th className="py-4 text-left">Products Count</th>
                  <th className="py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 pl-6 font-medium text-gray-800">
                      {cat.name}
                    </td>
                    <td className="text-gray-500">12 (demo)</td>
                    <td className="py-4 pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="btn btn-sm btn-square btn-ghost text-blue-600 hover:bg-blue-50">
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm btn-square btn-ghost text-red-500 hover:bg-red-50">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
