"use client";

import { useRouter } from "next/navigation";

const SelectRolePage = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-purple-800">
      <div className="text-center">
        <h1 className="text-white text-2xl mb-6">Select Your Role</h1>
        <div className="space-x-4">
          <button
            onClick={() => router.push("/login")}
            className="bg-white text-purple-800 px-6 py-2 rounded-lg hover:bg-purple-700 hover:text-white transition"
          >
            User
          </button>
          <button
            onClick={() => router.push("/admin-page")}
            className="bg-white text-purple-800 px-6 py-2 rounded-lg hover:bg-purple-700 hover:text-white transition"
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectRolePage;
