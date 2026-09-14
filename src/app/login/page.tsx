'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Wallet, Eye, EyeOff } from 'lucide-react'
import { login } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="flex flex-col min-h-screen p-6 bg-slate-50">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
        
        {/* Logo & Heading */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white mb-4 shadow-lg shadow-pink-500/30">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat Datang</h1>
          <p className="text-slate-500 text-sm">Masuk ke akun Dompetku Anda</p>
        </div>

        {/* Form */}
        <form action={onSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-rose-500 bg-rose-50 rounded-xl">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl bg-white border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 placeholder-slate-400"
              placeholder="nama@email.com"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="password">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"}
                required 
                className="w-full px-4 py-3 rounded-xl bg-white border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 placeholder-slate-400 pr-12"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg shadow-pink-500/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none mt-4"
          >
            {isPending ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Belum punya akun?{' '}
          <Link href="/register" className="font-semibold text-pink-500 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
