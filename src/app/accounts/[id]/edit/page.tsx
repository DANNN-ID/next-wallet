import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditAccountForm from "./EditAccountForm";

export default async function EditAccountPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!account) {
    redirect("/accounts");
  }

  return (
    <EditAccountForm account={account} />
  );
}
