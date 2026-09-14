'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Wallet } from 'lucide-react'
import { login } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function onSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex flex-col min-h-screen p-6 bg-slate-50 dark:bg-slate-950">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
        
        {/* Logo & Heading */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-500/30">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Selamat Datang</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Masuk ke akun Dompetku Anda</p>
        </div>

        {/* Form */}
        <form action={onSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 rounded-xl">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-none shadow-sm focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white placeholder-slate-400"
              placeholder="nama@email.com"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password"
              required 
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border-none shadow-sm focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white placeholder-slate-400"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none mt-4"
          >
            {isPending ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Belum punya akun?{' '}
          <Link href="/register" className="font-semibold text-blue-600 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
