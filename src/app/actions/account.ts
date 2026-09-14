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

  // Cek apakah nama dompet sudah digunakan oleh user ini
  const { data: existingAccount } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", user.id)
    .ilike("name", name)
    .single();

  if (existingAccount) {
    return { error: `Dompet dengan nama "${name}" sudah ada. Silakan gunakan nama lain.` };
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
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/accounts");
  return { success: true };
}

export async function updateAccount(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const initialBalance = parseFloat(formData.get("initialBalance") as string) || 0;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Cek apakah nama dompet sudah digunakan oleh dompet LAIN milik user ini
  const { data: existingAccount } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", user.id)
    .ilike("name", name)
    .neq("id", id)
    .single();

  if (existingAccount) {
    return { error: `Dompet dengan nama "${name}" sudah ada. Silakan gunakan nama lain.` };
  }

  const { error } = await supabase
    .from("accounts")
    .update({
      name,
      type,
      initial_balance: initialBalance
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Update account error:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/accounts");
  return { success: true };
}
