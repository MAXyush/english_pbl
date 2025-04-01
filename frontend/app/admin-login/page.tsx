"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const HostLoginPage = () => {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (password === "Ayush@123") {
      // Correct password
      localStorage.setItem("admin", "This guy is Admin Ayush@123");
      router.push("/admin");
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800 text-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl text-black font-semibold mb-4">Host Login</h2>
        <input
          type="password"
          className="w-full p-3 border text-black border-gray-300 rounded-lg mb-4"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white p-3 rounded-lg"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default HostLoginPage;
