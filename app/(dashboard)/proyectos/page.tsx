import { createClient } from "@/lib/supabase/server";
import { ProyectosList } from "@/components/ProyectosList";
import type { ProjectWithProgress } from "@/lib/types";

export default async function ProyectosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects_with_progress")
    .select("*")
    .order("created_at", { ascending: false });

  return <ProyectosList projects={(data ?? []) as ProjectWithProgress[]} />;
}
