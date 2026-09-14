import { User, Settings, Shield, HelpCircle, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "./actions/auth";

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
    <div className="p-4 pt-10 pb-24 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center space-y-4 pt-4">
        <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <User className="w-12 h-12" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{displayName}</h1>
          <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
        </div>
      </div>

      {/* Menu Settings */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white px-2">Pengaturan</h3>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <User className="w-5 h-5 text-slate-400" />
              <span className="font-medium">Edit Profil</span>
            </div>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <Shield className="w-5 h-5 text-slate-400" />
              <span className="font-medium">Keamanan & Password</span>
            </div>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <HelpCircle className="w-5 h-5 text-slate-400" />
              <span className="font-medium">Pusat Bantuan</span>
            </div>
          </button>
        </div>
      </div>

      {/* Logout */}
      <form action={logout}>
        <button type="submit" className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-500 font-semibold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors">
          <LogOut className="w-5 h-5" />
          Keluar dari Akun
        </button>
      </form>
    </div>
  );
}
