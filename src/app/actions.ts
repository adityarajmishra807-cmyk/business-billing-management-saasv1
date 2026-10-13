"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  error?: string;
  success?: string;
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function signInAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const email = readText(formData, "email").toLowerCase();
  const password = readText(formData, "password");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "We couldn't sign you in with those details. Check them and try again." };
  }

  redirect("/app");
}

export async function signUpAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const fullName = readText(formData, "fullName");
  const email = readText(formData, "email").toLowerCase();
  const password = readText(formData, "password");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  if (password.length < 8) {
    return { error: "Use a password with at least 8 characters." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: siteUrl + "/auth/callback"
    }
  });

  if (error) {
    return { error: "We couldn't create your account. Check the details or try signing in." };
  }

  if (data.session) {
    redirect("/app");
  }

  return { success: "Account created. Check your email to confirm your address, then sign in." };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createBusinessAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = readText(formData, "name");
  if (!name) {
    return { error: "Business name is required." };
  }

  const { count, error: countError } = await supabase
    .from("businesses")
    .select("id", { count: "exact", head: true })
    .eq("created_by", user.id);

  if (countError) {
    return { error: "We couldn't check your business limit. Please try again." };
  }

  if ((count ?? 0) >= 3) {
    return { error: "You can create up to 3 business profiles per account." };
  }

  const businessData = {
    name,
    business_type: readText(formData, "business_type") || null,
    contact_email: readText(formData, "contact_email") || null,
    phone: readText(formData, "phone") || null,
    address: readText(formData, "address") || null,
    gstin: readText(formData, "gstin").toUpperCase() || null,
    created_by: user.id
  };

  const { data, error } = await supabase
    .from("businesses")
    .insert(businessData)
    .select("id")
    .single();

  if (error || !data) {
    if (error?.message.includes("business_limit_reached")) {
      return { error: "You can create up to 3 business profiles per account." };
    }
    return { error: "We couldn't save the business profile. Please review the details and try again." };
  }

  revalidatePath("/app");
  redirect("/app/businesses/" + data.id);
}

export async function updateBusinessAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const businessId = readText(formData, "business_id");
  const name = readText(formData, "name");

  if (!businessId || !name) {
    return { error: "Business name is required." };
  }

  const { data, error } = await supabase
    .from("businesses")
    .update({
      name,
      business_type: readText(formData, "business_type") || null,
      contact_email: readText(formData, "contact_email") || null,
      phone: readText(formData, "phone") || null,
      address: readText(formData, "address") || null,
      gstin: readText(formData, "gstin").toUpperCase() || null
    })
    .eq("id", businessId)
    .select("id")
    .single();

  if (error || !data) {
    return { error: "We couldn't save those changes. Check your access and try again." };
  }

  revalidatePath("/app");
  revalidatePath("/app/businesses/" + businessId);
  revalidatePath("/app/businesses/" + businessId + "/settings");
  return { success: "Business profile updated." };
}
