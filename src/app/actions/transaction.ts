"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTransaction(formData: FormData) {
  const type = formData.get("type") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const accountId = formData.get("accountId") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string; // YYYY-MM-DD
  
  if (!accountId) {
    return { error: "Pilih dompet terlebih dahulu." };
  }
  if (!amount || amount <= 0) {
    return { error: "Jumlah nominal tidak valid." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      type,
      amount,
      account_id: accountId,
      description,
      transaction_date: date ? new Date(date).toISOString() : new Date().toISOString(),
      // We will skip category_id for now if it's not implemented yet
    });

  if (error) {
    console.error("Add transaction error:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
  return { success: true };
}
