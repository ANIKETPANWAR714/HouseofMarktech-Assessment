"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Pending Bookings
  const fetchPendingBookings = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/admin/pending");
      setBookings(res.data);
    } catch (error) {
      // Handle error
      console.error(
        "Error fetching pending bookings:",
        error?.response?.data?.message || error.message
      );
      alert("Error fetching pending bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  // Approve Booking
  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/api/admin/${id}`, { status: "approved" });
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
      alert("Booking approved");
    } catch (error) {
      // Handle error
      console.error(
        "Error approving booking:",
        error?.response?.data?.message || error.message
      );
      alert("Error approving booking. Please try again.");
    }
  };

  // Reject Booking
  const handleReject = async (id) => {
    try {
      await axiosInstance.put(`/api/admin/${id}`, { status: "rejected" });
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
      alert("Booking rejected");
    } catch (error) {
      // Handle error
      console.error(
        "Error rejecting booking:",
        error?.response?.data?.message || error.message
      );
      alert("Error rejecting booking. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-500">No pending bookings</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="border p-4 rounded-md flex justify-between items-center bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    User: {booking.user}
                  </p>
                  <p className="text-gray-600">Room: {booking.roomId?.name}</p>
                  <p className="text-sm text-gray-500">
                    Status: {booking.status}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(booking._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(booking._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
