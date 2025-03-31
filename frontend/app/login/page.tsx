"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsRegister(searchParams.get("register") === "true");
    setMounted(true);
  }, [searchParams]);

  const handleSuccess = () => {
    router.push("/login");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <div className="flex flex-1 flex-col justify-center items-center p-4 md:p-8 relative">
        <div className="absolute inset-0 bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2] -z-10" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm -z-10" />

        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span>StockSage AI</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-md space-y-6 rounded-xl border bg-background/80 backdrop-blur-sm p-6 shadow-xl">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              {isRegister ? "Create an Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {isRegister
                ? "Enter your details to create your account"
                : "Enter your credentials to access your account"}
            </p>
          </div>

          {isRegister ? (
            <RegisterForm onSuccess={handleSuccess} />
          ) : (
            <LoginForm onSuccess={handleSuccess} />
          )}

          <div className="text-center text-sm">
            {isRegister ? (
              <p>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Log in
                </Link>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <Link
                  href="/login?register=true"
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
