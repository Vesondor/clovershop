"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { nanoid } from "nanoid";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const DashboardProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get("/api/products?mode=admin", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // Add delete logic here
      // await apiClient.delete(\`/api/products/\${id}\`);
      // setProducts(products.filter(p => p.id !== id));
      toast.success("Product deleted (simulation)");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-green-800"></span>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-y-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Products
        </h1>
        <Link href="/admin/products/new">
          <button className="btn bg-green-800 hover:bg-green-700 text-white border-none normal-case flex items-center gap-2">
            <FaPlus /> Add New Product
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <th className="py-4 pl-6 text-left">Product</th>
                <th className="py-4 text-left">Category</th>
                <th className="py-4 text-left">Values</th>
                <th className="py-4 text-left">Status</th>
                <th className="py-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    No products found. Add your first one!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id || nanoid()}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="mask mask-rounded w-12 h-12 bg-gray-100 border border-gray-200">
                            <Image
                              src={
                                product?.mainImage
                                  ? product.mainImage.startsWith("http")
                                    ? product.mainImage
                                    : `/${product.mainImage}`
                                  : "/product_placeholder.jpg"
                              }
                              alt={sanitize(product?.title) || "Product"}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-base">
                            {sanitize(product?.title)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {sanitize(product?.manufacturer)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-gray-600 font-medium">
                      {/* If category relationship exists, display name, else ID or placeholder */}
                      {/* Assuming category is populated or we can display ID for now */}
                      <span className="badge badge-ghost badge-sm font-normal">
                        Electronics
                      </span>
                    </td>
                    <td className="text-gray-800 font-bold">
                      {formatPrice(product.price)}
                    </td>
                    <td>
                      {product.inStock ? (
                        <div className="badge bg-green-100 text-green-700 border-none gap-2 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>{" "}
                          In Stock
                        </div>
                      ) : (
                        <div className="badge bg-red-100 text-red-700 border-none gap-2 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>{" "}
                          Out Stock
                        </div>
                      )}
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <button
                            className="btn btn-sm btn-square btn-ghost text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <FaEdit className="text-lg" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn btn-sm btn-square btn-ghost text-red-500 hover:bg-red-50"
                          title="Delete"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardProductTable;
