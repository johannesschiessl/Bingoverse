"use server";

import { createClient } from "@/lib/supabase/server";

export async function getGameWithSlug(gameSlug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("slug", gameSlug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
