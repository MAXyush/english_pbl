"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";

const HostControlsPage = () => {
  const router = useRouter();
  const [votes1984, setVotes1984] = useState<number>(0);
  const [votesNewWorld, setVotesNewWorld] = useState<number>(0);

  const fetchVotes1984 = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/accounts/get-votes/",
        {
          params: { book: "1984" },
        }
      );
      console.log(response.data);
      setVotes1984(response.data.length);
    } catch (error) {
      console.error(error.message || "Failed to fetch votes for 1984");
    }
  };

  const fetchVotesNewWorld = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/accounts/get-votes/",
        {
          params: { book: "Brave New World" },
        }
      );
      setVotesNewWorld(response.data.length);
    } catch (error) {
      console.error(
        error.message || "Failed to fetch votes for Brave New World"
      );
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      router.push("/admin-login");
    }
    fetchVotes1984();
    fetchVotesNewWorld;
  }, []);

  const [votingStopped, setVotingStopped] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const stopVoting = () => setVotingStopped(true);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800 text-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-semibold text-black mb-4">
          Host Controls
        </h2>
        {!votingStopped ? (
          <>
            <button
              className="w-full bg-red-600 text-white p-3 rounded-lg mb-4"
              onClick={stopVoting}
            >
              Stop Voting
            </button>
            <button
              className="w-full bg-green-600 text-white p-3 rounded-lg"
              onClick={() => {
                fetchVotes1984();
                fetchVotesNewWorld();
                setShowResults(true);
              }}
            >
              Display Results
            </button>
          </>
        ) : showResults ? (
          <div className="mt-4 p-4 bg-gray-100 text-black rounded-lg">
            <h3 className="text-2xl font-semibold mb-2">Voting Results</h3>
            <h2 className="text-lg font-bold">
              Winner:{" "}
              {votes1984 !== votesNewWorld
                ? votes1984 > votesNewWorld
                  ? "1984"
                  : "Brave New World"
                : "Vote Draw"}
            </h2>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HostControlsPage;
