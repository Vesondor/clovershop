"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check for auth token in local storage
    const isAuthenticated = localStorage.getItem("clover_admin_auth");

    if (isAuthenticated !== "true") {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router, pathname]);

  if (!isAuthorized) {
    return null; // Don't render anything while checking or redirecting
  }

  return <>{children}</>;
}
