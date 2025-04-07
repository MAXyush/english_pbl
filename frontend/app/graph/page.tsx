"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios, { AxiosError } from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface VoteResponse {
  votes: Array<{ book: string; user: number }>;
  vote_counts: Array<{ book: string; count: number }>;
}

interface ErrorResponse {
  message: string;
}

const BarChart: React.FC = () => {
  const [voteCounts, setVoteCounts] = useState<{ [key: string]: number }>({
    "1984": 0,
    "Brave New World": 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all votes in a single API call
  const fetchVotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<VoteResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/get-votes/`
      );
      
      const newVoteCounts = {
        "1984": response.data.vote_counts.find(v => v.book === "1984")?.count || 0,
        "Brave New World": response.data.vote_counts.find(v => v.book === "Brave New World")?.count || 0
      };
      
      setVoteCounts(newVoteCounts);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to fetch vote counts");
      console.error("Error fetching votes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch votes when component mounts
  useEffect(() => {
    fetchVotes();
    
    // Set up polling every 5 seconds
    const interval = setInterval(fetchVotes, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Prepare the data for the bar chart
  const data = {
    labels: ["1984", "Brave New World"],
    datasets: [
      {
        label: "Vote Count",
        data: [voteCounts["1984"], voteCounts["Brave New World"]],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',  // Blue for 1984
          'rgba(255, 99, 132, 0.5)',  // Pink for Brave New World
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options to customize the chart appearance
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Vote Count for Books",
        color: 'white',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        ticks: {
          color: 'white',
          stepSize: 1,
          callback: function(value: number | string) {
            return Math.floor(Number(value));
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        type: 'category' as const,
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    animation: {
      duration: 500
    }
  } as const;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Vote Distribution</h2>
        {loading && !error && (
          <div className="flex items-center justify-center gap-2 text-white text-center mb-4">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Loading vote counts...</span>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        <div className="bg-gray-800 p-4 rounded-lg relative">
          <Bar data={data} options={options} />
          {/* Overlay to prevent interaction while loading */}
          {loading && (
            <div className="absolute inset-0 bg-gray-900/50 rounded-lg" />
          )}
        </div>
        <div className="mt-4 text-center text-white text-sm">
          Total Votes: {Object.values(voteCounts).reduce((a, b) => a + b, 0)}
        </div>
      </div>
    </div>
  );
};

export default BarChart;
