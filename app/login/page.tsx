"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaLock } from "react-icons/fa6";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Hardcoded credentials as requested
    // "clover@clovershop.com" / "sokchea0308"
    if (email === "clover@clovershop.com" && password === "sokchea0308") {
      // Set local storage
      localStorage.setItem("clover_admin_auth", "true");
      localStorage.setItem("clover_user_role", "admin");

      toast.success("Login successful!");
      router.push("/admin");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700 text-2xl">
            <FaLock />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">
            Access the Clover Dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn bg-green-700 hover:bg-green-800 text-white w-full border-none"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-gray-500 hover:text-green-700">
            ← Back to Shop
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
