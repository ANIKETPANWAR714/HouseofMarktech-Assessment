"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

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
      await axiosInstance.post("/api/auth/register", formData);
      toast.success("Signup successful! Please log in.");
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        console.error("Axios Error:", axiosError.response?.data);
        toast.error(
          `Error: ${
            axiosError.response?.data?.message || "Something went wrong!"
          }`
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
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

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
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-purple-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
