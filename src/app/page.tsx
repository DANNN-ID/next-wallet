import { ArrowDownCircle, ArrowUpCircle, Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "./actions/auth";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();
    
  const displayName = profile?.full_name || user.user_metadata?.full_name || 'Pengguna';

  // Fetch Total Balance from view
  const { data: balances } = await supabase
    .from('account_balances')
    .select('current_balance')

  const totalBalance = balances?.reduce((acc, curr) => acc + Number(curr.current_balance), 0) || 0;

  // Fetch Recent Transactions
  const { data: recentTrx } = await supabase
    .from('transactions')
    .select(`
      id,
      amount,
      type,
      description,
      transaction_date,
      categories (name, icon)
    `)
    .order('transaction_date', { ascending: false })
    .limit(5);

  // Calculate Income/Expense for this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: monthlyTrx } = await supabase
    .from('transactions')
    .select('amount, type')
    .gte('transaction_date', startOfMonth.toISOString());

  let monthlyIncome = 0;
  let monthlyExpense = 0;

  if (monthlyTrx) {
    for (const trx of monthlyTrx) {
      if (trx.type === 'INCOME') monthlyIncome += Number(trx.amount);
      if (trx.type === 'EXPENSE') monthlyExpense += Number(trx.amount);
    }
  }

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="p-4 pt-10 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">Selamat datang kembali,</p>
          <h1 className="text-xl font-bold text-slate-900">{displayName}</h1>
        </div>
        <form action={logout}>
          <button type="submit" title="Keluar" className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 active:scale-95 transition-transform cursor-pointer border-none">
            <LogOut className="w-5 h-5 ml-1" />
          </button>
        </form>
      </header>

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-400 to-rose-500 p-6 text-white shadow-lg shadow-pink-500/30">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white/20 blur-xl"></div>
        
        <div className="relative z-10">
          <p className="text-pink-50 text-sm font-medium mb-1">Total Saldo</p>
          <h2 className="text-3xl font-bold tracking-tight mb-6">{formatRupiah(totalBalance)}</h2>
          
          <div className="flex justify-between items-center pt-4 border-t border-white/20">
            <div>
              <p className="text-pink-100 text-xs mb-1">Pemasukan Bulan Ini</p>
              <div className="flex items-center gap-1">
                <ArrowDownCircle className="w-4 h-4 text-white" />
                <span className="font-semibold text-sm">{formatRupiah(monthlyIncome)}</span>
              </div>
            </div>
            <div>
              <p className="text-pink-100 text-xs mb-1 text-right">Pengeluaran Bulan Ini</p>
              <div className="flex items-center justify-end gap-1">
                <ArrowUpCircle className="w-4 h-4 text-white/90" />
                <span className="font-semibold text-sm">{formatRupiah(monthlyExpense)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/transactions/new?type=income" className="flex items-center gap-3 p-4 rounded-2xl bg-white shadow-sm active:scale-95 transition-transform">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500">
            <ArrowDownCircle className="w-6 h-6" />
          </div>
          <span className="font-medium text-slate-700">Pemasukan</span>
        </Link>
        <Link href="/transactions/new?type=expense" className="flex items-center gap-3 p-4 rounded-2xl bg-white shadow-sm active:scale-95 transition-transform">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-500">
            <ArrowUpCircle className="w-6 h-6" />
          </div>
          <span className="font-medium text-slate-700">Pengeluaran</span>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900">Transaksi Terbaru</h3>
          <Link href="/transactions" className="text-sm text-pink-500 font-medium">Lihat Semua</Link>
        </div>
        
        <div className="space-y-3">
          {(!recentTrx || recentTrx.length === 0) ? (
            <div className="text-center py-8 text-slate-500 text-sm">Belum ada transaksi.</div>
          ) : recentTrx.map((trx: any) => (
            <div key={trx.id} className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-xl">
                  {trx.categories?.icon || '📝'}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{trx.description || trx.categories?.name || 'Transaksi'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {trx.categories?.name || 'Tanpa kategori'} • {new Date(trx.transaction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
              <span className={`font-bold text-sm ${trx.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-900'}`}>
                {trx.type === 'INCOME' ? '+' : '-'}{formatRupiah(Number(trx.amount))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button for easy access */}
      <div className="fixed bottom-20 right-4 max-w-[480px] w-full mx-auto pointer-events-none flex justify-end">
        <Link href="/transactions/new" className="pointer-events-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/40 hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all">
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
