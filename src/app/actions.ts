"use server";
import { cookies } from "next/headers";

/** Who is chatting. Set by the name form, cleared by "Switch user"; Next re-renders the page on either. */
export async function setName(form: FormData) {
  const name = String(form.get("name") ?? "").trim().slice(0, 40);
  if (name) (await cookies()).set("name", name, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
}

export async function clearName() {
  (await cookies()).delete("name");
}
