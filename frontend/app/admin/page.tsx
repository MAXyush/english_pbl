"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the Vote type based on the Django model
interface Vote {
  id: number;
  username: string;
  book: string;
  created_at: string;
}

export default function HostControlsPage() {
  const [votingStopped, setVotingStopped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoadingVotes, setIsLoadingVotes] = useState(false);
  const router = useRouter();

  // Fetch votes when component mounts
  useEffect(() => {
    const fetchVotes = async () => {
      setIsLoadingVotes(true);
      try {
        // Replace with your actual API endpoint to fetch votes
        const response = await fetch("http://localhost:3000/api/votes");
        const data = await response.json();
        setVotes(data);
      } catch (error) {
        console.error("Failed to fetch votes:", error);
      } finally {
        setIsLoadingVotes(false);
      }
    };

    fetchVotes();
  }, []);

  const handleStopVoting = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API endpoint to stop voting
      await fetch("http://localhost:3000/api/voting-results", {
        method: "POST",
      });
      setVotingStopped(true);

      // Refresh votes after stopping
      const response = await fetch("http://localhost:3000/api/votes");
      const data = await response.json();
      setVotes(data);
    } catch (error) {
      console.error("Failed to stop voting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisplayResults = () => {
    router.push("/results");
  };

  // Format date for better readability
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-900 py-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 w-full max-w-md mb-8">
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

      {/* Votes Table */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          User Votes
        </h2>

        {isLoadingVotes ? (
          <div className="text-center text-white">Loading votes...</div>
        ) : votes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-left">
                  <th className="p-4 text-white font-medium rounded-tl-lg">
                    User
                  </th>
                  <th className="p-4 text-white font-medium">Book</th>
                  <th className="p-4 text-white font-medium rounded-tr-lg">
                    Voted At
                  </th>
                </tr>
              </thead>
              <tbody>
                {votes.map((vote, index) => (
                  <tr
                    key={vote.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-800/50" : "bg-gray-700/50"
                    } hover:bg-gray-600/50 transition-colors`}
                  >
                    <td className="p-4 text-white border-t border-gray-700">
                      {vote.username}
                    </td>
                    <td className="p-4 text-white border-t border-gray-700">
                      {vote.book}
                    </td>
                    <td className="p-4 text-white border-t border-gray-700">
                      {formatDate(vote.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-white p-4 bg-gray-800/50 rounded-lg">
            No votes have been cast yet.
          </div>
        )}
      </div>
    </div>
  );
}
