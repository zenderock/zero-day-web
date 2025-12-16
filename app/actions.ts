"use server"

import { signIn, signOut } from "@/lib/auth"

export async function handleSignOut() {
  await signOut()
}

export async function handleSignIn() {
  await signIn("github")
}
