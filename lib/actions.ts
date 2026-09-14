"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  return { supabase, user };
}

// ---------- Clientes ----------

export async function createClientRecord(formData: FormData) {
  const { supabase, user } = await requireUser();
  const name = String(formData.get("name") || "").trim();
  const country_code = String(formData.get("country_code") || "") || null;

  if (!name) throw new Error("El nombre es obligatorio");

  const countryName = country_code
    ? (await import("@/lib/countries")).countryName(country_code)
    : null;

  const { error } = await supabase.from("clients").insert({
    user_id: user.id,
    name,
    country_code,
    country: countryName,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function deleteClientRecord(clientId: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("clients").delete().eq("id", clientId);
  if (error) throw new Error(error.message);
  revalidatePath("/clientes");
}

// ---------- Proyectos ----------

export async function createProject(formData: FormData) {
  const { supabase, user } = await requireUser();
  const name = String(formData.get("name") || "").trim();
  const client_id = String(formData.get("client_id") || "");
  const amount = Number(formData.get("amount") || 0);
  const deadline = String(formData.get("deadline") || "") || null;

  if (!name || !client_id) throw new Error("Nombre y cliente son obligatorios");

  const { data, error } = await supabase
    .from("projects")
    .insert({ user_id: user.id, name, client_id, amount, deadline })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/proyectos");
  revalidatePath("/");
  redirect(`/proyectos/${data.id}`);
}

export async function updateProject(projectId: string, formData: FormData) {
  const { supabase } = await requireUser();
  const name = String(formData.get("name") || "").trim();
  const amount = Number(formData.get("amount") || 0);
  const deadline = String(formData.get("deadline") || "") || null;

  const { error } = await supabase
    .from("projects")
    .update({ name, amount, deadline })
    .eq("id", projectId);
  if (error) throw new Error(error.message);

  revalidatePath(`/proyectos/${projectId}`);
  revalidatePath("/proyectos");
  revalidatePath("/");
}

export async function toggleArchiveProject(projectId: string, archive: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("projects")
    .update({ archived_at: archive ? new Date().toISOString() : null })
    .eq("id", projectId);
  if (error) throw new Error(error.message);

  revalidatePath("/proyectos");
  revalidatePath("/");
}

export async function deleteProject(projectId: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) throw new Error(error.message);
  revalidatePath("/proyectos");
  revalidatePath("/");
  redirect("/proyectos");
}

// ---------- Fases ----------

export async function createPhase(projectId: string, formData: FormData) {
  const { supabase, user } = await requireUser();
  const name = String(formData.get("name") || "").trim();
  const deadline = String(formData.get("deadline") || "") || null;
  if (!name) throw new Error("El nombre de la fase es obligatorio");

  const { count } = await supabase
    .from("phases")
    .select("id", { count: "exact", head: true })
    .eq("project_id", projectId);

  const { error } = await supabase.from("phases").insert({
    user_id: user.id,
    project_id: projectId,
    name,
    deadline,
    order_index: count ?? 0,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/proyectos/${projectId}`);
  revalidatePath("/");
  revalidatePath("/proyectos");
}

export async function togglePhase(phaseId: string, projectId: string, complete: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("phases")
    .update({ completed_at: complete ? new Date().toISOString() : null })
    .eq("id", phaseId);
  if (error) throw new Error(error.message);

  revalidatePath(`/proyectos/${projectId}`);
  revalidatePath("/");
  revalidatePath("/proyectos");
}

export async function deletePhase(phaseId: string, projectId: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("phases").delete().eq("id", phaseId);
  if (error) throw new Error(error.message);

  revalidatePath(`/proyectos/${projectId}`);
  revalidatePath("/");
  revalidatePath("/proyectos");
}

// ---------- Sesión ----------

export async function signOut() {
  const { supabase } = await requireUser();
  await supabase.auth.signOut();
  redirect("/login");
}
