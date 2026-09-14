"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCategory(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Silakan login terlebih dahulu." };
    }

    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const icon = formData.get("icon") as string;

    if (!name || !type || !icon) {
      return { error: "Nama, jenis, dan ikon wajib diisi." };
    }

    const { error } = await supabase
      .from('categories')
      .insert({
        name,
        type,
        icon,
        user_id: user.id
      });

    if (error) {
      console.error("Add category error:", error);
      return { error: error.message };
    }

    revalidatePath("/categories");
    revalidatePath("/transactions/new");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Terjadi kesalahan sistem." };
  }
}
