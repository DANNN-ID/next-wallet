"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function TransactionItem({ trx }: { trx: any }) {
  const [showModal, setShowModal] = useState(false);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-xl">
            {trx.categories?.icon || '📝'}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm line-clamp-1">{trx.description || trx.categories?.name || 'Transaksi'}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {trx.accounts?.name || 'Dompet'} • {new Date(trx.transaction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
        <span className={`font-bold text-sm shrink-0 ${trx.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-900'}`}>
          {trx.type === 'INCOME' ? '+' : '-'}{formatRupiah(Number(trx.amount))}
        </span>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center mt-2 mb-6">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-3xl mb-4">
                {trx.categories?.icon || '📝'}
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                {trx.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
              </p>
              <h3 className={`text-3xl font-bold tracking-tight ${trx.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-900'}`}>
                {trx.type === 'INCOME' ? '+' : '-'}{formatRupiah(Number(trx.amount))}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col bg-slate-50 p-4 rounded-2xl gap-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500">Tanggal</span>
                  <span className="text-sm font-semibold text-slate-900 text-right">
                    {new Date(trx.transaction_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500">Dompet</span>
                  <span className="text-sm font-semibold text-slate-900 text-right">
                    {trx.accounts?.name || 'Tidak diketahui'}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500 pt-0.5">Kategori</span>
                  <div className="flex items-center gap-1.5 text-right">
                    {trx.categories?.user_id && (
                      <span className="text-[10px] bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded font-semibold">Kustom</span>
                    )}
                    <span className="text-sm font-semibold text-slate-900">
                      {trx.categories?.name || 'Tidak ada kategori'}
                    </span>
                    {trx.categories?.icon && (
                      <span className="text-base">{trx.categories.icon}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="text-xs font-medium text-slate-500 block mb-1">Catatan / Deskripsi</span>
                <p className="text-sm font-medium text-slate-900 leading-relaxed break-words">
                  {trx.description || <span className="text-slate-400 italic">Tidak ada catatan</span>}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowModal(false)}
              className="w-full mt-6 py-3.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
