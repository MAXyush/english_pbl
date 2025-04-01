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

export default function ResultsPage() {
  const [results, setResults] = useState<VotingResult[]>([]);
  const [winner, setWinner] = useState<VotingResult | null>(null);
  const [votes1984, setVotes1984] = useState<number>(0);
  const [votesNewWorld, setVotesNewWorld] = useState<number>(0);
  const router = useRouter();

  const fetchVotes = async () => {
    try {
      const [res1984, resNewWorld] = await Promise.all([
        axios.get("http://127.0.0.1:8000/accounts/get-votes/", {
          params: { book: "1984" },
        }),
        axios.get("http://127.0.0.1:8000/accounts/get-votes/", {
          params: { book: "Brave New World" },
        }),
      ]);

      const votes1 = res1984.data.length;
      const votes2 = resNewWorld.data.length;
      setVotes1984(votes1);
      setVotesNewWorld(votes2);
      const totalVotes = votes1 + votes2;

      const resultsData: VotingResult[] = [
        {
          novel: "1984",
          author: "George Orwell",
          votes: votes1,
          percentage: totalVotes ? (votes1 / totalVotes) * 100 : 0,
        },
        {
          novel: "Brave New World",
          author: "Aldous Huxley",
          votes: votes2,
          percentage: totalVotes ? (votes2 / totalVotes) * 100 : 0,
        },
      ];

      setResults(resultsData);
      setWinner(
        resultsData.reduce(
          (max, novel) => (novel.votes > max.votes ? novel : max),
          resultsData[0]
        )
      );
    } catch (error) {
      console.error("Error fetching votes", error);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-purple-900 text-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/")}
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
            Total Votes: {votes1984 + votesNewWorld}
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
