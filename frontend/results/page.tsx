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

interface VotingResult {
  novel: string;
  author: string;
  votes: number;
  percentage: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<VotingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [winner, setWinner] = useState<VotingResult | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/voting-results");
        const data = await response.json();

        // Calculate percentages and find winner
        const total = data.reduce(
          (sum: number, novel: VotingResult) => sum + novel.votes,
          0
        );
        setTotalVotes(total);

        const resultsWithPercentage = data.map((novel: VotingResult) => ({
          ...novel,
          percentage: total > 0 ? Math.round((novel.votes / total) * 100) : 0,
        }));

        setResults(resultsWithPercentage);

        // Determine winner
        if (resultsWithPercentage.length > 0) {
          const winningNovel = [...resultsWithPercentage].sort(
            (a, b) => b.votes - a.votes
          )[0];
          setWinner(winningNovel);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch results:", error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleBackToHome = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl text-white">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-purple-900 text-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={handleBackToHome}
          className="flex items-center gap-2 mb-6 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to voting</span>
        </button>

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
                  ({winner.percentage}%)
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
                  label={{
                    position: "top",
                    fill: "white",
                    formatter: (value: number) => `${value}`,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((novel) => (
            <div
              key={novel.novel}
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 ${
                winner && winner.novel === novel.novel
                  ? "border-yellow-400 shadow-lg shadow-yellow-400/20"
                  : "border-transparent"
              }`}
            >
              <h3 className="text-2xl font-bold mb-1">{novel.novel}</h3>
              <p className="text-gray-300 mb-4">by {novel.author}</p>

              <div className="relative h-8 bg-gray-700 rounded-full overflow-hidden mb-2">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                  style={{ width: `${novel.percentage}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-bold">{novel.percentage}%</span>
                </div>
              </div>

              <p className="text-right text-gray-300">{novel.votes} votes</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
