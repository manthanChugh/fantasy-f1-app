'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // In a production app, you'd want to return an error message to the UI here
    redirect('/login?error=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=Could not sign up')
  }

  if (authData.user) {
    // Note: If you have email confirmations enabled, this user is created but unconfirmed.
    // We still insert them into 'players' so they can save team selections immediately or after confirmation.
    await supabase.from('players').insert({
      id: authData.user.id,
      name: email.split('@')[0], // Default name
      email: email
    });
  }

  // After signup, we show a success message because they need to check their email
  redirect('/login?message=Check your email to verify your account')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
