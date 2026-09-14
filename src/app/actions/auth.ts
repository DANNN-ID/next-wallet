'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const rawEmail = formData.get('email') as string
  const rawPassword = formData.get('password') as string

  if (!rawEmail || !rawPassword) {
    return { error: 'Email dan password wajib diisi' }
  }

  const email = rawEmail.trim().toLowerCase()
  const password = rawPassword.trim()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const rawEmail = formData.get('email') as string
  const rawPassword = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  if (!rawEmail || !rawPassword || !fullName) {
    return { error: 'Semua field wajib diisi' }
  }

  const email = rawEmail.trim().toLowerCase()
  const password = rawPassword.trim()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  // Profil akan dibuat secara otomatis melalui Trigger di database Supabase

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
