import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TransactionForm from "./TransactionForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 p-4">
        <header className="flex items-center gap-4 mb-8">
          <Link href="/transactions" className="p-2 bg-white rounded-full shadow-sm text-slate-500 hover:text-pink-500 active:scale-95 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Catat Transaksi</h1>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-sm text-center space-y-4">
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
    <div className="flex flex-col min-h-screen bg-slate-50 p-4 pb-24">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/transactions" className="p-2 bg-white rounded-full shadow-sm text-slate-500 hover:text-pink-500 active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Catat Transaksi</h1>
      </header>

      <TransactionForm accounts={accounts} />
    </div>
  );
}
