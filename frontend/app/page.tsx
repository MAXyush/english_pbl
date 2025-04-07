"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

interface VotingStatus {
  is_active: boolean;
  display_results: boolean;
  last_updated: string;
}

interface VoteCount {
  book: string;
  count: number;
}

interface JwtPayload {
  user_id: number;
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
}

const VotingPage = () => {
  const [login, setLogin] = useState(false);
  const [votingStatus, setVotingStatus] = useState<VotingStatus | null>(null);
  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const books = [
    {
      title: "1984",
      author: "George Orwell",
      image: "/images/1984.jpg",
    },
    {
      title: "Brave New World",
      author: "Aldous Huxley",
      image: "/images/brave_new_world.jpg",
    },
  ];

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLogin(false);
      router.push("/login");
      return;
    }

    setLogin(true);
    const fetchData = async () => {
      try {
        await checkVotingStatus();
      } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          handleLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkVotingStatus = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/voting-status/`,
        headers
      );
      
      setVotingStatus(response.data);
      
      // If results are being displayed, redirect to results page
      if (response.data.display_results) {
        router.push('/results');
        return;
      }

      // Only fetch votes if we're not redirecting
      await fetchVotes();
    } catch (error) {
      console.error("Error checking voting status:", error);
      throw error;
    }
  };

  const fetchVotes = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/get-votes/`,
        headers
      );
      setVoteCounts(response.data.vote_counts);
      
      // Check if the current user has voted
      const token = localStorage.getItem("token");
      if (token) {
        const decode = jwtDecode<JwtPayload>(token);
        // If the user's vote exists in the votes array, they have voted
        if (response.data.votes.some((vote: any) => vote.user === decode.user_id)) {
          setHasVoted(true);
        }
      }
    } catch (error) {
      console.error("Error fetching votes:", error);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        handleLogout();
      }
      throw error;
    }
  };

  const handleVote = async (book: string) => {
    if (!votingStatus?.is_active) {
      alert("Voting is currently closed.");
      return;
    }

    if (hasVoted) {
      alert("You have already voted.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decode = jwtDecode<JwtPayload>(token);
      const headers = getAuthHeaders();
      if (!headers) return;

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/vote/`,
        { book, id: decode.user_id },
        headers
      );
      setHasVoted(true);
      await fetchVotes();
      alert("Thank you for voting!");
    } catch (error) {
      console.error("Error submitting vote:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          handleLogout();
        } else if (error.response?.status === 400) {
          // Show the specific error message from the server
          const message = error.response.data.message || "You have already voted.";
          alert(message);
          // Update the hasVoted state since we know the user has already voted
          setHasVoted(true);
          // Refresh the vote counts to ensure we're showing the latest data
          await fetchVotes();
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setLogin(false);
    router.push("/login");
  };

  const handleAdminClick = () => {
    const isAdmin = localStorage.getItem("admin") === "true";
    if (isAdmin) {
      router.push("/admin");
    } else {
      router.push("/admin-login");
    }
  };

  const title = "Novel vs Novel: Which One Deserves the Crown?";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white font-sans">
      <div className="absolute top-4 right-4 flex gap-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          {login ? "Logout" : "Login"}
        </button>
        {login && (
          <button
            onClick={handleAdminClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Host Controls
          </button>
        )}
      </div>

      <motion.h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center font-serif tracking-wide break-words max-w-screen-md">
        {title.split(" ").map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block mr-2">
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={charIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.05,
                  delay: wordIndex * 0.5 + charIndex * 0.05,
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.h1>

      {!votingStatus?.is_active && (
        <div className="bg-red-500 text-white px-6 py-3 rounded-lg mb-8">
          Voting is currently closed.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {books.map((book) => (
          <motion.div
            key={book.title}
            whileHover={{ scale: 1.05 }}
            className="bg-white backdrop-blur-sm p-6 rounded-xl"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-900">{book.title}</h2>
            <p className="text-lg mb-4 text-gray-600">by {book.author}</p>
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-900">
                Votes: {voteCounts.find(v => v.book === book.title)?.count || 0}
              </span>
              <button
                onClick={() => handleVote(book.title)}
                disabled={!votingStatus?.is_active || hasVoted}
                className={`px-6 py-2 rounded-lg transition ${
                  !votingStatus?.is_active || hasVoted
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >
                {hasVoted ? "Voted" : "Vote"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VotingPage;
