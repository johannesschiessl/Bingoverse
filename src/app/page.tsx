"use client";

import Link from "next/link";
import { LayoutGrid, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function LandingPage() {
  const [gameCode, setGameCode] = useState("");
  const router = useRouter();

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameCode.trim()) {
      router.push(`/${gameCode.trim()}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <main className="flex flex-col items-center justify-center flex-1 px-4 text-center">
        <h1 className="text-4xl flex items-center gap-2 font-bold mb-4">
          <LayoutGrid className="size-10 p-1 bg-orange-100 text-orange-500 rounded-md" />
          <span className="text-4xl font-bold">Eventverse</span>
        </h1>
        <h2 className="text-xl text-gray-600 mb-8 max-w-2xl">
          Make your event more fun with bingo or a counter! Create customised
          bingo cards or counters for any occasion - from school trips to watch
          parties.
        </h2>

        <div className="flex flex-col gap-4 mb-8">
          <Link href="/new">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="size-5" />
              Create New Game
            </Button>
          </Link>

          <form onSubmit={handleJoinGame} className="flex gap-2">
            <Input
              type="text"
              maxLength={9}
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              placeholder="Enter game code"
            />
            <Button type="submit" variant="secondary" size="lg">
              Join Game
            </Button>
          </form>
        </div>
      </main>

      <footer className="p-4 text-center text-gray-500 text-sm">
        &copy; 2025 Johannes Schießl. All rights reserved.
      </footer>
    </div>
  );
}
