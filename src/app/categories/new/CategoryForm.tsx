"use client";

import { useState, useTransition } from "react";
import { addCategory } from "@/app/actions/category";
import { useRouter } from "next/navigation";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const EMOJIS = ["🍔", "🛒", "🚗", "🏥", "📚", "🎮", "👗", "🏠", "💡", "📱", "🎁", "✈️", "💰", "💼", "📈", "💵"];

export default function CategoryForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState("EXPENSE");
  const [selectedIcon, setSelectedIcon] = useState(EMOJIS[0]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("type", type);
    formData.append("icon", selectedIcon);
    
    startTransition(async () => {
      try {
        const res = await addCategory(formData);
        if (res?.error) {
          setError(res.error);
        } else if (res?.success) {
          router.push("/categories");
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat menyimpan kategori.");
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
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          Nama Kategori <span className="text-red-500">*</span>
        </label>
        <input 
          id="name" 
          name="name" 
          type="text" 
          required
          maxLength={30}
          className="w-full px-4 py-3 rounded-xl bg-white border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 placeholder-slate-400 font-semibold"
          placeholder="Cth: Cicilan Mobil"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Pilih Ikon <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {EMOJIS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => setSelectedIcon(emoji)}
              className={`text-2xl p-2 rounded-xl transition-all ${selectedIcon === emoji ? 'bg-pink-100 scale-110 shadow-sm border border-pink-200' : 'bg-white hover:bg-slate-50'}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg shadow-pink-500/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none mt-4"
      >
        {isPending ? 'Menyimpan...' : 'Simpan Kategori'}
      </button>
    </form>
  );
}
