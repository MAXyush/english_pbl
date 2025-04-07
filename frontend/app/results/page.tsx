"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, Trophy } from "lucide-react";
import axios from "axios";

interface VotingResult {
  novel: string;
  author: string;
  votes: number;
  percentage: number;
}

interface VoteCount {
  book: string;
  count: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<VotingResult[]>([]);
  const [winner, setWinner] = useState<VotingResult | null>(null);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [canViewResults, setCanViewResults] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return null;
    }
    return {
      headers: {
        'Authorization': `JWT ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true
    };
  };

  const handleHideResults = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      // First get the current voting status
      const statusResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/voting-status/`,
        headers
      );

      // Then update only display_results while preserving is_active
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/voting-status/`,
        {
          display_results: false,
          is_active: statusResponse.data.is_active
        },
        headers
      );

      router.push('/admin');
    } catch (error) {
      console.error("Error hiding results:", error);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        router.push("/login");
      }
    }
  };

  const fetchVotes = async () => {
    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      // First check if we can view results
      const statusResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/voting-status/`,
        headers
      );

      console.log("Voting status response:", statusResponse.data);

      // Set the canViewResults state based on the response
      setCanViewResults(statusResponse.data.display_results);

      // If results are not available, don't proceed with fetching votes
      if (!statusResponse.data.display_results) {
        console.log("Results are not available for display");
        setIsLoading(false);
        return;
      }

      // Then fetch the votes
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/get-votes/`,
        headers
      );

      console.log("Vote counts response:", response.data);

      const voteCounts: VoteCount[] = response.data.vote_counts || [];
      const total = voteCounts.reduce((sum, vote) => sum + vote.count, 0);
      
      const resultsData: VotingResult[] = [
        {
          novel: "1984",
          author: "George Orwell",
          votes: voteCounts.find(v => v.book === "1984")?.count || 0,
          percentage: total ? ((voteCounts.find(v => v.book === "1984")?.count || 0) / total) * 100 : 0,
        },
        {
          novel: "Brave New World",
          author: "Aldous Huxley",
          votes: voteCounts.find(v => v.book === "Brave New World")?.count || 0,
          percentage: total ? ((voteCounts.find(v => v.book === "Brave New World")?.count || 0) / total) * 100 : 0,
        },
      ];

      console.log("Processed results data:", resultsData);

      setResults(resultsData);
      setTotalVotes(total);
      
      if (resultsData.length > 0) {
        const winningNovel = resultsData.reduce(
          (max, novel) => (novel.votes > max.votes ? novel : max),
          resultsData[0]
        );
        console.log("Setting winner:", winningNovel);
        setWinner(winningNovel);
      }
    } catch (error) {
      console.error("Error fetching votes:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        if (error.response?.status === 403) {
          router.push("/login");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Check if user is admin
    const admin = localStorage.getItem("admin") === "true";
    setIsAdmin(admin);

    // Initial fetch
    fetchVotes();

    // Set up polling to check for updates
    const interval = setInterval(fetchVotes, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 to-purple-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading results...</div>
      </div>
    );
  }

  if (!canViewResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 to-purple-900 text-white flex flex-col items-center justify-center">
        <div className="text-2xl mb-4">Results are not available yet.</div>
        <button
          onClick={() => router.push('/')}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Back to Voting
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-purple-900 text-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to voting</span>
          </button>
          
          {isAdmin && (
            <button
              onClick={handleHideResults}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Hide Results
            </button>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          Novel vs Novel: Final Results
        </h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Total Votes: {totalVotes}
          </h2>

          {winner && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 p-6 rounded-lg mb-8 border border-yellow-400">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="text-yellow-400" size={28} />
                <h3 className="text-2xl font-bold text-yellow-300">Winner</h3>
              </div>
              <p className="text-3xl font-bold">{winner.novel}</p>
              <p className="text-xl text-gray-300">by {winner.author}</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-4xl font-bold">{winner.votes}</span>
                <span className="text-2xl text-yellow-300">
                  ({winner.percentage.toFixed(2)}%)
                </span>
                <span className="text-lg">votes</span>
              </div>
            </div>
          )}

          <div className="h-80 mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={results}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="novel"
                  angle={-45}
                  textAnchor="end"
                  tick={{ fill: "white" }}
                  height={60}
                />
                <YAxis tick={{ fill: "white" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(23, 23, 43, 0.9)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Legend wrapperStyle={{ color: "white" }} />
                <Bar
                  dataKey="votes"
                  name="Votes"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                  label={{ position: "top", fill: "white" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
