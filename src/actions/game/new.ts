"use server";

import { createClient } from "@/lib/supabase/server";
import { CreateGame } from "@/types/game";

export async function createGame(game: CreateGame) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("games").insert(game);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
