// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductsSection slug={slug} />
// Input parameters: no input parameters
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import prisma from "@/utils/db";

const ProductsSection = async () => {
  /*
   * Replace API call with direct DB call for Server Component to avoid build-time fetch errors
   * (ECONNREFUSED) when API server isn't running.
   */
  const products: any[] = await prisma.product.findMany({
    take: 10, // Limit to featured products, or remove for all
  });

  return (
    <div className="bg-green-800 border-white">
      <div className="max-w-screen-2xl mx-auto pt-20">
        <Heading title="FEATURED PRODUCTS" />
        <div className="grid grid-cols-4 justify-items-center max-w-screen-2xl mx-auto py-10 gap-x-2 px-6 md:px-10 gap-y-8 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductItem key={product.id} product={product} color="white" />
            ))
          ) : (
            <div className="col-span-full text-center text-white py-10">
              <p>No products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
