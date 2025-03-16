"use server";

import { createClient } from "@/lib/supabase/server";

export async function getSquaresWithGameId(gameId: number) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("squares")
      .select("*")
      .eq("game_id", gameId);

    if (error) {
      console.error("Error fetching squares:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Exception fetching squares:", err);
    return [];
  }
}
