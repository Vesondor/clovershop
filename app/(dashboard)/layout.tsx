import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Authentication removed as per request

  return <>{children}</>;
}
