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
  const [votes1984, setVotes1984] = useState<number>(0);
  const [votesNewWorld, setVotesNewWorld] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch votes for the book "1984"
  const fetchVotes1984 = async () => {
    try {
      setLoading(true);
      const response = await axios.get<VoteResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/get-votes/`
      );
      const votes = response.data.vote_counts.find(v => v.book === "1984")?.count || 0;
      setVotes1984(votes);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to fetch votes for 1984");
    } finally {
      setLoading(false);
    }
  };

  // Fetch votes for the book "Brave New World"
  const fetchVotesNewWorld = async () => {
    try {
      setLoading(true);
      const response = await axios.get<VoteResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/get-votes/`
      );
      const votes = response.data.vote_counts.find(v => v.book === "Brave New World")?.count || 0;
      setVotesNewWorld(votes);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      setError(error.response?.data?.message || "Failed to fetch votes for Brave New World");
    } finally {
      setLoading(false);
    }
  };

  // Call both fetch functions when the component mounts
  useEffect(() => {
    fetchVotes1984();
    fetchVotesNewWorld();
  }, []);

  // Prepare the data for the bar chart
  const data = {
    labels: ["1984", "Brave New World"],
    datasets: [
      {
        label: "Vote Count",
        data: [votes1984, votesNewWorld],
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
        color: 'white',  // Make title text white
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white',  // Make y-axis labels white
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',  // Make grid lines slightly visible
        },
      },
      x: {
        ticks: {
          color: 'white',  // Make x-axis labels white
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',  // Make grid lines slightly visible
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Vote Distribution</h2>
        {loading && (
          <div className="text-white text-center mb-4">Loading...</div>
        )}
        {error && (
          <div className="text-red-500 text-center mb-4">Error: {error}</div>
        )}
        <div className="bg-gray-800 p-4 rounded-lg">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default BarChart;
