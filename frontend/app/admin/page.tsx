"use client";
import React, { useState } from "react";

const HostControlsPage = () => {
  const [votingStopped, setVotingStopped] = useState(false);
  const [votes, setVotes] = useState({ "1984": 0, "Brave New World": 0 });

  const stopVoting = () => {
    setVotingStopped(true);
  };

  const displayResults = () => {
    return (
      <div>
        <h3 className="text-2xl mb-4">Voting Results</h3>
        <p>1984 by George Orwell: {votes["1984"]} votes</p>
        <p>
          Brave New World by Aldous Huxley: {votes["Brave New World"]} votes
        </p>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800 text-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Host Controls</h2>
        {!votingStopped ? (
          <>
            <button
              className="w-full bg-red-600 text-white p-3 rounded-lg mb-4"
              onClick={stopVoting}
            >
              Stop Voting
            </button>
            <button className="w-full bg-green-600 text-white p-3 rounded-lg">
              Display Results
            </button>
          </>
        ) : (
          displayResults()
        )}
      </div>
    </div>
  );
};

export default HostControlsPage;
