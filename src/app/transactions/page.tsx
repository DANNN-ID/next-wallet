import { Plus } from "lucide-react";
import Link from "next/link";
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
    <div className="p-4 pt-10 pb-24 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Riwayat Transaksi</h1>
        <p className="text-slate-500 text-sm">Semua catatan pemasukan dan pengeluaran Anda</p>
      </header>

      <div className="space-y-3">
        {(!transactions || transactions.length === 0) ? (
          <div className="text-center py-12 text-slate-500 text-sm">Belum ada transaksi yang dicatat.</div>
        ) : (
          transactions.map((trx: any) => (
            <div key={trx.id} className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-xl">
                  {trx.categories?.icon || '📝'}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{trx.description || trx.categories?.name || 'Transaksi'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {trx.accounts?.name} • {new Date(trx.transaction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <span className={`font-bold text-sm ${trx.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-900'}`}>
                {trx.type === 'INCOME' ? '+' : '-'}{formatRupiah(Number(trx.amount))}
              </span>
            </div>
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
