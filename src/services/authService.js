import { supabase } from '../lib/supabase'

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const getSession = async () => {
  return await supabase.auth.getSession()
}

export const getProfile = async (userId) => {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
}
