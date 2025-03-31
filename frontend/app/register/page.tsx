"use client";
import { useState } from "react";
import { registerUser } from "./api/auth";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

interface RegisterForm {
  email: string;
  password: string;
}

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    const result = await registerUser(data.email, data.password);
    if (result.success) {
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl mb-4">Register</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="p-2 rounded text-black"
          required
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="p-2 rounded text-black"
          required
        />
        <button type="submit" className="bg-green-600 px-4 py-2 rounded">
          Register
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
}
