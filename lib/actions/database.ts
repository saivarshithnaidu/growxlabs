"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

/* --- LEADS / CONTACT --- */

export async function submitLead(formData: { name: string; email: string; message: string }) {
  const { error } = await supabaseAdmin.from("leads").insert([formData]);

  
  if (error) {
    console.error("Error submitting lead:", error);
    throw new Error("Failed to save lead.");
  }
  
  revalidatePath("/dashboard/requests");
  return { success: true };
}

/* --- PROJECTS --- */

export async function createProject(data: { client_id: string; title: string; status: string; description: string }) {
  const supabase = await createClient();
  
  // Check if admin
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  
  if (profile?.role !== "ADMIN" && profile?.role !== "CO_ADMIN") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.from("projects").insert([data]);
  if (error) throw error;
  
  revalidatePath("/dashboard/projects");
}

export async function updateProjectStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update({ status }).eq("id", id);
  if (error) throw error;
  revalidatePath("/dashboard/projects");
}

/* --- REQUESTS --- */

export async function submitProjectRequest(message: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get client_id from profiles/clients link
  const { data: client } = await supabase.from("clients").select("id").eq("profile_id", user?.id).single();
  
  if (!client) throw new Error("Client account not found");

  const { error } = await supabase.from("requests").insert([{
    client_id: client.id,
    message,
    status: "Open"
  }]);
  
  if (error) throw error;
  revalidatePath("/dashboard/requests");
}
