"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import WishItem from "@/components/WishItem";
import { nanoid } from "nanoid";
import React from "react";

export const WishlistModule = () => {
  const { wishlist } = useWishlistStore();

  // Auth removed - Wishlist fetching logic depended on user session.
  // Ideally this should use local storage or a guest ID in the future.
  // For now, it will use the Zustand store state (which might be empty on refresh).

  return (
    <>
      {wishlist && wishlist.length === 0 ? (
        <h3 className="text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl max-sm:pt-5 max-[400px]:text-xl">
          No items found in the wishlist
        </h3>
      ) : (
        <div className="max-w-screen-2xl mx-auto">
          <div className="overflow-x-auto">
            <table className="table text-center">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-accent-content">Image</th>
                  <th className="text-accent-content">Name</th>
                  <th className="text-accent-content">Stock Status</th>
                  <th className="text-accent-content">Action</th>
                </tr>
              </thead>
              <tbody>
                {wishlist &&
                  wishlist?.map((item) => (
                    <WishItem
                      id={item?.id}
                      title={item?.title}
                      price={item?.price}
                      image={item?.image}
                      slug={item?.slug}
                      stockAvailabillity={item?.stockAvailabillity}
                      key={nanoid()}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
