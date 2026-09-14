"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addAccount(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const initialBalance = parseFloat(formData.get("initialBalance") as string) || 0;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("accounts")
    .insert({
      user_id: user.id,
      name,
      type,
      initial_balance: initialBalance
    });

  if (error) {
    console.error("Add account error:", error);
    // Ideally we would return the error, but for simplicity we'll just redirect back on success
    // or handle error state via useActionState. Since we are server-side only here without client,
    // we just redirect. If it fails it will throw.
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/accounts");
  redirect("/accounts");
}
