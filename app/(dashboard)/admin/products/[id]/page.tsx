"use client";
import React, { useEffect, useState, use } from "react";
import { DashboardSidebar } from "@/components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";
import { formatCategoryName } from "../../../../../utils/categoryFormating";
import { FaSave, FaTrash, FaArrowLeft } from "react-icons/fa";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  mainImage: string;
  manufacturer: string;
  inStock: number;
  categoryId: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
}

interface DashboardProductDetailsProps {
  params: Promise<{ id: string }>;
}

const EditProduct = ({ params }: DashboardProductDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productRes, categoriesRes] = await Promise.all([
          apiClient.get(`/api/products/${id}`),
          apiClient.get("/api/categories"),
        ]);

        if (!productRes.ok) throw new Error("Product not found");

        const productData = await productRes.json();
        const categoriesData = await categoriesRes.json();

        setProduct(productData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const updateProduct = async () => {
    if (!product) return;

    if (!product.title || !product.price || !product.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await apiClient.put(`/api/products/${id}`, {
        title: product.title,
        price: Number(product.price),
        description: product.description,
        manufacturer: product.manufacturer,
        inStock: Number(product.inStock),
        categoryId: product.categoryId,
        mainImage: product.mainImage,
        slug: product.slug, // Keep existing slug or handle updates if needed
      });

      if (response.ok) {
        toast.success("Product updated successfully!");
        router.push("/admin/products");
      } else {
        toast.error("Failed to update product");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const deleteProduct = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await apiClient.delete(`/api/products/${id}`);
      if (response.status === 204) {
        toast.success("Product deleted successfully");
        router.push("/admin/products");
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred during deletion");
    }
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiClient.post("/api/upload", formData);
      if (response.ok) {
        const data = await response.json();
        if (product) {
          setProduct({ ...product, mainImage: data.file });
        }
        toast.success("Image uploaded!");
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      toast.error("Error uploading image");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-green-800"></span>
      </div>
    );
  }

  if (!product)
    return <div className="p-10 text-center">Product not found</div>;

  return (
    <div className="bg-gray-50 flex justify-start min-h-screen">
      <DashboardSidebar />

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="btn btn-circle btn-ghost"
              >
                <FaArrowLeft />
              </button>
              <h1 className="text-3xl font-bold text-green-800">
                Edit Product
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={deleteProduct}
                className="btn btn-ghost text-red-500 hover:bg-red-50"
              >
                <FaTrash /> Delete
              </button>
              <button
                onClick={updateProduct}
                className="btn bg-green-800 hover:bg-green-700 text-white border-none gap-2"
              >
                <FaSave /> Save Changes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">
                      Product Title <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                    value={product.title}
                    onChange={(e) =>
                      setProduct({ ...product, title: e.target.value })
                    }
                  />
                </div>

                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">
                      Description
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-32 w-full focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                    value={product.description}
                    onChange={(e) =>
                      setProduct({ ...product, description: e.target.value })
                    }
                  ></textarea>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Images
                </h3>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">
                      Main Image
                    </span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered file-input-success w-full"
                    onChange={uploadFile}
                  />
                  {product.mainImage && (
                    <div className="mt-4 relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={
                          product.mainImage.startsWith("http")
                            ? product.mainImage
                            : `/${product.mainImage}`
                        }
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">
                      Price ($) <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                    value={product.price}
                    onChange={(e) =>
                      setProduct({ ...product, price: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                    value={product.categoryId}
                    onChange={(e) =>
                      setProduct({ ...product, categoryId: e.target.value })
                    }
                  >
                    <option disabled value="">
                      Select Category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {formatCategoryName(cat.name)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">
                      Manufacturer
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                    value={product.manufacturer}
                    onChange={(e) =>
                      setProduct({ ...product, manufacturer: e.target.value })
                    }
                  />
                </div>

                <div className="form-control w-full mb-4">
                  <label className="label cursor-pointer justify-start gap-4">
                    <span className="label-text font-medium text-gray-700">
                      In Stock
                    </span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-success"
                      checked={product.inStock === 1}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          inStock: e.target.checked ? 1 : 0,
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
