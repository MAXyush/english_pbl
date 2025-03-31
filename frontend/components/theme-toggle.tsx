"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show nothing before hydration to avoid mismatch
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    console.log(theme);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-yellow-500" />
      ) : (
        <Moon className="h-4 w-4 text-gray-800" />
      )}
    </Button>
  );
}
