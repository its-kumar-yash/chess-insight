"use server";

import { auth, signIn, signOut } from "@/lib/auth";

export async function googleSignIn() {
  return await signIn("google", { redirectTo: "/dashboard" });
}

export async function logOut() {
  return await signOut({ redirectTo: "/" });
}

export async function getUserSession() {
  const session = await auth();
  return session;
}

export async function signInWithCredentials(email: string, password: string) {
  return await signIn("credentials", {
    email,
    password,
    redirect: false,
  });
}
