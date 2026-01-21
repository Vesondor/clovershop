"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { convertCategoryNameToURLFriendly as convertSlugToURLFriendly } from "@/utils/categoryFormating";
import { sanitizeFormData } from "@/lib/form-sanitize";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddNewProduct = () => {
  const [product, setProduct] = useState<{
    merchantId?: string;
    title: string;
    price: number;
    manufacturer: string;
    inStock: number;
    mainImage: string;
    description: string;
    slug: string;
    categoryId: string;
  }>({
    merchantId: "",
    title: "",
    price: 0,
    manufacturer: "",
    inStock: 1,
    mainImage: "",
    description: "",
    slug: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const addProduct = async () => {
    if (
      product.title === "" ||
      product.manufacturer === "" ||
      product.description == ""
    ) {
      toast.error("Please enter values in input fields");
      return;
    }

    try {
      // Sanitize form data before sending to API
      const sanitizedProduct = sanitizeFormData(product);

      console.log("Sending product data:", sanitizedProduct);

      // Correct usage of apiClient.post
      const response = await apiClient.post(`/api/products`, sanitizedProduct);

      if (response.status === 201) {
        const data = await response.json();
        console.log("Product created successfully:", data);
        toast.success("Product added successfully");
        setProduct({
          merchantId: "",
          title: "",
          price: 0,
          manufacturer: "",
          inStock: 1,
          mainImage: "",
          description: "",
          slug: "",
          categoryId: categories[0]?.id || "",
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to create product:", errorData);
        toast.error(`"Error:" ${errorData.message || "Failed to add product"}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const fetchMerchants = async () => {
    try {
      const res = await apiClient.get("/api/merchants");
      const data: Merchant[] = await res.json();
      setMerchants(data || []);
      setProduct((prev) => ({
        ...prev,
        merchantId: prev.merchantId || data?.[0]?.id || "",
      }));
    } catch (e) {
      toast.error("Failed to load merchants");
    }
  };

  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      const response = await apiClient.post("/api/upload", formData);

      if (response.ok) {
        const data = await response.json();
        setProduct({ ...product, mainImage: data.fileName });
        toast.success("Image uploaded successfully");
      } else {
        console.error("File upload unsuccessfull");
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error happend while sending request:", error);
    }
  };

  const fetchCategories = async () => {
    apiClient
      .get(`/api/categories`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setProduct({
          merchantId: product.merchantId || "",
          title: "",
          price: 0,
          manufacturer: "",
          inStock: 1,
          mainImage: "",
          description: "",
          slug: "",
          categoryId: data[0]?.id,
        });
      });
  };

  useEffect(() => {
    fetchCategories();
    fetchMerchants();
  }, []);

  return (
    <div className="bg-gray-50 flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:ml-5 max-xl:px-5 w-full p-8">
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Add New Product
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Basic Information
              </h2>

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Product Name <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Wireless Headphones"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  value={product?.title}
                  onChange={(e) =>
                    setProduct({ ...product, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Manufacturer <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sony"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  value={product?.manufacturer}
                  onChange={(e) =>
                    setProduct({ ...product, manufacturer: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32 w-full focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  placeholder="Product details..."
                  value={product?.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                  required
                ></textarea>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Product Image
              </h2>
              <div className="flex items-center gap-6">
                <div className="shrink-0">
                  {product?.mainImage ? (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={`/${product.mainImage}`}
                        alt="Product preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <label className="form-control w-full max-w-sm">
                    <div className="label">
                      <span className="label-text font-medium text-gray-700">
                        Upload Image
                      </span>
                    </div>
                    <input
                      type="file"
                      className="file-input file-input-bordered file-input-md w-full focus:outline-none focus:ring-2 focus:ring-green-800"
                      onChange={(e: any) => {
                        if (e.target.files?.[0]) {
                          uploadFile(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="label">
                      <span className="label-text-alt text-gray-500">
                        Supported formats: JPG, PNG, WEBP
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Pricing & Inventory
              </h2>

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Price ($) <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.00"
                  className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  value={product?.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Stock Status
                  </span>
                </label>
                <select
                  className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  value={product?.inStock}
                  onChange={(e) =>
                    setProduct({ ...product, inStock: Number(e.target.value) })
                  }
                >
                  <option value={1}>In Stock</option>
                  <option value={0}>Out of Stock</option>
                </select>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </span>
                </label>
                <select
                  className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  value={product?.categoryId}
                  onChange={(e) =>
                    setProduct({ ...product, categoryId: e.target.value })
                  }
                >
                  {categories.map((category: any) => (
                    <option key={category?.id} value={category?.id}>
                      {category?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={addProduct}
                type="button"
                className="btn bg-green-800 hover:bg-green-700 text-white w-full border-none text-lg normal-case"
              >
                Publish Product
              </button>
              <button
                type="button"
                className="btn btn-outline text-gray-600 hover:bg-gray-100 hover:text-gray-800 w-full normal-case"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewProduct;
