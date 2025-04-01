"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

const VotingPage = () => {
  const [login, setLogin] = useState(false);
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

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, []);

  const handleVote = async (book) => {
    console.log(`Voted for ${book}`);

    const token = localStorage.getItem("token");

    if (token) {
      console.log("Token found, submitting vote...");
      const decode = jwtDecode(token);
      console.log(decode.user_id);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/accounts/vote/", // Your API endpoint
          { book: book, id: decode.user_id } // Request payload
        );

        alert(response.data.message);
        // Optionally, handle a success message or update state here
      } catch (error) {
        console.error("Error submitting vote", error);
        // Optionally, handle errors (e.g., show a message to the user)
      }
    } else {
      router.push("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogin(false);
    router.push("/login");
  };

  const handleGraph = () => {
    router.push("/graph");
  };

  const title = "Novel vs Novel: Which One Deserves the Crown?";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white font-sans">
      <button onClick={handleLogout}>{login ? " Logout " : "Login"}</button>
      <button onClick={handleGraph}>Show Graph</button>

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {books.map((book, index) => (
          <motion.div
            key={book.title}
            className="bg-white text-gray-900 shadow-xl rounded-2xl p-6 flex flex-col items-center transform transition duration-300 overflow-hidden font-mono"
            initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-40 h-60 object-cover rounded-lg mb-4 shadow-md hover:scale-110 transition duration-300"
            />
            <h2 className="text-3xl font-bold mb-2 font-serif">{book.title}</h2>
            <p className="text-md text-gray-500 mb-4 font-light italic">
              by {book.author}
            </p>
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-800 transition font-semibold"
              onClick={() => handleVote(book.title)}
            >
              Vote
            </button>
          </motion.div>
        ))}
      </div>
      <button
        className="absolute bottom-5 right-5 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition font-semibold"
        onClick={() =>
          localStorage.getItem("admin")
            ? router.push("/admin")
            : router.push("/admin-login")
        }
      >
        Host Controls
      </button>
    </div>
  );
};

export default VotingPage;
