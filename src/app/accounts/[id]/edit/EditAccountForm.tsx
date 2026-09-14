"use client";

import { ArrowLeft, Wallet, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";
import { updateAccount } from "@/app/actions/account";
import TopBar from "@/components/TopBar";
import CurrencyInput from "@/components/CurrencyInput";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function EditAccountForm({ account }: { account: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      try {
        const res = await updateAccount(account.id, formData);
        if (res?.error) {
          setError(res.error);
        } else if (res?.success) {
          router.push("/accounts");
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat menyimpan dompet.");
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24">
      <TopBar title="Edit Dompet" />

      <form onSubmit={onSubmit} className="space-y-6 px-4">
        {error && (
          <div className="p-3 text-sm text-rose-500 bg-rose-50 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-2.5">
          <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="name">
            Nama Dompet <span className="text-red-500">*</span>
          </label>
          <input 
            id="name" 
            name="name" 
            type="text" 
            required
            defaultValue={account.name}
            className="w-full px-4 py-3 rounded-xl bg-white border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 placeholder-slate-400"
            placeholder="Cth: BCA Utama, Gopay, Dompet Tunai"
          />
        </div>

        <div className="space-y-2.5">
          <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="type">
            Jenis Dompet <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="relative cursor-pointer">
              <input type="radio" name="type" value="BANK" className="peer sr-only" required defaultChecked={account.type === 'BANK'} />
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border-2 border-transparent peer-checked:border-pink-500 peer-checked:bg-pink-50 shadow-sm transition-all text-slate-500 peer-checked:text-pink-600">
                <CreditCard className="w-6 h-6" />
                <span className="text-xs font-medium">Bank</span>
              </div>
            </label>
            <label className="relative cursor-pointer">
              <input type="radio" name="type" value="EWALLET" className="peer sr-only" required defaultChecked={account.type === 'EWALLET'} />
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border-2 border-transparent peer-checked:border-pink-500 peer-checked:bg-pink-50 shadow-sm transition-all text-slate-500 peer-checked:text-pink-600">
                <Wallet className="w-6 h-6" />
                <span className="text-xs font-medium">E-Wallet</span>
              </div>
            </label>
            <label className="relative cursor-pointer">
              <input type="radio" name="type" value="CASH" className="peer sr-only" required defaultChecked={account.type === 'CASH'} />
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border-2 border-transparent peer-checked:border-pink-500 peer-checked:bg-pink-50 shadow-sm transition-all text-slate-500 peer-checked:text-pink-600">
                <Banknote className="w-6 h-6" />
                <span className="text-xs font-medium">Tunai</span>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="initialBalance">
            Saldo Awal
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-500 font-medium">Rp</span>
            </div>
            <CurrencyInput name="initial_balance" defaultValue={account.initial_balance} placeholder="0" />
          </div>
          <p className="text-xs text-slate-500">Ubah ini hanya jika Anda salah memasukkan saldo awal saat dompet dibuat.</p>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg shadow-pink-500/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none mt-4"
        >
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
}
