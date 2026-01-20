"use client";
import React from "react";
import { FaBell } from "react-icons/fa6";
import Link from "next/link";

const NotificationBell = () => {
  return (
    <Link href="/notifications" className="indicator cursor-pointer group">
      <FaBell className="text-2xl text-gray-600 group-hover:text-green-700 transition-colors duration-200" />
    </Link>
  );
};

export default NotificationBell;
