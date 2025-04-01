"use client";
import { useRouter } from "next/navigation";

export default function HostControlsButton() {
  const router = useRouter();

  const handleOpenHostControls = () => {
    router.push("/host-controls");
  };

  return (
    <button
      onClick={handleOpenHostControls}
      className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg"
    >
      Host Controls
    </button>
  );
}
