"use client";
import React, { ChangeEvent, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e: FormEvent) => {
   e.preventDefault();
   setLoading(true);

   try {
     const res = await axiosInstance.post("/api/auth/login", formData);
     const { token } = res.data;
     console.log("Login Response:", res.data);
     console.log(token)

     if (token) {
       localStorage.setItem("token", token); // Save token in local storage
       axiosInstance.defaults.headers.common[
         "Authorization"
       ] = `Bearer ${token}`; // Attach token directly
       toast.success("Login successful");
       router.push("/booking"); // Redirect to booking page after login
     } else {
       toast.error("Failed to retrieve token");
     }
   } catch (error) {
     if (axios.isAxiosError(error)) {
       console.error("Axios Error:", error.response?.data);
       toast.error(
         error.response?.data?.message || "Invalid email or password"
       );
     } else {
       console.error("Unexpected Error:", error);
       toast.error("An unexpected error occurred.");
     }
   } finally {
     setLoading(false);
   }
 };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
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
            className="w-full bg-purple-600 text-white font-medium p-3 rounded-md hover:bg-purple-700 transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-gray-500 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-purple-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
