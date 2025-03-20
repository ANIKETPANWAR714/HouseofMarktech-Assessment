"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../utils/axiosInstance";

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Set loading state

    try {
      const res = await axiosInstance.post("/api/admin/login", {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("adminToken", res.data.token);
      alert("Admin login successful");
      console.log("Admin Data:", res.data.admin);
      router.push("/admin-dashboard"); // Redirect after successful login
    } catch (error) {
      console.error(
        "Admin Login Error:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-600 text-white font-medium p-3 rounded-md transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Back to Home Link */}
        <p className="text-center text-gray-500 mt-4">
          Go back to{" "}
          <a href="/" className="text-purple-500 hover:underline">
            Home
          </a>
        </p>
      </div>
    </div>
  );
}
