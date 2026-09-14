import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import TopBar from "@/components/TopBar";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const filter = (resolvedParams.filter as string) || "this_month";

  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();
  let periodLabel = "Bulan Ini";
  
  if (filter === 'this_month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    periodLabel = "Bulan Ini";
  } else if (filter === 'last_month') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    periodLabel = "Bulan Lalu";
  } else if (filter === '3_months') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    periodLabel = "3 Bulan Terakhir";
  }

  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', user.id)
    .gte('transaction_date', startDate.toISOString())
    .lte('transaction_date', endDate.toISOString());

  let income = 0;
  let expense = 0;
  
  if (transactions) {
    transactions.forEach(trx => {
      if (trx.type === 'INCOME') income += Number(trx.amount);
      if (trx.type === 'EXPENSE') expense += Number(trx.amount);
    });
  }
  
  const difference = income - expense;
  
  // Calculate percentage safely
  let expensePercentage = 0;
  if (income > 0) {
    expensePercentage = Math.min(Math.round((expense / income) * 100), 100);
  } else if (expense > 0) {
    expensePercentage = 100;
  }

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="pb-24 space-y-6">
      <TopBar title="Analitik" />

      {/* Tabs Filter */}
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 mx-4">
        <Link 
          href="/analytics?filter=this_month" 
          className={`flex-1 py-2 text-center text-sm font-medium rounded-xl transition-all ${filter === 'this_month' ? 'bg-white shadow-sm text-pink-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Bulan Ini
        </Link>
        <Link 
          href="/analytics?filter=last_month" 
          className={`flex-1 py-2 text-center text-sm font-medium rounded-xl transition-all ${filter === 'last_month' ? 'bg-white shadow-sm text-pink-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Bulan Lalu
        </Link>
        <Link 
          href="/analytics?filter=3_months" 
          className={`flex-1 py-2 text-center text-sm font-medium rounded-xl transition-all ${filter === '3_months' ? 'bg-white shadow-sm text-pink-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          3 Bulan
        </Link>
      </div>

      {/* Selisih */}
      <div className="text-center mb-8 pt-4 px-4">
        <p className="text-sm font-medium text-slate-500 mb-2">Selisih Bersih ({periodLabel})</p>
        <h2 className={`text-4xl font-bold tracking-tight ${difference >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {difference >= 0 ? '+' : '-'}{formatRupiah(Math.abs(difference))}
        </h2>
      </div>

      {/* Total Income / Expense */}
      <div className="grid grid-cols-2 gap-4 mb-8 px-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-emerald-500 mb-3">
            <ArrowDownCircle className="w-6 h-6" />
            <span className="text-sm font-semibold text-slate-600">Pemasukan</span>
          </div>
          <p className="font-bold text-slate-900 text-lg">{formatRupiah(income)}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-rose-500 mb-3">
            <ArrowUpCircle className="w-6 h-6" />
            <span className="text-sm font-semibold text-slate-600">Pengeluaran</span>
          </div>
          <p className="font-bold text-slate-900 text-lg">{formatRupiah(expense)}</p>
        </div>
      </div>

      {/* Donut Chart Rasio */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center mt-4 mx-4">
        <h3 className="font-bold text-slate-900 mb-8 w-full text-left">Rasio Pengeluaran</h3>
        
        <div className="relative w-56 h-56 rounded-full flex items-center justify-center shadow-sm"
             style={{
               background: `conic-gradient(#f43f5e ${expensePercentage}%, #f8fafc ${expensePercentage}% 100%)`
             }}>
          <div className="w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="text-4xl font-bold text-slate-900 mb-1">{expensePercentage}%</span>
            <span className="text-[10px] text-slate-500 font-medium text-center px-4 uppercase tracking-wider">
              {expensePercentage >= 100 ? 'Melebihi Batas' : 'Dari Pemasukan'}
            </span>
          </div>
        </div>
        
        <div className="mt-8 flex items-center gap-6 text-sm w-full justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></div>
            <span className="text-slate-600 font-medium">Terpakai</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-100 shadow-inner"></div>
            <span className="text-slate-600 font-medium">Tersisa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
