"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateCountParams {
  name: string;
  gameId: number;
}

export async function createCount({ name, gameId }: CreateCountParams) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("counts")
      .insert({
        name,
        game_id: gameId,
        count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating count:", error.message);
      throw new Error(error.message);
    }

    revalidatePath(`/[gameSlug]/counter`);

    return data;
  } catch (err) {
    console.error("Exception creating count:", err);
    throw err;
  }
}
