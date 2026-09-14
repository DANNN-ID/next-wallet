"use client";

import { ArrowLeft, Wallet, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";
import { addAccount } from "@/app/actions/account";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function NewAccountPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        const res = await addAccount(formData);
        if (res?.error) {
          setError(res.error);
        } else if (res?.success) {
          router.push("/accounts");
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat menambahkan dompet.");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 p-4 pt-10">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/accounts" className="p-2 bg-white rounded-full shadow-sm text-slate-500 hover:text-pink-500 active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Tambah Dompet</h1>
      </header>

      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-rose-500 bg-rose-50 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="name">
            Nama Dompet <span className="text-red-500">*</span>
          </label>
          <input 
            id="name" 
            name="name" 
            type="text" 
            required
            className="w-full px-4 py-3 rounded-xl bg-white border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 placeholder-slate-400"
            placeholder="Cth: BCA Utama, Gopay, Dompet Tunai"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="type">
            Jenis Dompet <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="relative cursor-pointer">
              <input type="radio" name="type" value="BANK" className="peer sr-only" required defaultChecked />
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border-2 border-transparent peer-checked:border-pink-500 peer-checked:bg-pink-50 shadow-sm transition-all text-slate-500 peer-checked:text-pink-600">
                <CreditCard className="w-6 h-6" />
                <span className="text-xs font-medium">Bank</span>
              </div>
            </label>
            <label className="relative cursor-pointer">
              <input type="radio" name="type" value="EWALLET" className="peer sr-only" required />
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border-2 border-transparent peer-checked:border-pink-500 peer-checked:bg-pink-50 shadow-sm transition-all text-slate-500 peer-checked:text-pink-600">
                <Wallet className="w-6 h-6" />
                <span className="text-xs font-medium">E-Wallet</span>
              </div>
            </label>
            <label className="relative cursor-pointer">
              <input type="radio" name="type" value="CASH" className="peer sr-only" required />
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border-2 border-transparent peer-checked:border-pink-500 peer-checked:bg-pink-50 shadow-sm transition-all text-slate-500 peer-checked:text-pink-600">
                <Banknote className="w-6 h-6" />
                <span className="text-xs font-medium">Tunai</span>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="initialBalance">
            Saldo Awal
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-500 font-medium">Rp</span>
            </div>
            <input 
              id="initialBalance" 
              name="initialBalance" 
              type="number" 
              min="0"
              step="1"
              defaultValue="0"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 placeholder-slate-400"
              placeholder="0"
            />
          </div>
          <p className="text-xs text-slate-500">Saldo saat ini di dompet tersebut.</p>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg shadow-pink-500/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none mt-4"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Dompet'}
        </button>
      </form>
    </div>
  );
}
