// *********************
// Role of the component: Header component
// Name of the component: Header.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.1 (No Auth)
// Component call: <Header />
// Input parameters: no input parameters
// Output: Header component
// *********************

"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import HeaderTop from "./HeaderTop";
import SearchInput from "./SearchInput";
import Link from "next/link";
import { FaUser } from "react-icons/fa6";
import CartElement from "./CartElement";
import NotificationBell from "./NotificationBell";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";

const Header = () => {
  const pathname = usePathname();
  const { wishlist } = useWishlistStore();

  // Without auth, we can't fetch wishlist by user ID easily unless we use local storage or similar.
  // For now, removing the effective logic that depended on session.

  return (
    <header className="bg-white">
      <HeaderTop />
      {pathname.startsWith("/admin") === false && (
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-between px-6 md:px-12 py-4 gap-y-4 max-w-screen-2xl mx-auto">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 mr-10 scale-90 md:scale-100 transition-transform"
            >
              <img
                src="/logo v1 svg.svg"
                width={200}
                height={200}
                alt="clover logo"
                className="w-40 md:w-56 h-auto"
              />
            </Link>

            {/* Search Input */}
            <div className="w-full lg:flex-1 lg:max-w-xl order-3 lg:order-2 text-center lg:mx-auto">
              <SearchInput />
            </div>

            {/* Icons */}
            <div className="flex gap-x-6 md:gap-x-8 items-center ml-auto lg:ml-10 order-2 lg:order-3">
              {/* <NotificationBell /> */}
              {/* <CartElement /> */}

              {/* User / Admin Menu - Always Visible */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full bg-green-100 text-green-800"></div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link href="/admin" className="justify-between">
                      Dashboard
                      <span className="badge badge-success text-white text-xs">
                        Admin
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
