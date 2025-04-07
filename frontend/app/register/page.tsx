"use client";
import { RegisterForm } from "@/components/auth/register-form";
import { useRouter } from "next/navigation";

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
