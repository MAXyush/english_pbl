"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Define the Vote type based on the Django model
interface Vote {
  id: number;
  username: string;
  book: string;
  created_at: string;
}

interface VotingStatus {
  is_active: boolean;
  display_results: boolean;
  last_updated: string;
}

interface VoteCount {
  book: string;
  count: number;
}

export default function HostControlsPage() {
  const [votingStatus, setVotingStatus] = useState<VotingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([]);
  const [isLoadingVotes, setIsLoadingVotes] = useState(false);
  const router = useRouter();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("admin") === "true";
    
    if (!token || !isAdmin) {
      router.push("/admin-login");
      return {};
    }
    
    return {
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("admin") === "true";
    
    if (!token || !isAdmin) {
      router.push("/admin-login");
      return;
    }

    const fetchData = async () => {
      try {
        await fetchVotingStatus();
        await fetchVotes();
      } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          router.push("/admin-login");
        }
      }
    };

    fetchData();
    
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchVotingStatus = async () => {
    try {
      console.log('Fetching voting status with headers:', getAuthHeaders());
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/voting-status/`,
        getAuthHeaders()
      );
      console.log('Voting status response:', response.data);
      setVotingStatus(response.data);
    } catch (error) {
      console.error("Failed to fetch voting status:", error);
      if (axios.isAxiosError(error)) {
        console.log('Error response:', error.response);
        if (error.response?.status === 403) {
          router.push("/admin-login");
        }
      }
      throw error;
    }
  };

  const fetchVotes = async () => {
    setIsLoadingVotes(true);
    try {
      console.log('Fetching votes with headers:', getAuthHeaders());
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/get-votes/`,
        getAuthHeaders()
      );
      console.log('Votes response:', response.data);
      setVotes(response.data.votes);
      setVoteCounts(response.data.vote_counts);
    } catch (error) {
      console.error("Failed to fetch votes:", error);
      if (axios.isAxiosError(error)) {
        console.log('Error response:', error.response);
        if (error.response?.status === 403) {
          router.push("/admin-login");
        }
      }
      throw error;
    } finally {
      setIsLoadingVotes(false);
    }
  };

  const handleToggleVoting = async () => {
    setIsLoading(true);
    try {
      console.log('Toggling voting status with headers:', getAuthHeaders());
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/voting-status/`,
        {
          is_active: !votingStatus?.is_active,
        },
        getAuthHeaders()
      );
      console.log('Toggle voting response:', response.data);
      setVotingStatus(response.data);
    } catch (error) {
      console.error("Failed to toggle voting status:", error);
      if (axios.isAxiosError(error)) {
        console.log('Error response:', error.response);
        if (error.response?.status === 403) {
          router.push("/admin-login");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleResults = async () => {
    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      if (!headers || !Object.keys(headers).length) {
        console.error("No valid auth headers found");
        router.push("/admin-login");
        return;
      }

      console.log('Current voting status:', votingStatus);
      console.log('Toggling results display with headers:', headers);
      
      // Always set display_results to true when showing results
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/voting-status/`,
        {
          display_results: true,
          is_active: votingStatus?.is_active
        },
        headers
      );
      
      console.log('Toggle results response:', response.data);
      setVotingStatus(response.data);
      
      // Navigate to results page after setting display_results to true
      router.push('/results');
    } catch (error) {
      console.error("Failed to toggle results display:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        if (error.response?.status === 403) {
          router.push("/admin-login");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    router.push("/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-900 py-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 w-full max-w-md mb-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Host Controls
        </h1>

        <div className="mb-6 text-center">
          <p className="text-white text-lg mb-2">
            Voting is currently:{" "}
            <span className={votingStatus?.is_active ? "text-green-400" : "text-red-400"}>
              {votingStatus?.is_active ? "Active" : "Inactive"}
            </span>
          </p>
          <p className="text-gray-400 text-sm">
            Last updated: {votingStatus ? formatDate(votingStatus.last_updated) : "Never"}
          </p>
        </div>

        <button
          onClick={handleToggleVoting}
          disabled={isLoading}
          className={`w-full py-4 rounded-lg text-white font-medium text-lg mb-4 transition-colors ${
            votingStatus?.is_active
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading
            ? "Processing..."
            : votingStatus?.is_active
            ? "Stop Voting"
            : "Start Voting"}
        </button>

        <button
          onClick={handleToggleResults}
          disabled={isLoading}
          className={`w-full py-4 rounded-lg text-white font-medium text-lg mb-4 transition-colors ${
            votingStatus?.display_results
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading
            ? "Processing..."
            : votingStatus?.display_results
            ? "Hide Results"
            : "Show Results"}
        </button>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-white mb-4">Current Results</h2>
          {voteCounts.map((count) => (
            <div
              key={count.book}
              className="bg-white/5 rounded-lg p-4 mb-2 flex justify-between items-center"
            >
              <span className="text-white">{count.book}</span>
              <span className="text-white font-bold">{count.count} votes</span>
            </div>
          ))}
        </div>
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
