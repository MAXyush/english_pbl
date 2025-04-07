"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const HostLoginPage = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only remove admin status, preserve user token
    localStorage.removeItem("admin");
    
    // If user is already logged in as admin, redirect to admin page
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("admin") === "true";
    if (token && isAdmin) {
      router.push("/admin");
    }
  }, []);

  const handleLogin = async () => {
    if (!password) {
      alert("Please enter a password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/accounts/login/", {
        username: "admin",
        password: password
      });

      if (response.data.is_admin) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", "true");
        router.push("/admin");
      } else {
        alert("You do not have admin privileges");
        localStorage.removeItem("admin");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-700 to-purple-900">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl text-white font-semibold mb-4">Host Login</h2>
        <input
          type="password"
          className="w-full p-3 border border-white/20 rounded-lg mb-4 bg-white/10 text-white placeholder-white/50"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-colors mb-4"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <button
          className="w-full bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors"
          onClick={handleBackToHome}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default HostLoginPage;
