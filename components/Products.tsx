// *********************
// Role of the component: Showing products on the shop page with applied filter and sort
// Name of the component: Products.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Products params={params} searchParams={searchParams} />
// Input parameters: { params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }
// Output: products grid
// *********************

import React from "react";
import apiClient from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

const Products = async ({
  params,
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // getting all data from URL slug and preparing everything for sending GET request
  const inStockNum = searchParams?.inStock === "true" ? 1 : 0;
  const outOfStockNum = searchParams?.outOfStock === "true" ? 1 : 0;
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  let stockMode: string = "lte";

  // preparing inStock and out of stock filter for GET request
  // If in stock checkbox is checked, stockMode is "equals"
  if (inStockNum === 1) {
    stockMode = "equals";
  }
  // If out of stock checkbox is checked, stockMode is "lt"
  if (outOfStockNum === 1) {
    stockMode = "lt";
  }
  // If in stock and out of stock checkboxes are checked, stockMode is "lte"
  if (inStockNum === 1 && outOfStockNum === 1) {
    stockMode = "lte";
  }
  // If in stock and out of stock checkboxes aren't checked, stockMode is "gt"
  if (inStockNum === 0 && outOfStockNum === 0) {
    stockMode = "gt";
  }

  let products = [];

  try {
    // sending API request with filtering, sorting and pagination for getting all products
    const data = await apiClient.get(
      `/api/products?filters[price][$lte]=${
        searchParams?.price || 3000
      }&filters[rating][$gte]=${
        Number(searchParams?.rating) || 0
      }&filters[inStock][$${stockMode}]=1&${
        params?.slug && params.slug.length > 0
          ? `filters[category][$equals]=${params.slug}&`
          : ""
      }sort=${searchParams?.sort}&page=${page}`
    );

    if (!data.ok) {
      console.error("Failed to fetch products:", data.statusText);
      products = [];
    } else {
      const result = await data.json();
      products = Array.isArray(result) ? result : [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    products = [];
  }

  return (
    <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.length > 0 ? (
        products.map((product: any) => (
          <div
            key={product.id}
            className="group relative flex flex-col h-full overflow-hidden rounded-lg transition-all duration-300 hover:shadow-2xl bg-white border border-gray-100 p-5"
          >
            {/* Image Container */}
            <Link
              href={`/product/${product.slug}`}
              className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center p-4 mb-4"
            >
              <Image
                src={
                  product.mainImage
                    ? product.mainImage.startsWith("http")
                      ? product.mainImage
                      : `/${product.mainImage}`
                    : "/product_placeholder.jpg"
                }
                width="0"
                height="0"
                sizes="100vw"
                className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                alt={product?.title || "Product image"}
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            </Link>

            {/* Content Container */}
            <div className="flex flex-col flex-grow space-y-3">
              {/* Title */}
              <Link
                href={`/product/${product.slug}`}
                className="text-base font-medium tracking-wide transition-colors duration-200 line-clamp-2 text-gray-900 group-hover:text-green-700"
              >
                {product.title}
              </Link>

              {/* Price */}
              <p className="text-xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </p>

              {/* Button */}
              <Link
                href={`/product/${product?.slug}`}
                className="mt-auto w-full py-3 px-6 text-sm font-semibold tracking-wider uppercase text-center rounded-md transition-all duration-300 bg-gray-900 text-white hover:bg-green-700 hover:shadow-lg"
              >
                View Details
              </Link>
            </div>
          </div>
        ))
      ) : (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
          No products found for specified query
        </h3>
      )}
    </div>
  );
};

export default Products;
