import Link from "next/link";
import React from "react";
import { FaHeadphones, FaRegEnvelope } from "react-icons/fa6";

const HeaderTop = () => {
  return (
    <div className="h-10 text-white bg-green-700 max-lg:px-5 max-lg:h-auto max-lg:py-2">
      <div className="flex justify-between items-center h-full max-w-screen-2xl mx-auto px-12 max-lg:px-0 max-lg:flex-col max-lg:gap-y-2">
        <ul className="flex items-center gap-x-5 max-[340px]:flex-col max-[340px]:gap-y-1">
          <li className="flex items-center gap-x-2 text-sm font-semibold">
            <FaHeadphones className="text-yellow-300" />
            <span>+855 876 269 463</span>
          </li>
          <li className="flex items-center gap-x-2 text-sm font-semibold">
            <FaRegEnvelope className="text-yellow-300" />
            <span>cloverfootwear@gmail.com</span>
          </li>
        </ul>
        <div className="flex items-center gap-x-5">
          <Link href="/">
            <span className="text-sm font-semibold">CLOVER SHOP</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
