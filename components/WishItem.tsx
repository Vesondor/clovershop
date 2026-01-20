"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaTrash } from "react-icons/fa6";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";

interface WishItemProps {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailabillity: number;
}

const WishItem = ({
  id,
  title,
  price,
  image,
  slug,
  stockAvailabillity,
}: WishItemProps) => {
  const { removeFromWishlist } = useWishlistStore();
  const { addToCart } = useProductStore();

  const handleAddToCart = () => {
    addToCart({
      id,
      title,
      price,
      image,
      amount: 1,
    });
    toast.success("Added to cart");
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-2">
        <button
          onClick={() => {
            removeFromWishlist(id);
            toast.success("Removed from wishlist");
          }}
          className="btn btn-ghost btn-xs text-red-500 hover:bg-red-50"
        >
          <FaTrash />
        </button>
      </td>
      <td className="px-4 py-2">
        <Link href={`/product/${slug}`}>
          <div className="avatar">
            <div className="w-16 h-16 rounded-md overflow-hidden relative">
              {image && (
                <Image
                  src={image.startsWith("http") ? image : `/${image}`}
                  alt={title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </Link>
      </td>
      <td className="px-4 py-2 font-medium">
        <Link
          href={`/product/${slug}`}
          className="hover:text-green-600 transition-colors"
        >
          {title}
        </Link>
      </td>
      <td className="px-4 py-2">
        {stockAvailabillity > 0 ? (
          <span className="badge badge-success text-white text-xs">
            In Stock
          </span>
        ) : (
          <span className="badge badge-error text-white text-xs">
            Out of Stock
          </span>
        )}
      </td>
      <td className="px-4 py-2">
        <button
          onClick={handleAddToCart}
          disabled={stockAvailabillity <= 0}
          className="btn btn-sm btn-outline border-gray-300 hover:border-green-600 hover:bg-green-600 hover:text-white"
        >
          Add to Cart
        </button>
      </td>
    </tr>
  );
};

export default WishItem;
