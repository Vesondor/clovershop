// *********************
// Role of the component: Header component
// Name of the component: Header.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Header />
// Input parameters: no input parameters
// Output: Header component
// *********************

"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import HeaderTop from "./HeaderTop";
import Image from "next/image";
import SearchInput from "./SearchInput";
import Link from "next/link";
import { FaBell, FaUser } from "react-icons/fa6";

import CartElement from "./CartElement";
import NotificationBell from "./NotificationBell";
import HeartElement from "./HeartElement";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { wishlist, setWishlist, wishQuantity } = useWishlistStore();

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };

  // getting all wishlist items by user id
  const getWishlistByUserId = async (id: string) => {
    const response = await apiClient.get(`/api/wishlist/${id}`, {
      cache: "no-store",
    });
    const wishlist = await response.json();
    const productArray: {
      id: string;
      title: string;
      price: number;
      image: string;
      slug: string;
      stockAvailabillity: number;
    }[] = [];

    return; // temporary disable wishlist fetching while the issue is being resolved

    wishlist.map((item: any) =>
      productArray.push({
        id: item?.product?.id,
        title: item?.product?.title,
        price: item?.product?.price,
        image: item?.product?.mainImage,
        slug: item?.product?.slug,
        stockAvailabillity: item?.product?.inStock,
      })
    );

    setWishlist(productArray);
  };

  // getting user by email so I can get his user id
  const getUserByEmail = async () => {
    if (session?.user?.email) {
      apiClient
        .get(`/api/users/email/${session?.user?.email}`, {
          cache: "no-store",
        })
        .then((response) => response.json())
        .then((data) => {
          getWishlistByUserId(data?.id);
        });
    }
  };

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email, wishlist.length]);

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

            {/* Search Input - Full width on mobile, centered on desktop */}
            <div className="w-full lg:flex-1 lg:max-w-xl order-3 lg:order-2 text-center lg:mx-auto">
              <SearchInput />
            </div>

            {/* Icons */}
            <div className="flex gap-x-6 md:gap-x-8 items-center ml-auto lg:ml-10 order-2 lg:order-3">
              <NotificationBell />
              <CartElement />
            </div>
          </div>
        </div>
      )}
      {/* {pathname.startsWith("/admin") === true && (
        <div className="flex justify-between h-32 bg-white items-center px-16 max-[1320px]:px-10  max-w-screen-2xl mx-auto max-[400px]:px-5">
          <Link href="/">
            <Image
              src="/logo v1 svg.svg"
              width={130}
              height={130}
              alt="singitronic logo"
              className="w-56 h-auto"
            />
          </Link>
          <div className="flex gap-x-5 items-center">
            <NotificationBell />
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="w-10">
                <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
                  <FaUser style={{ fontSize: "1.5rem" }} />
                </button>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href="/admin">Dashboard</Link>
                </li>
                <li>
                  <a>Profile</a>
                </li>
                <li onClick={handleLogout}>
                  <a href="#">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )} */}
    </header>
  );
};

export default Header;
