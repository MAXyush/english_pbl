"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HostControlsPage() {
  const [votingStopped, setVotingStopped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStopVoting = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API endpoint to stop voting
      await fetch("http://localhost:8000/api/voting-results", {
        method: "POST",
      });
      setVotingStopped(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to stop voting:", error);
      setIsLoading(false);
    }
  };

  const handleDisplayResults = () => {
    router.push("/results");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Host Controls
        </h1>

        <button
          onClick={handleStopVoting}
          disabled={votingStopped || isLoading}
          className={`w-full py-4 rounded-lg text-white font-medium text-lg mb-4 transition-colors ${
            votingStopped
              ? "bg-red-800 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isLoading
            ? "Processing..."
            : votingStopped
            ? "Voting Stopped"
            : "Stop Voting"}
        </button>

        <button
          onClick={handleDisplayResults}
          className="w-full py-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-lg transition-colors"
        >
          Display Results
        </button>
      </div>
    </div>
  );
}
