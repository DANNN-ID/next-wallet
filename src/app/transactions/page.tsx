import { Plus } from "lucide-react";
import Link from "next/link";
import TransactionItem from "@/components/TransactionItem";
import TopBar from "@/components/TopBar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select(`
      id,
      amount,
      type,
      description,
      transaction_date,
      categories (name, icon),
      accounts (name)
    `)
    .order('transaction_date', { ascending: false });

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="pb-24 space-y-6">
      <TopBar title="Riwayat Transaksi" />

      <div className="space-y-3 px-4">
        {(!transactions || transactions.length === 0) ? (
          <div className="text-center py-12 text-slate-500 text-sm">Belum ada transaksi yang dicatat.</div>
        ) : (
          transactions.map((trx: any) => (
            <TransactionItem key={trx.id} trx={trx} />
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 max-w-[480px] w-full px-4 pointer-events-none flex justify-end z-40">
        <Link href="/transactions/new" className="pointer-events-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/40 hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all">
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
