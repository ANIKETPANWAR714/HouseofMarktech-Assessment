"use client";
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { ROOMS } from "../constants/rooms";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    roomId: "",
    startDate: "",
    endDate: "",
  });

  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "roomId") {
      const selectedRoom = ROOMS.find((room) => room.number === value);
      setPrice(selectedRoom ? selectedRoom.price : null);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roomId || !formData.startDate || !formData.endDate) {
      toast.error("All fields are required");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setLoading(true);
    try {
      // Send booking request to backend
      const response = await axiosInstance.post("/api/bookings", formData);
      toast.success(response.data.message); // "Booking request sent. Waiting for admin approval."

      // Reset form after submission
      setFormData({
        roomId: "",
        startDate: "",
        endDate: "",
      });
      setPrice(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-xl font-semibold mb-4">Book a Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Room Type */}
        <div>
          <label className="block text-gray-700 font-medium">Room Type</label>
          <select
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Type</option>
            {ROOMS.map((room) => (
              <option key={room.number} value={room.number}>
                {room.type} (#{room.number})
              </option>
            ))}
          </select>

          {/* Display Price */}
          {price !== null && (
            <div className="text-green-500 font-medium mt-1">
              Price: ${price} per night
            </div>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-gray-700 font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-gray-700 font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full bg-purple-600 text-white py-2 rounded-md ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
