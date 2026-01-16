// *********************
// Role of the component: Category wrapper that will contain title and category items
// Name of the component: CategoryMenu.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryMenu />
// Input parameters: no input parameters
// Output: section title and category items
// *********************

import React from "react";
import CategoryItem from "./CategoryItem";
import { categoryMenuList } from "@/lib/utils";
import Heading from "./Heading";

const CategoryMenu = () => {
  return (
    <div className="py-20 bg-green-700 border-t border-green-800 ">
      <div className="mb-12">
        <Heading title="BROWSE CATEGORIES" />
      </div>
      <div className="max-w-screen-2xl mx-auto gap-6 px-16 max-md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center">
        {categoryMenuList.map((item) => (
          <CategoryItem title={item.title} key={item.id} href={item.href}>
            {item.icon}
          </CategoryItem>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
