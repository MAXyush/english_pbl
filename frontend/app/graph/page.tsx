"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
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

const BarChart: React.FC = () => {
  const [votes1984, setVotes1984] = useState<number>(0);
  const [votesNewWorld, setVotesNewWorld] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch votes for the book "1984"
  const fetchVotes1984 = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/accounts/get-votes/",
        {
          params: { book: "1984" },
        }
      );
      console.log(response.data);
      setVotes1984(response.data.length); // Assuming response is an array of votes
    } catch (error) {
      setError(error.message || "Failed to fetch votes for 1984");
    }
  };

  // Fetch votes for the book "Brave New World"
  const fetchVotesNewWorld = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/accounts/get-votes/",
        {
          params: { book: "Brave New World" },
        }
      );
      setVotesNewWorld(response.data.length); // Assuming response is an array of votes
    } catch (error) {
      setError(error.message || "Failed to fetch votes for Brave New World");
    }
  };

  // Call both fetch functions when the component mounts
  useEffect(() => {
    fetchVotes1984();
    fetchVotesNewWorld();
  }, []);

  // Prepare the data for the bar chart
  const data = {
    labels: ["1984", "Brave New World"], // X-axis labels
    datasets: [
      {
        label: "Vote Count", // Label for the dataset
        data: [votes1984, votesNewWorld], // Y-axis data (vote count for each book)
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Bar color
        borderColor: "rgba(75, 192, 192, 1)", // Border color for bars
        borderWidth: 1, // Border width
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
      },
    },
  };

  return (
    <div>
      <h2>Vote Count Bar Graph</h2>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
