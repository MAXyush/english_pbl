"use client";
import { useState } from "react";
import { RegisterForm } from "@/components/auth/register-form";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

interface RegisterForm {
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-2xl mb-4">Register</h2>
      <RegisterForm onSuccess={handleSuccess} />
    </div>
  );
}
