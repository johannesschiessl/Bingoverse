"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCountsWithGameId(gameId: number) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("counts")
      .select("*")
      .eq("game_id", gameId);

    if (error) {
      console.error("Error fetching counts:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Exception fetching counts:", err);
    return [];
  }
}
