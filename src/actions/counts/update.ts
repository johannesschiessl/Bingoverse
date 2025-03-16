"use server";

import { createClient } from "@/lib/supabase/server";

export async function incrementCount(countId: number) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc("increment_count", {
      count_id: countId,
    });

    if (error) {
      console.warn(
        "RPC increment_count failed, using fallback:",
        error.message,
      );
      return incrementCountFallback(countId);
    }

    return data;
  } catch (err) {
    console.error("Exception incrementing count:", err);
    return incrementCountFallback(countId);
  }
}

async function incrementCountFallback(countId: number) {
  const supabase = await createClient();

  try {
    const { data: currentData, error: fetchError } = await supabase
      .from("counts")
      .select("count")
      .eq("id", countId)
      .single();

    if (fetchError) {
      console.error("Error fetching count:", fetchError.message);
      throw new Error(fetchError.message);
    }

    const { data, error } = await supabase
      .from("counts")
      .update({ count: (currentData.count || 0) + 1 })
      .eq("id", countId)
      .select()
      .single();

    if (error) {
      console.error("Error updating count:", error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("Exception updating count:", err);
    throw err;
  }
}
