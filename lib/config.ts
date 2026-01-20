const config = {
  apiBaseUrl:
    typeof window !== "undefined"
      ? "" // Client side: use relative path
      : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
};

export default config;
