// *********************
// Role of the component: Product item component
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// Output: Product item component that contains product image, title, link to the single product page, price, button...
// *********************

import Image from "next/image";
import React from "react";
import Link from "next/link";

import { sanitize } from "@/lib/sanitize";
import { formatPrice } from "@/lib/utils";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  const isDark = color === "black";

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-lg transition-all duration-300 hover:shadow-2xl bg-green-700 p-5">
      {/* Image Container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center p-4"
      >
        <Image
          src={
            product.mainImage
              ? `/${product.mainImage}`
              : "/product_placeholder.jpg"
          }
          width="0"
          height="0"
          sizes="100vw"
          className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
          alt={sanitize(product?.title) || "Product image"}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      </Link>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          className={`text-base font-medium tracking-wide transition-colors duration-200 line-clamp-2 ${
            isDark
              ? "text-gray-900 group-hover:text-gray-600"
              : "text-white group-hover:text-gray-200"
          }`}
        >
          {sanitize(product.title)}
        </Link>

        {/* Price */}
        <p
          className={`text-xl font-bold ${
            isDark ? "text-gray-900" : "text-white"
          }`}
        >
          ${product.price}
        </p>

        {/* Button */}
        <Link
          href={`/product/${product?.slug}`}
          className={`mt-auto w-full py-3 px-6 text-sm font-semibold tracking-wider uppercase text-center rounded-md transition-all duration-300 ${
            isDark
              ? "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg"
              : "bg-white text-gray-900 hover:bg-gray-100 hover:shadow-lg"
          }`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductItem;
