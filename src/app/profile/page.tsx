import { User, Settings, Shield, HelpCircle, LogOut } from "lucide-react";
import TopBar from "@/components/TopBar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();

  const displayName = profile?.full_name || user.user_metadata?.full_name || 'Pengguna';

  return (
    <div className="pb-24 space-y-8">
      <TopBar title="Profil Saya" />

      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center space-y-4 pt-4 px-4">
        <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
          <User className="w-12 h-12" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
          <p className="text-slate-500">{user.email}</p>
        </div>
      </div>

      {/* Info Aplikasi */}
      <div className="space-y-4 px-4">
        <h3 className="font-semibold text-slate-900 px-2">Info Aplikasi</h3>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-4">
          <div className="flex items-center gap-3 text-slate-700">
            <Shield className="w-5 h-5 text-slate-400" />
            <div>
              <p className="font-medium">Dompetku v1.0</p>
              <p className="text-xs text-slate-500">Aplikasi Pencatat Keuangan Pribadi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <form action={logout} className="px-4">
        <button type="submit" className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100 transition-colors">
          <LogOut className="w-5 h-5" />
          Keluar dari Akun
        </button>
      </form>
    </div>
  );
}
