"use client";

import { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { Count } from "@/types/count";
import { incrementCount } from "@/actions/counts/update";
import { createCount } from "@/actions/counts/create";
import { createClient } from "@/lib/supabase/client";
import AddCountDialog from "./add-count-dialog";
import CounterItem from "./counter-item";
import { Button } from "@/components/ui/button";

interface CounterClientProps {
  game: {
    id: number;
    name: string;
    slug: string;
  };
  initialCounts: Count[];
}

export default function CounterClient({
  game,
  initialCounts,
}: CounterClientProps) {
  const [counts, setCounts] = useState<Count[]>(initialCounts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`counts_channel:${game.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "counts",
          filter: `game_id=eq.${game.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setCounts((prev) => [...prev, payload.new as Count]);
          } else if (payload.eventType === "UPDATE") {
            setCounts((prev) =>
              prev.map((count) =>
                count.id === payload.new.id ? (payload.new as Count) : count,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setCounts((prev) =>
              prev.filter((count) => count.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [game.id]);

  const handleIncrement = async (countId: number) => {
    setCounts((prev) =>
      prev.map((count) =>
        count.id === countId ? { ...count, count: count.count + 1 } : count,
      ),
    );

    await incrementCount(countId);
  };

  const handleAddCount = async (name: string) => {
    await createCount({ name, gameId: game.id });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{game.name} Counter</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon />
          Add Counter
        </Button>
      </div>

      {counts.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">
            No counters added yet. Add your first counter to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {counts.map((count) => (
            <CounterItem
              key={count.id}
              count={count}
              onIncrement={() => handleIncrement(count.id)}
            />
          ))}
        </div>
      )}

      <AddCountDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddCount}
      />
    </div>
  );
}
