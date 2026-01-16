"use client";
import React, { useEffect, useState, use } from "react";
import { DashboardSidebar } from "@/components";
import { FaSave, FaTrash, FaArrowLeft } from "react-icons/fa";
import apiClient from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { convertCategoryNameToURLFriendly } from "../../../../../utils/categoryFormating";

interface Category {
    id: string;
    name: string;
}

interface EditCategoryPageProps {
    params: Promise<{ id: string }>;
}

const EditCategoryPage = ({ params }: EditCategoryPageProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(\`/api/categories/\${id}\`);
            if (response.ok) {
                const data = await response.json();
                setName(data.name);
            } else {
                toast.error("Category not found");
                router.push("/admin/categories");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load category");
        } finally {
            setIsLoading(false);
        }
    };
    fetchCategory();
  }, [id, router]);

  const handleUpdate = async () => {
    if (!name.trim()) {
        toast.error("Category name is required");
        return;
    }

    try {
        const response = await apiClient.put(\`/api/categories/\${id}\`, { 
            name: convertCategoryNameToURLFriendly(name) 
        });
        
        if (response.ok) {
            toast.success("Category updated successfully!");
            router.push("/admin/categories");
        } else {
            toast.error("Failed to update category");
        }
    } catch (error) {
        toast.error("An error occurred");
    }
  };

  const handleDelete = async () => {
      if (!confirm("Are you sure you want to delete this category? Products in this category might be affected.")) return;

      try {
        const response = await apiClient.delete(\`/api/categories/\${id}\`);
        if (response.status === 204) {
            toast.success("Category deleted");
            router.push("/admin/categories");
        } else {
            toast.error("Failed to delete category");
        }
      } catch (error) {
          toast.error("Error deleting category");
      }
  };

  if (isLoading) {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-50">
            <span className="loading loading-spinner loading-lg text-green-800"></span>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 flex justify-start min-h-screen">
      <DashboardSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-xl mx-auto">
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="btn btn-circle btn-ghost">
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Edit Category</h1>
                </div>
                <button 
                    onClick={handleDelete}
                    className="btn btn-ghost text-red-500 hover:bg-red-50"
                >
                    <FaTrash /> Delete
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="form-control w-full mb-6">
                    <label className="label">
                        <span className="label-text font-medium text-gray-700">Category Name <span className="text-red-500">*</span></span>
                    </label>
                    <input 
                        type="text" 
                        className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button 
                         onClick={() => router.back()}
                        className="btn btn-ghost"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleUpdate} 
                        className="btn bg-green-800 hover:bg-green-700 text-white border-none gap-2"
                    >
                        <FaSave /> Save Changes
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryPage;
