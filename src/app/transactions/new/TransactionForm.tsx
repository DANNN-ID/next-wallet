"use client";

import { useState, useTransition } from "react";
import { addTransaction } from "@/app/actions/transaction";
import { ArrowDownCircle, ArrowUpCircle, Wallet, CreditCard, Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import CurrencyInput from "@/components/CurrencyInput";
import CustomSelect, { Option } from "@/components/CustomSelect";

export default function TransactionForm({ accounts, categories }: { accounts: any[], categories: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState("EXPENSE"); // Default to Pengeluaran

  const accountOptions: Option[] = accounts.map(acc => {
    let Icon = Wallet;
    if (acc.type === 'BANK') Icon = CreditCard;
    if (acc.type === 'CASH') Icon = Banknote;
    
    return {
      value: acc.id,
      label: acc.name,
      description: `Rp ${Number(acc.initial_balance).toLocaleString('id-ID')}`,
      icon: <Icon className="w-5 h-5 text-slate-500" />
    };
  });

  const categoryOptions: Option[] = categories
    .filter(cat => cat.type === type)
    .map(cat => ({
      value: cat.id,
      label: cat.name,
      icon: <span className="text-xl">{cat.icon}</span>
    }));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("type", type);
    
    startTransition(async () => {
      try {
        const res = await addTransaction(formData);
        if (res?.error) {
          setError(res.error);
        } else if (res?.success) {
          router.push("/transactions");
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat menyimpan transaksi.");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-rose-500 bg-rose-50 rounded-xl">
          {error}
        </div>
      )}

      {/* Type Toggle */}
      <div className="flex p-1 bg-slate-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setType("EXPENSE")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
            type === "EXPENSE" 
              ? "bg-white text-rose-500 shadow-sm" 
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <ArrowUpCircle className="w-4 h-4" />
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => setType("INCOME")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
            type === "INCOME" 
              ? "bg-white text-emerald-500 shadow-sm" 
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <ArrowDownCircle className="w-4 h-4" />
          Pemasukan
        </button>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="amount">
          Nominal <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-500 font-medium">Rp</span>
          </div>
          <CurrencyInput name="amount" placeholder="0" />
        </div>
      </div>

      <div className="space-y-1.5 z-40 relative">
        <label className="text-sm font-medium text-slate-700" htmlFor="accountId">
          Pilih Dompet <span className="text-red-500">*</span>
        </label>
        <CustomSelect 
          name="accountId"
          options={accountOptions}
          placeholder="Pilih sumber dana..."
          required
        />
      </div>

      <div className="space-y-1.5 z-30 relative">
        <label className="text-sm font-medium text-slate-700" htmlFor="categoryId">
          Kategori <span className="text-red-500">*</span>
        </label>
        <CustomSelect 
          name="categoryId"
          options={categoryOptions}
          placeholder="Pilih kategori..."
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="date">
          Tanggal Transaksi <span className="text-red-500">*</span>
        </label>
        <input 
          id="date" 
          name="date" 
          type="date"
          required
          defaultValue={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 rounded-xl bg-white border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none text-slate-900"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="description">
          Catatan / Deskripsi
        </label>
        <textarea 
          id="description" 
          name="description" 
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 placeholder-slate-400 resize-none"
          placeholder="Tulis catatan (opsional)"
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg shadow-pink-500/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none mt-4"
      >
        {isPending ? 'Menyimpan...' : 'Simpan Transaksi'}
      </button>
    </form>
  );
}
