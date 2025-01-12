'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { promises } from 'dns'

interface AuthResponse{
    error: null | string
    success: boolean
    data: unknown| null
}

  /**
   * Sign up a user and return the response
   * @param formData The form data, should contain email, password and full_name
   * @returns A promise that resolves with an object containing the following properties:
   * - error: null or a string describing the error
   * - success: boolean indicating if the request was successful
   * - data: the response data from supabase, or null if the request failed
   */
export async function signup(formData: FormData):Promise<AuthResponse> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
        data: {
            full_name: formData.get('full_name') as string,
        }
    }
  }

  const { data:signupData, error } = await supabase.auth.signUp(data)

  // Placeholder response
  return {
    error: error?.message || "There was an error signing up",
    success: !error,
    data: signupData || null
  }
}



/**
 * Sign in a user and return the response
 * @param formData The form data, should contain email and password
 * @returns A promise that resolves with an object containing the following properties:
 * - error: null or a string describing the error
 * - success: boolean indicating if the request was successful
 * - data: the response data from supabase, or null if the request failed
 */

export async function login(formData: FormData):Promise<AuthResponse> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    
  }

  const { data:signinData, error } = await supabase.auth.signInWithPassword(data)

  // Placeholder response
  return {
    error: error?.message || "There was an error Logging in",
    success: !error,
    data: signinData || null
  }
}


export async function logout():Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}