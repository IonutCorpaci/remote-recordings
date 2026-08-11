"use server";

import { deleteSessionCookie } from "@/features/auth/utils/session";
import { redirect } from "next/navigation";

export async function logout() {
  await deleteSessionCookie();
  redirect("/login");
}
