import { Wallet, Plus, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Accounts and their current balances
  const { data: accounts, error } = await supabase
    .from('accounts')
    .select(`
      id,
      name,
      type,
      initial_balance
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Accounts fetch error:", error);
  }
  // or calculate them. Wait, the view `account_balances` has the actual total.
  const { data: balances } = await supabase
    .from('account_balances')
    .select('account_id, current_balance');

  const getBalance = (accountId: string) => {
    const balanceObj = balances?.find(b => b.account_id === accountId);
    return balanceObj ? Number(balanceObj.current_balance) : 0;
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const totalAllBalances = accounts?.reduce((acc, curr) => acc + getBalance(curr.id), 0) || 0;

  return (
    <div className="p-4 pt-10 pb-24 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Dompet Anda</h1>
        <p className="text-slate-500 text-sm">Kelola semua sumber dana Anda</p>
      </header>

      {/* Total Card */}
      <div className="rounded-3xl bg-gradient-to-br from-pink-400 to-rose-500 p-6 text-white shadow-lg shadow-pink-500/30">
        <p className="text-pink-50 text-sm mb-1">Total Saldo Semua Dompet</p>
        <h2 className="text-3xl font-bold">{formatRupiah(totalAllBalances)}</h2>
      </div>

      {/* Accounts List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-900">Daftar Dompet</h3>
        </div>

        {(!accounts || accounts.length === 0) ? (
          <div className="text-center py-8 text-slate-500 text-sm">Belum ada dompet. Tambahkan dompet pertama Anda.</div>
        ) : (
          accounts.map(account => (
            <div key={account.id} className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm active:scale-95 transition-transform cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${account.type === 'CASH' ? 'bg-emerald-50 text-emerald-500' : account.type === 'BANK' ? 'bg-pink-50 text-pink-500' : 'bg-purple-50 text-purple-500'}`}>
                  {account.type === 'CASH' ? <Wallet className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{account.name}</h4>
                  <p className="text-xs text-slate-500">{account.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">{formatRupiah(getBalance(account.id))}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 max-w-[480px] w-full px-4 pointer-events-none flex justify-end z-40">
        <Link href="/accounts/new" className="pointer-events-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/40 hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all">
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
