import { ArrowLeft, Plus, FolderTree } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TopBar from "@/components/TopBar";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch categories (Global + Own)
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('type', { ascending: true })
    .order('name', { ascending: true });

  const incomeCategories = categories?.filter(c => c.type === 'INCOME') || [];
  const expenseCategories = categories?.filter(c => c.type === 'EXPENSE') || [];

  return (
    <div className="pb-24 space-y-6">
      <TopBar title="Manajemen Kategori" />

      <div className="px-4 space-y-8">
        
        {/* Pemasukan */}
        <section>
          <h3 className="font-bold text-emerald-600 mb-3 flex items-center gap-2">
            Pemasukan
          </h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100 overflow-hidden">
            {incomeCategories.length === 0 ? (
              <p className="p-4 text-center text-sm text-slate-500">Belum ada kategori pemasukan.</p>
            ) : (
              incomeCategories.map(cat => (
                <div key={cat.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{cat.name}</p>
                      {cat.user_id === null && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full mt-1 inline-block">Bawaan Sistem</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Pengeluaran */}
        <section>
          <h3 className="font-bold text-rose-600 mb-3 flex items-center gap-2">
            Pengeluaran
          </h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100 overflow-hidden">
            {expenseCategories.length === 0 ? (
              <p className="p-4 text-center text-sm text-slate-500">Belum ada kategori pengeluaran.</p>
            ) : (
              expenseCategories.map(cat => (
                <div key={cat.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{cat.name}</p>
                      {cat.user_id === null && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full mt-1 inline-block">Bawaan Sistem</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-[480px] w-full px-4 pointer-events-none flex justify-end z-40">
        <Link href="/categories/new" className="pointer-events-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/40 hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all">
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
