import Link from "next/link";
import TransactionForm from "./TransactionForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TopBar from "@/components/TopBar";

export default async function NewTransactionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch accounts to populate the select dropdown
  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch categories (RLS will automatically filter global + own categories based on the policy we just set)
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 pb-24">
        <TopBar title="Catat Transaksi" />

        <div className="bg-white p-6 rounded-2xl shadow-sm text-center space-y-4 mx-4">
          <h2 className="font-semibold text-slate-900">Anda belum memiliki dompet</h2>
          <p className="text-slate-500 text-sm">
            Untuk mencatat transaksi, Anda perlu menambahkan setidaknya satu dompet atau sumber dana terlebih dahulu.
          </p>
          <Link href="/accounts/new" className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-xl shadow-lg shadow-pink-500/30 active:scale-[0.98] transition-all">
            Tambah Dompet Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24">
      <TopBar title="Catat Transaksi" />

      <div className="px-4">
        <TransactionForm accounts={accounts} categories={categories || []} />
      </div>
    </div>
  );
}
