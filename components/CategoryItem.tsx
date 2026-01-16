// *********************
// Role of the component: Category Item that will display category icon, category name and link to the category
// Name of the component: CategoryItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryItem title={title} href={href} ><Image /></CategoryItem>
// Input parameters: CategoryItemProps interface
// Output: Category icon, category name and link to the category
// *********************

import Link from "next/link";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const CategoryItem = ({ title, children, href }: CategoryItemProps) => {
  return (
    <Link href={href} className="group">
      <div className="flex flex-col items-center justify-center gap-y-4 p-8 bg-green-800/40 border border-green-800/60 transition-all duration-300 ease-in-out hover:bg-white hover:border-white hover:scale-[1.02] cursor-pointer h-full">
        {/* Icon wrapper with transition */}
        <div className="relative w-12 h-12 text-white group-hover:text-green-500 transition-colors ">
          {children}
        </div>

        <h3 className="font-medium text-sm uppercase tracking-[0.15em] text-green-200 group-hover:text-green-950 transition-colors text-center">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryItem;
